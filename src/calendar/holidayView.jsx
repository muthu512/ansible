
import React, { useState } from 'react';
import HolidayCalendar from "./holiday-calendar";
import HolidayTable from "./holidayTable";

export default function HolidayView(){
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };
  return(
    <div className="view">
    <HolidayCalendar selectedDate={selectedDate}/>
    <HolidayTable onDateClick={handleDateClick}/>
    </div>
  );
}