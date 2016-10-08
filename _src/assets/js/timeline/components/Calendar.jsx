import React from 'react';
import Event from './Event.jsx'
import EventModel from '../models/EventModel.js'

const Calendar = (props) => {
  return (
    <div className="timeline">
      <div className="timeline-hline"></div>
      { props.events.map(e => {
        let { id, ...others } = e;
        return <Event key={id} {...others} />
      })}
    </div>
  );
};

Calendar.propTypes = {
  events: React.PropTypes.arrayOf(React.PropTypes.instanceOf(EventModel)).isRequired
};
export default Calendar;