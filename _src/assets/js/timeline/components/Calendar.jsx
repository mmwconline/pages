import React from 'react';
import Event from './Event.jsx'
import EventModel from '../models/EventModel.js'

class Calendar extends React.Component {

  render() {
    return (
      <div className="timeline">
        <div className="timeline-hline"></div>
        {this.props.events.map(({style, key, data}) => {
          return (<Event key={key} style={style} {...data} />);})}
      </div>
    );
  }
}
Calendar.propTypes = {
  events: React.PropTypes.arrayOf(React.PropTypes.instanceOf(EventModel)).isRequired
};
export default Calendar;