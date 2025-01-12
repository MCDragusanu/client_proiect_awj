import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface Credentials {
  userUid: string;
  accessToken: string;
}

interface AuthResponse {
  status: number;
  message: string;
  errors: Map<string, string> | null; // Updated for error handling
}

interface Response {
  statusCode: number;
  message: string;
  payLoad: any;
}

interface RequestHandler {
  getCredentials(): Credentials;

  setCredentials(credentials: Credentials);

  loginUser(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<AuthResponse>;

  signUpUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    studyLevel: string,
    rememberMe: boolean
  ): Promise<AuthResponse>;

  refreshToken(): Promise<AuthResponse>;

  sendRequest(
    subRoute: string,
    payload: any,
    method: string
  ): Promise<Response>;
}

export default class RequestHandlerImpl implements RequestHandler {
  private credentials: Credentials;
  private axiosInstance: AxiosInstance;
  private static _instance: RequestHandlerImpl | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: "http://localhost:8080", // Replace with actual backend URL
      withCredentials: true,
    });
    this.getCredentialsFromStorage();
  }

  static getInstance(): RequestHandlerImpl {
    if (this._instance === null) {
      this._instance = new RequestHandlerImpl();
    }
    return this._instance;
  }

  getCredentials(): Credentials {
    return this.credentials;
  }

  setCredentials(credentials: Credentials): void {
    this.credentials = credentials;
    console.log("Credentials set:", credentials);
  }

  async loginUser(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<AuthResponse> {
    try {
      const result: AxiosResponse = await this.axiosInstance.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      const { accessToken, userUid } = result.data;

      const credentials: Credentials = {
        accessToken,
        userUid,
      };

      if (rememberMe) {
        this.setWithExpiry(
          "credentials",
          JSON.stringify(credentials),
          30 * 24 * 3600 // 30 days in seconds
        );
      }
      this.setCredentials(credentials);

      return {
        status: 200,
        message: "Login successful",
        errors: null,
      };
    } catch (error) {
      console.error("Login failed:", error.response?.data);

      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Login failed",
        errors: this.extractErrors(error.response?.data || {}),
      };
    }
  }

  async signUpUser(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    studyLevel: string,
    rememberMe: boolean
  ): Promise<AuthResponse> {
    try {
      const result: AxiosResponse = await this.axiosInstance.post(
        "/api/auth/registration",
        {
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          studyLevel,
        }
      );

      const { accessToken, userUid } = result.data;

      const credentials: Credentials = {
        accessToken,
        userUid,
      };

      if (rememberMe) {
        this.setWithExpiry(
          "credentials",
          JSON.stringify(credentials),
          30 * 24 * 3600
        );
      }
      this.setCredentials(credentials);
      console.log("Registration completed successfully!");
      return {
        status: 201,
        message: "Registration successful",
        errors: null,
      };
    } catch (error) {
      console.error("Registration failed:", error.response?.data);

      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Registration failed",
        errors: this.extractErrors(error.response?.data || {}),
      };
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const result: AxiosResponse = await this.axiosInstance.post(
        "/api/auth/refresh"
      );

      const { accessToken } = result.data;

      const updatedCredentials: Credentials = {
        ...this.credentials,
        accessToken,
      };

      if (this.isRememberMeEnabled()) {
        this.setWithExpiry(
          "credentials",
          JSON.stringify(updatedCredentials),
          30 * 24 * 3600
        );
      }
      this.setCredentials(updatedCredentials);
      return {
        status: 200,
        message: "Token refreshed successfully",
        errors: null,
      };
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data);

      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Token refresh failed",
        errors: this.extractErrors(error.response?.data?.errors || {}),
      };
    }
  }

  async sendRequest(
    subRoute: string,
    payload: any,
    method: string
  ): Promise<Response> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: subRoute,
        data: payload,
        headers: {
          Authorization: `Bearer ${this.credentials.accessToken}`,
        },
      };

      const result: AxiosResponse = await this.axiosInstance(config);

      return {
        statusCode: result.status,
        message: "Request successful",
        payLoad: result.data,
      };
    } catch (error) {
      console.error(`Request failed @${subRoute}:`, error.response?.data);

      return {
        statusCode: error.response?.status || 500,
        message: error.response?.data?.message || "Request failed",
        payLoad: null,
      };
    }
  }

  private getCredentialsFromStorage(): void {
    const result = localStorage.getItem("credentials");
    if (result) {
      const parsedCredentials = JSON.parse(result);
      this.credentials = {
        accessToken: parsedCredentials.accessToken,
        userUid: parsedCredentials.userUid,
      };
    } else {
      console.log("No stored credentials found.");
    }
  }

  private setWithExpiry(key: string, value: string, expiration: number): void {
    const now = new Date();
    const item = {
      value,
      expiry: now.getTime() + expiration * 1000,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  private extractErrors(errors: any): Map<string, string> {
    console.log("Processing errors : ", errors);
    const errorMap = new Map<string, string>();
    if (errors && typeof errors === "object") {
      Object.keys(errors).forEach((key) => {
        errorMap.set(key, errors[key]);
      });
    }
    return errorMap;
  }
  isRememberMeEnabled(): boolean {
    return localStorage.getItem("credentials") !== null;
  }
  storeCredentialsLocally() {
    this.setWithExpiry(
      "credentials",
      JSON.stringify(this.getCredentials()),
      30 * 24 * 3600
    );
  }
}
