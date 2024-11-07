// src/Calendar.js
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  format,
  startOfMonth,
  endOfMonth,
  addMonths,
  subMonths,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';
import './holidayTable-style.css'; 
import { Button } from '@mui/material';
import Iconify from 'src/components/iconify';

// Sample holiday data
const holidays = {
  '2024-01-01': '1',
  '2024-08-15': '15',
  '2024-12-25': '25',
  // Add more holidays here
};

const HolidayCalendar = ({selectedDate}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (selectedDate) {
      const selectedMonth = new Date(selectedDate);
      setCurrentDate(selectedMonth);
    }
  }, [selectedDate]);

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);

  // Determine the start and end of the calendar grid
  const startOfCalendar = startOfWeek(start, { weekStartsOn: 0 }); 
  const endOfCalendar = endOfWeek(end, { weekStartsOn: 0 });

  // Get all days to display in the calendar grid
  const calendarDays = eachDayOfInterval({ start: startOfCalendar, end: endOfCalendar });

  const formattedMonth = format(currentDate, 'MMMM yyyy');

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));



  return (
    <div className="calendar">
      <header className="calendar-header">
        <Button onClick={goToPreviousMonth}>
          <Iconify icon="teenyicons:left-solid" width="1.2rem" height="1.2rem" />
        </Button>
        <h1>{formattedMonth}</h1>
        <Button onClick={goToNextMonth}>
          <Iconify icon="teenyicons:right-solid" width="1.2rem" height="1.2rem" />
        </Button>
      </header>
      <div className='column-days'>
      <div className='calendar-grid weekdays'>
            <span>S</span>
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
      </div>
      <div className="calendar-grid">
        {/* Calendar days */}
        {calendarDays.map((day) => {
          const dateString = format(day, 'yyyy-MM-dd');
          const holiday = holidays[dateString];
          const isHighlighted = selectedDate && dateString === selectedDate;

          return (
            <div key={dateString} className={`calendar-day ${isToday(day) ? 'today' : ''} ${isHighlighted ? 'highlighted' : ''}`}>
              {format(day, 'd')}
              {holiday && <div className="holiday-label">{holiday}</div>}
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
};

HolidayCalendar.propTypes = {
  selectedDate: PropTypes.string 
};

export default HolidayCalendar;
