import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // To extract parameters from the route
import { HomeController } from "./home_page_controller.ts"; // HomeController for fetching profile
import { ProfileInfo } from "./profile_header.tsx"; // Import the ProfileInfo component
import Calendar from "./calendar_view.tsx";
import CreateActivityDialog from "./create_activity_dialog.tsx"; // Import the CreateActivityDialog

interface HomeScreenProps {
  onGoToAccountPage: Function;
}


const HomeScreen: React.FC<HomeScreenProps> = ({ onGoToAccountPage }) => {
  const [profile, setProfile] = useState<any>(null); // Store the profile data
  const [error, setError] = useState<string | null>(null); // Store any errors
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false); // State to control dialog visibility
  const { userUid } = useParams<{ userUid: string }>(); // Extract the userUid from the route

  const controller = HomeController.getInstance(); // Get the controller instance

  // Fetch the user profile
  const fetchProfile = async () => {
    try {
      if (userUid === undefined) {
        console.log("UserUid is undefined");
        return;
      }
      const profileData = await controller.getProfile(userUid); // Fetch the profile using the controller
      if (profileData) {
        setProfile(profileData); // Set the profile data if the fetch was successful
      } else {
        setError("Failed to load profile.");
      }
    } catch (err) {
      setError("An error occurred while fetching the profile.");
    }
  };

  // Fetch the user profile when the component mounts
  useEffect(() => {
    if (userUid) {
      fetchProfile(); // Fetch profile when userUid is available
    }
  }, [userUid, controller]); // Dependency array: rerun when userUid or controller changes

  // Handle creating a new activity
  const handleCreateActivity = (newActivity: any) => {
    console.log("New Activity Created: ", newActivity);
    // Here you can handle the activity creation logic, like adding it to a list
  };

  // Function to trigger a page refresh
  const handleRefresh = () => {
    setProfile(null); // Reset the profile state to trigger a reload
    setError(null); // Reset error state
    if (userUid) {
      fetchProfile(); // Fetch the profile again after reset
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="flex flex-col items-start justify-start bg-gray-900 text-white p-4 space-y-36 min-h-screen">
        {/* Error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Profile information display */}
        {profile ? (
          <ProfileInfo
            profile={profile}
            onRefresh={handleRefresh}
            onGoToAccountPage={() => onGoToAccountPage()}
          />
        ) : (
          <p>Loading profile...</p>
        )}

        {/* Calendar View */}
        <div className="w-full flex-grow overflow-y-auto">
          <Calendar activities={controller.getMockData()} />
        </div>

        {/* Floating Action Button (FAB) */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setIsDialogOpen(true)} // Open the dialog when FAB is clicked
            className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition-all"
          >
            <span className="text-2xl">+</span>
          </button>
        </div>
      </div>

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)} // Close the dialog when 'Cancel' or outside click
        onCreateActivity={handleCreateActivity}
      />

      {/* Footer */}
      <footer className="flex-shrink-0 w-full bg-slate-950 text-center text-sm text-gray-400 p-4 mt-6">
        <p>&copy; 2025 My Application. All rights reserved.</p>
      </footer>
    </div>
  );
};

export { HomeScreen };
