import RequestHandlerImpl from "../../services/RequestHandler.ts";
import { Notification } from "../login/login_screen.tsx";

export default class RegisterController {
  private static _instance: RegisterController | null = null;

  private notificationCallback: Function | null = null;

  private requestHandler = RequestHandlerImpl.getInstance();

  static getInstance() {
    if (this._instance === null) {
      this._instance = new RegisterController();
    }
    return this._instance;
  }

  setNotificationCallback(callback: Function) {
    // Ensure the callback is properly set and bound
    this.notificationCallback = callback.bind(this);
  }

  async registerUser( email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    studyLevel: string,
    rememberMe: boolean) {
    try {
      const response = await this.requestHandler.signUpUser(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        studyLevel,
        rememberMe
      );
      
      if (response.status === 200 || response.status === 201 ) {
        // Notify success
        this.notify({
          eventType: "success",
          message: "Registration successful!",
        });
        return response;
      } else {
        // Handle errors and notify
        if (response.errors && response.errors.size > 0) {
           
          // Extract errors and create a detailed message
          const errorDetails = Array.from(response.errors.entries())
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");

          this.notify({
            eventType: "error",
            message: `Registration failed!`,
          });
        } else {
          this.notify({
            eventType: "error",
            message: response.message || "An unknown error occurred.",
          });
        }
        return response;
      }
    } catch (error) {
      console.error("Unexpected error during registration:", error);

      // Notify unexpected error
      this.notify({
        eventType: "error",
        message: "Unexpected error occurred. Please try again later.",
      });

      // Return a consistent error response
      return {
        status: 500,
        message: "Unexpected error occurred",
        errors: null,
      };
    }
  }

  private notify(notification: Notification) {
    if (this.notificationCallback) {
      this.notificationCallback(notification);
    } else {
      console.warn(
        "Notification callback is not set. Notification not sent:",
        notification
      );
    }
  }
}
