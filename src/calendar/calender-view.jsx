import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import EventModal from './event-model';



const events = [
  {
    title: 'Event 1',
    start: new Date(2024, 6, 19, 10, 0),
    end: new Date(2024, 6, 19, 12, 0),
    className: 'event',
  },
  {
    title: 'Event 1',
    start: new Date(2024, 6, 19, 10, 0),
    end: new Date(2024, 6, 19, 12, 0),
    className: 'event',
  },
  {
    title: 'Dummy',
    start: new Date(2024, 6, 20, 11, 0),
    end: new Date(2024, 6, 20, 14, 0),
    className: 'event',
  },
  {
    title: 'Holiday',
    start: new Date(2024, 6, 19),
    end: new Date(2024, 6, 20),
    className: 'holiday', // Custom class for holiday
  },
  {
    title: 'Holiday',
    start: new Date(2024, 6, 19),
    end: new Date(2024, 6, 20),
    className: 'holiday', // Custom class for holiday
  },
  {
    title: 'Regular Event',
    start: new Date(2024, 6, 15),
    end: new Date(2024, 6, 16),
    className: 'event',
  },
  {
    title: 'Holiday',
    start: new Date(2024, 6, 1),
    end: new Date(2024, 6, 2),
    className: 'holiday', // Custom class for holiday
  },

];

const MyCalendar = () => {

  // Initialize the localizer
  const localizer = momentLocalizer(moment);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadPage] = useState(true);

  const handleEventAdd = ({ title, start, end }) => {
    const newEvent = {
      title,
      start,
      end,
      className: 'event',
    };
    setCalendarEvents([...calendarEvents, newEvent]);

  };

  const isWeekend = date => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const eventStyleGetter = (event, start, end, isSelected) => {

    const style = {
      backgroundColor: '#3174ad',
      color: 'white',
    };

    // Add custom class for weekends
    if (isWeekend(start)) {
      style.className = 'weekend';
    }

    // Add custom class for holidays
    if (event.className === 'holiday') {
      // style.className = 'holiday';
      style.backgroundColor = 'red';
    }
    if (event.className === 'event') {
      style.backgroundColor = "lightgreen"
    }


    return { style };
  };



  const closeModal = () => setIsModalOpen(false);
  const openModal = () => { setIsModalOpen(true); };


  return (
    loadPage ? <div
      style={{
        width: '100%',
        // height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>
      <img alt="icon" src="/assets/loadpage/bubble-gum-error-404.gif" style={{width: '300px', height: '300px'}}/>
      <h1 style={{textAlign: 'center', color:'#637381'}}>Oops..! 🤭 <br/>Page under progress <br/>Please contact the Dev... team</h1>
    </div>
      :
      <div style={{ height: 500 }}>
        <Calendar
          localizer={localizer}
          events={events}
          eventPropGetter={eventStyleGetter}
          startAccessor="start"
          selectable
          // components={iconComponent}
          onSelectSlot={openModal}
          popup
          onShowMore={(event) => {
            event.preventDefault();
          }}
        />
        <EventModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleEventAdd}
        />
      </div>
      )
};

export default MyCalendar;
