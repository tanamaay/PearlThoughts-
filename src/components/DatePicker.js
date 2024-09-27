"use client"; // Ensures this is a client-side component

import React from 'react';
import { useDatePickerStore } from '../../store/useDatePickerStore';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// Component for selecting the recurrence type
const RecurrenceOptions = ({ recurrenceType, setRecurrenceType, recurrenceInterval, setRecurrenceInterval }) => (
  <div className="mb-5">
    <label className="block font-semibold text-gray-700 mb-3">Recurrence Type</label>
    <select
      value={recurrenceType}
      onChange={(e) => setRecurrenceType(e.target.value)}
      className="mb-5 p-3 border border-gray-300 rounded-lg w-full text-gray-800 focus:ring-2 focus:ring-blue-500"
    >
      <option value="daily">Daily</option>
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>

    {/* Recurrence Interval */}
    <label className="block font-semibold text-gray-700 mb-3">
      {recurrenceType === 'daily' && 'Repeat Every X Days'}
      {recurrenceType === 'weekly' && 'Repeat Every X Weeks'}
      {recurrenceType === 'monthly' && 'Repeat Every X Months'}
      {recurrenceType === 'yearly' && 'Repeat Every X Years'}
    </label>
    <input
      type="number"
      value={recurrenceInterval}
      onChange={(e) => setRecurrenceInterval(Number(e.target.value))}
      className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
      min="1"
    />
  </div>
);

// Component for selecting dates
const DateSelector = ({ label, selectedDate, onChange, isClearable = false }) => (
  <div className="mb-5">
    <label className="block font-semibold text-gray-700 mb-3">{label}</label>
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      isClearable={isClearable}
      className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

// Component for displaying the recurring dates preview
const RecurrencePreview = ({ startDate, generateRecurringDates }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-gray-700 mb-3">Recurring Dates Preview</h3>
    <Calendar
      tileClassName={({ date }) =>
        generateRecurringDates().some((d) => d.getTime() === date.getTime())
          ? 'bg-blue-500 text-white'
          : null
      }
      value={startDate}
      className="p-4 border border-gray-300 rounded-lg"
    />
  </div>
);

// Main Recurring Date Picker Component
const RecurringDatePicker = () => {
  const {
    startDate,
    endDate,
    recurrenceType,
    daysOfWeek,
    nthDayOfMonth,
    recurrenceInterval,
    setStartDate,
    setEndDate,
    setRecurrenceType,
    setRecurrenceInterval,
    toggleDayOfWeek,
    setNthDayOfMonth,
  } = useDatePickerStore();

  const handleSaveRecurrence = () => {
    const recurrenceData = {
      startDate,
      endDate,
      recurrenceType,
      recurrenceInterval,
      daysOfWeek,
      nthDayOfMonth,
    };

    console.log('Recurrence Data:', recurrenceData);
    // Add logic to handle the saved data (e.g., API call)
  };

  // Function to generate a preview of the recurring dates
  const generateRecurringDates = () => {
    let previewDates = [];
    const currentDate = new Date(startDate);
    const duration = 30; // Generate dates for the next 30 recurrences

    switch (recurrenceType) {
      case 'daily':
        for (let i = 0; i < duration; i++) {
          previewDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + recurrenceInterval);
        }
        break;
      case 'weekly':
        for (let i = 0; i < duration; i++) {
          if (daysOfWeek.includes(currentDate.getDay())) {
            previewDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        break;
      case 'monthly':
        for (let i = 0; i < duration; i++) {
          const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + recurrenceInterval, nthDayOfMonth || 1);
          previewDates.push(monthDate);
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        break;
      case 'yearly':
        for (let i = 0; i < duration; i++) {
          const yearDate = new Date(currentDate.getFullYear() + i * recurrenceInterval, 0, nthDayOfMonth || 1);
          previewDates.push(yearDate);
        }
        break;
      default:
        break;
    }

    return previewDates;
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recurring Date Picker</h2>

      {/* Recurrence Options */}
      <RecurrenceOptions
        recurrenceType={recurrenceType}
        setRecurrenceType={setRecurrenceType}
        recurrenceInterval={recurrenceInterval}
        setRecurrenceInterval={setRecurrenceInterval}
      />

      {/* Start Date */}
      <DateSelector label="Start Date" selectedDate={startDate} onChange={setStartDate} />

      {/* End Date */}
      <DateSelector label="End Date (optional)" selectedDate={endDate} onChange={setEndDate} isClearable />

      {/* Weekly Recurrence Options */}
      {recurrenceType === 'weekly' && (
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-3">Select Days of the Week</label>
          <div className="flex space-x-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <button
                key={index}
                className={`p-3 rounded-lg transition-all ${
                  daysOfWeek.includes(index)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                }`}
                onClick={() => toggleDayOfWeek(index)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Recurrence Options */}
      {recurrenceType === 'monthly' && (
        <div className="mb-6">
          <label className="block font-semibold text-gray-700 mb-3">Nth Day of the Month</label>
          <input
            type="number"
            value={nthDayOfMonth || ''}
            onChange={(e) => setNthDayOfMonth(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500"
            min="1"
            max="31"
          />
        </div>
      )}

      {/* Recurrence Dates Preview */}
      <RecurrencePreview startDate={startDate} generateRecurringDates={generateRecurringDates} />

      <button
        type="button"
        onClick={handleSaveRecurrence}
        className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition-all"
      >
        Save Recurrence
      </button>
    </div>
  );
};

export default RecurringDatePicker;
