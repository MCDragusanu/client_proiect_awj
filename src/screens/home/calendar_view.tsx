import React, { useState, useEffect, useCallback } from "react";
import { format, startOfMonth, endOfMonth, addMonths, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"; // Modal Dialog component

interface CalendarProps {
  activities: Activity[]; // Accept activities as a prop
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

const Calendar: React.FC<CalendarProps> = ({ activities }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]); // To hold the days of the current month
  const [loading, setLoading] = useState<boolean>(false); // For loading more months
  const [openModal, setOpenModal] = useState<boolean>(false); // To control the modal visibility
  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); // Store the selected date for jump-to-date
  const [jumpDate, setJumpDate] = useState<string>(""); // Store the date input for jump date

  // Fetch the days of the current month
  const generateDays = useCallback((month: Date) => {
    const startOfTheMonth = startOfMonth(month);
    const endOfTheMonth = endOfMonth(month);
    const startOfTheWeek = startOfWeek(startOfTheMonth);
    const endOfTheWeek = endOfWeek(endOfTheMonth);

    const daysInRange = eachDayOfInterval({ start: startOfTheWeek, end: endOfTheWeek });
    setDays(daysInRange);
  }, []);

  // Load more content when user reaches the end of the current month
  const loadMore = () => {
    setLoading(true);
    setTimeout(() => {
      // Move to the next month
      setCurrentMonth((prev) => addMonths(prev, 1));
      setLoading(false);
    }, 1000);
  };

  // Initialize days for the current month
  useEffect(() => {
    generateDays(currentMonth);
  }, [currentMonth, generateDays]);

  // Format date to YYYY-MM-DD for event lookup
  const getDateString = (date: Date) => format(date, "yyyy-MM-dd");

  // Filter activities by the day (date string)
  const getActivitiesForDay = (day: Date) => {
    const dateString = getDateString(day);
    return activities.filter((activity) => getDateString(activity.startTime) === dateString);
  };

  return (
    <div className="w-full">
      {/* Navigation Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="bg-transparent text-white p-3 rounded-full hover:bg-blue-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {"<"} {/* Left Arrow */}
        </button>
        <button onClick={() => setOpenModal(true)} className="text-2xl font-bold text-gray-300">
          {format(currentMonth, "MMMM yyyy")}
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="bg-transparent text-white p-3 rounded-full hover:bg-blue-600 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          {">"} {/* Right Arrow */}
        </button>
      </div>

      {/* Calendar Days Grid */}
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => {
          const activitiesForDay = getActivitiesForDay(day);
          return (
            <div
              key={getDateString(day)}
              className="p-4 rounded-sm cursor-pointer relative"
              style={{
                background: activitiesForDay.length > 0
                  ? `linear-gradient(to bottom, ${activitiesForDay[0].hexGradientStart}, ${activitiesForDay[0].hexGradientEnd})`
                  : '#102230' // Custom fallback color (Replace with your desired color)
              }}
            >
              <div className="font-semibold text-white">{format(day, "d")}</div>
              {/* Activities for the day */}
              <div className="mt-2 text-sm text-white">
                {activitiesForDay.map((activity) => (
                  <div key={activity.activityUid} className="my-1">
                    <div className="font-semibold">{activity.name}</div>
                    <div className="text-xs">{activity.description}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for jumping to a specific date */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogBackdrop className="fixed inset-0 bg-black opacity-60" />
        <DialogPanel className="fixed inset-0 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Jump to a Specific Date</h2>
            <p className="text-gray-600">
              Select a date to quickly jump to it in the calendar. Once you've picked your desired date, the calendar will show that date's events.
            </p>
            <div className="mt-4">
              <label htmlFor="date" className="block text-gray-700">Pick a Date:</label>
              <input
                id="date"
                type="date"
                value={jumpDate}
                onChange={(e) => setJumpDate(e.target.value)}
                className="mt-2 p-3 border rounded-lg w-full text-gray-700"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={() => {
                  setCurrentMonth(new Date(jumpDate));
                  setOpenModal(false);
                }}
                className="flex-1 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                Jump to Date
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="flex-1 bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </div>
  );
};

export default Calendar;
