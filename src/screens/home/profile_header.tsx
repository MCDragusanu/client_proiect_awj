import React from 'react';
import { FaReact, FaUserCircle } from 'react-icons/fa'; // Importing from react-icons

interface ProfileInfoProps {
  profile: any;
  onRefresh: () => void;
  onGoToAccountPage: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile, onRefresh, onGoToAccountPage }) => {
  return (
    <div className="flex justify-between items-start min-w-full p-4 bg-gray-900 rounded-lg max-w-screen-xl">
      {/* Left side: Profile Info */}
      <div className="w-full flex flex-col items-start">
        <h3 className="text-2xl font-bold text-gray-300 mb-4">Welcome Back</h3>
        <h1 className="text-4xl font-bold text-white mb-4">
          {profile.firstName} {profile.lastName} 👋
        </h1>
       
        <p className="text-lg text-gray-300">Study Level: {profile.studyLevel}</p>
      </div>

      {/* Right side: Buttons */}
      <div className="flex flex-col justify-between space-y-4">
        {/* Button to refresh the page */}
        <div className="relative group">
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            <FaReact className="h-6 w-6" />
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs rounded py-1 px-2">
            Refresh
          </div>
        </div>

        {/* Button to go to account page */}
        <div className="relative group">
          <button
            onClick={onGoToAccountPage}
            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            <FaUserCircle className="h-6 w-6" />
          </button>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black text-white text-xs rounded py-1 px-2">
            Go to Account Page
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileInfo };
