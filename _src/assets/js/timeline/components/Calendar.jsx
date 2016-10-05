import React from 'react';
import Event from './Event.jsx'
import EventModel from '../models/EventModel.js'

const Calendar = (props) => {
  return (
    <div className="timeline">
      <div className="timeline-hline"></div>
      { props.events.map(e => {
        let { id, ...others } = new EventModel(e);
        return <Event key={id} {...others} />
      })}
    </div>
  );
};

function eventsPropValidation(props, propName) {
  try {
    props[propName].map(e => {
      return new EventModel(e);
    });
    return null;
  } catch(err) {
    new Error(err);
  }
}

Calendar.propTypes = {
  events: eventsPropValidation
};
export default Calendar;