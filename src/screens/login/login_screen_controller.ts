import RequestHandlerImpl from "../../services/RequestHandler.ts";
import { Notification } from "./login_screen.tsx";

export default class LoginController {
  private static _instance: LoginController | null = null;

  private notificationCallback: Function | null = null;

  private requestHandler = RequestHandlerImpl.getInstance();

  static getInstance() {
    if (this._instance === null) {
      this._instance = new LoginController();
    }
    return this._instance;
  }

  setNotificationCallback(callback: Function) {
    // Ensure the callback is properly set and bound
    this.notificationCallback = callback.bind(this);
  }

  async loginUser(email: string, password: string, rememberMe: boolean) {
    try {
      const response = await this.requestHandler.loginUser(
        email,
        password,
        rememberMe
      );

      if (response.status === 200) {
        // Notify success
        this.notify({
          eventType: "success",
          message: "Login successful!",
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
            message: `Login failed:\n${errorDetails}`,
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
      console.error("Unexpected error during login:", error);

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
