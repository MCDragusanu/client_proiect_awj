import RequestHandlerImpl from "../../services/RequestHandler.ts";

export interface UserProfile {
  uid: string;
  email : string;
  registerDate : string,
  phoneNumber: string;
  firstName: string;
  lastName: string;
  studyLevel: string;
}

export interface Activity {
  activityUid: string;
  dayOfWeek: string;
  startTime: Date;
  endTime: string;
  type: string; // one-time, repeating n-times, indefinite;
  name: string;
  description: string;
  category: string; // the user will include it in a group school, hobby, etc.;
  hexGradientStart: string;
  hexGradientEnd: string;
}

export interface Task {
  taskUid: string;
  activityUid: string;
  priorityLevel: string;
  name: string;
  description: string;
  taskIndex: number;
  hexColor: string;
  status: string;
}

export class HomeController {
  private static _instance: HomeController | null = null;
  private requestHandler = RequestHandlerImpl.getInstance();
  private notificationCallback: Function | null = null;

  public static getInstance(): HomeController {
    if (this._instance === null) {
      this._instance = new HomeController();
    }
    return this._instance;
  }

  setNotificationCallback(callback: Function) {
    // Ensure the callback is properly set and bound
    this.notificationCallback = callback.bind(this);
  }

  // Refresh token before every request
  private async refreshTokenIfNeeded(): Promise<void> {
    try {
      const response = await this.requestHandler.refreshToken();
      if (response.status === 200) {
        console.log("Token refreshed successfully");
      } else {
        console.error("Token refresh failed:", response.message);
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      if (this.notificationCallback) {
        this.notificationCallback("error", "Failed to refresh token. Please log in again.");
      }
    }
  }

  async getProfile(userUid: string): Promise<UserProfile | null> {
    await this.refreshTokenIfNeeded(); // Ensure the token is refreshed before requesting the profile

    const currentUserUid = this.requestHandler.getCredentials().userUid;
    if (userUid !== currentUserUid) {
      throw new Error("User UID mismatch");
    }

    try {
      // Send request to get user profile from API
      const response = await this.requestHandler.sendRequest(
        `/api/data/user/${userUid}`,
        {},
        "GET"
      );
      if (response.statusCode === 200) {
        // Assuming the response contains the user profile details in the same format as the API returns
        const profileData = response.payLoad; // This would be the map returned by the API

        // Map the API response to UserProfile structure
        const userProfile: UserProfile = {
          registerDate : profileData["registerDate"],
          email : profileData["email"] as string,  
          uid: profileData["id"] as string,
          phoneNumber: profileData["phoneNumber"] as string,
          firstName: profileData["firstName"] as string,
          lastName: profileData["lastName"] as string,
          studyLevel: profileData["studyLevel"] as string,
        };

        console.log("Retrieved profile");
        return userProfile;
      } else {
        throw new Error(`Error fetching profile: ${response.message}`);
      }
    } catch (err) {
      console.error("Error fetching profile", err);
      if (this.notificationCallback) {
        this.notificationCallback("error", "Error has occurred while retrieving the profile!");
      }
      return null;
    }
  }

  async getActivities(userUid: string): Promise<Map<Activity, Task[]> | null> {
    await this.refreshTokenIfNeeded(); // Ensure the token is refreshed before requesting the activities

    const currentUserUid = this.requestHandler.getCredentials().userUid;
    if (userUid !== currentUserUid) {
      if (this.notificationCallback !== null) {
        this.notificationCallback("error", "Accessing restricted information");
      }
    }

    try {
      // Fetch activities for the user
      const activitiesResponse = await this.requestHandler.sendRequest(
        `/api/data/activity/${userUid}`,
        {},
        "GET"
      );
      if (activitiesResponse.statusCode !== 200) {
        throw new Error(
          `Error fetching activities: ${activitiesResponse.message}`
        );
      }

      const activities: Activity[] = activitiesResponse.payLoad.activities; // Assuming the response contains a list of activities

      const activitiesMap = new Map<Activity, Task[]>();

      // Fetch tasks for each activity
      for (const activity of activities) {
        const tasksResponse = await this.requestHandler.sendRequest(
          `/api/data/task/${activity.activityUid}`,
          {},
          "GET"
        );
        if (tasksResponse.statusCode === 200) {
          activitiesMap.set(activity, tasksResponse.payLoad.tasks as Task[]); // Assuming the response contains a list of tasks
        } else {
          console.error(`Error fetching tasks for activity ${activity.activityUid}`);
        }
      }

      return activitiesMap;
    } catch (err) {
      console.error("Error fetching activities", err);
      if (this.notificationCallback !== null) {
        this.notificationCallback("error", "Error occurred while retrieving activities");
      }
      return null;
    }
  }

  getMockData = () => {
    return [
      {
        activityUid: "1",
        dayOfWeek: "Monday",
        startTime: new Date("2024-01-01T09:00:00"),
        endTime: "10:00",
        type: "one-time",
        name: "New Year's Morning Yoga",
        description: "Start the year with a refreshing yoga session.",
        category: "Health",
        hexGradientStart: "#FF7F50", // coral
        hexGradientEnd: "#FF6347", // tomato
      },
      {
        activityUid: "2",
        dayOfWeek: "Monday",
        startTime: new Date("2024-01-01T12:00:00"),
        endTime: "14:00",
        type: "one-time",
        name: "New Year's Family Brunch",
        description: "Celebrate the new year with a cozy family brunch.",
        category: "Social",
        hexGradientStart: "#FFD700", // gold
        hexGradientEnd: "#FF8C00", // dark orange
      },
      {
        activityUid: "3",
        dayOfWeek: "Sunday",
        startTime: new Date("2024-01-14T14:00:00"),
        endTime: "16:00",
        type: "one-time",
        name: "Doctor's Appointment",
        description: "Routine checkup with the doctor.",
        category: "Health",
        hexGradientStart: "#32CD32", // lime green
        hexGradientEnd: "#228B22", // forest green
      },
      {
        activityUid: "4",
        dayOfWeek: "Saturday",
        startTime: new Date("2024-01-20T16:00:00"),
        endTime: "18:00",
        type: "one-time",
        name: "Birthday Party",
        description: "Celebrate John's birthday with games and cake.",
        category: "Social",
        hexGradientStart: "#8A2BE2", // blue violet
        hexGradientEnd: "#9370DB", // medium purple
      },
      {
        activityUid: "5",
        dayOfWeek: "Wednesday",
        startTime: new Date("2024-01-24T19:00:00"),
        endTime: "20:30",
        type: "one-time",
        name: "Team Meeting",
        description: "Monthly team meeting to discuss progress and plans.",
        category: "Work",
        hexGradientStart: "#00BFFF", // deep sky blue
        hexGradientEnd: "#1E90FF", // dodger blue
      },
      {
        activityUid: "6",
        dayOfWeek: "Friday",
        startTime: new Date("2024-01-26T20:00:00"),
        endTime: "22:00",
        type: "one-time",
        name: "Movie Night",
        description: "Watch a new release with friends and snacks.",
        category: "Social",
        hexGradientStart: "#FF1493", // deep pink
        hexGradientEnd: "#FF69B4", // hot pink
      },
      {
        activityUid: "7",
        dayOfWeek: "Tuesday",
        startTime: new Date("2024-01-30T11:00:00"),
        endTime: "12:00",
        type: "one-time",
        name: "Yoga Class",
        description: "An hour of gentle yoga to start the day.",
        category: "Health",
        hexGradientStart: "#ADFF2F", // green yellow
        hexGradientEnd: "#228B22", // forest green
      },
      {
        activityUid: "8",
        dayOfWeek: "Thursday",
        startTime: new Date("2024-02-01T18:00:00"),
        endTime: "20:00",
        type: "one-time",
        name: "Cooking Class",
        description: "Learn how to cook Italian cuisine.",
        category: "Learning",
        hexGradientStart: "#FF6347", // tomato
        hexGradientEnd: "#FF4500", // orange red
      },
      {
        activityUid: "9",
        dayOfWeek: "Friday",
        startTime: new Date("2024-02-02T15:00:00"),
        endTime: "17:00",
        type: "one-time",
        name: "Nature Hike",
        description: "Go on a scenic hike through the mountains.",
        category: "Outdoor",
        hexGradientStart: "#32CD32", // lime green
        hexGradientEnd: "#228B22", // forest green
      },
      {
        activityUid: "10",
        dayOfWeek: "Monday",
        startTime: new Date("2024-02-05T08:00:00"),
        endTime: "09:00",
        type: "one-time",
        name: "Morning Meditation",
        description: "A peaceful meditation session to start the week.",
        category: "Health",
        hexGradientStart: "#87CEEB", // sky blue
        hexGradientEnd: "#4682B4", // steel blue
      },
    ];
    
  }
}
