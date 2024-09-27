import{ create} from 'zustand';

export const useDatePickerStore = create((set) => ({
  recurrenceType: 'daily',
  startDate: new Date(),
  endDate: null,
  daysOfWeek: [], // For weekly recurrence
  nthDayOfMonth: null, // For monthly recurrence
  recurrenceInterval: 1, // Default interval (e.g., every 1 day/week/month/year)

  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setRecurrenceType: (type) => set({ recurrenceType: type }),
  setRecurrenceInterval: (interval) => set({ recurrenceInterval: interval }),

  // Weekly recurrence: toggle days of the week
  toggleDayOfWeek: (dayIndex) => set((state) => {
    const newDaysOfWeek = state.daysOfWeek.includes(dayIndex)
      ? state.daysOfWeek.filter((day) => day !== dayIndex)
      : [...state.daysOfWeek, dayIndex];
    return { daysOfWeek: newDaysOfWeek };
  }),

  // Monthly recurrence: set the nth day of the month
  setNthDayOfMonth: (day) => set({ nthDayOfMonth: day }),
}));
