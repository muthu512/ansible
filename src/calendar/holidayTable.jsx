import React from 'react';
import PropTypes from 'prop-types';
import './holidayTable-style.css';
import { Button } from '@mui/material';

// Sample holiday data
const holidays = [
  { date: '2024-01-01', name: 'New Year\'s Day' },
  { date: '2024-08-15', name: 'Independence Day' },
  { date: '2024-12-25', name: 'Christmas Day' },
  // Add more holidays here
];

function HolidayTable({onDateClick}) {
  return (
    <div className="holiday-table">
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Date</th>
            <th>Day</th>
            <th>Holiday</th>
          </tr>
        </thead>
        <tbody>
          {holidays.map((holiday) => (
            <tr key={holiday.date}>
              <td>Jan</td>
              <td>
                <Button sx={{color: '#5b5e61'}} type="button" onClick={() => onDateClick(holiday.date)}>
                  {holiday.date}
                </Button>
              </td>
              <td>thusday</td>
              <td>{holiday.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

HolidayTable.propTypes = {
  onDateClick: PropTypes.func.isRequired // Expect onDateClick to be a function
};

export default HolidayTable;
