// CreateActivityDialog.tsx
import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

interface CreateActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateActivity: (newActivity: Activity) => void;
}

interface Activity {
  activityUid: string;
  dayOfWeek: string;
  startTime: Date;
  endTime: string;
  type: string; // one-time, repeating n-times, indefinite;
  name: string;
  description: string;
  category: string; // the user will include it in a group (e.g., school, hobby)
  hexGradientStart: string;
  hexGradientEnd: string;
}

const CreateActivityDialog: React.FC<CreateActivityDialogProps> = ({
  isOpen,
  onClose,
  onCreateActivity,
}) => {
  const [activityForm, setActivityForm] = useState<Activity>({
    activityUid: "",
    dayOfWeek: "",
    startTime: new Date(),
    endTime: "00:00",
    type: "one-time",
    name: "",
    description: "",
    category: "",
    hexGradientStart: "#FFFFFF",
    hexGradientEnd: "#FFFFFF",
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActivityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleActivitySubmit = () => {
    const newActivity = {
      ...activityForm,
      activityUid: Math.random().toString(36).substr(2, 9), // Generate a random ID
      startTime: new Date(activityForm.startTime),
    };
    onCreateActivity(newActivity); // Call callback to create new activity
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-black opacity-60" />
      <DialogPanel className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New Activity</h2>

          {/* Form Fields */}
          <div>
            <label className="block text-gray-700">Activity Name</label>
            <input
              type="text"
              name="name"
              value={activityForm.name}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
              placeholder="Enter activity name"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={activityForm.description}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label className="block text-gray-700">Start Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={activityForm.startTime.toISOString().substring(0, 16)}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={activityForm.endTime}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700">Category</label>
            <input
              type="text"
              name="category"
              value={activityForm.category}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
              placeholder="Enter category"
            />
          </div>

          <div>
            <label className="block text-gray-700">Color (Start Gradient)</label>
            <input
              type="color"
              name="hexGradientStart"
              value={activityForm.hexGradientStart}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-700">Color (End Gradient)</label>
            <input
              type="color"
              name="hexGradientEnd"
              value={activityForm.hexGradientEnd}
              onChange={handleInputChange}
              className="mt-2 p-3 border rounded-lg w-full text-gray-700"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handleActivitySubmit}
              className="flex-1 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all active:scale-95 focus:outline-none"
            >
              Create Activity
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-all active:scale-95 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  );
};

export default CreateActivityDialog;
