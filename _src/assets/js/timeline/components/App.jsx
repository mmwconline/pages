import React from 'react';
import Filters from './Filters.jsx'
import Calendar from './Calendar.jsx'
import LoadMoreButton from './LoadMoreButton.jsx'
import CalendarService from '../services/CalendarService.js'

import data from '../gcal_example.json'



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarId: props.calendarId,
      eventsRendered: [],
      eventsNotRenderedYet: [],
      pageToken: null,
      maxResults: props.maxResults,
      startTime: new Date(),
      showRegularEvents: props.initShowRegularEvents,
      query: null
    };
  }

  getEvents() {
    CalendarService.getEvents({
      calendarId: this.state.calendarId,
      maxResults: this.state.maxResults,
      dateLowerBound: this.state.startTime,
      query: this.state.query,
      showRegularEvents: this.state.showRegularEvents,
      pageToken: this.state.pageToken
    })
      .done((nextPageToken, events) => {

        this.setState({
          pageToken: nextPageToken,
          events:
        });
      })
      .fail();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9 col-sm-9">
            <Calendar events={ data.items }/>
            <LoadMoreButton onLoadMore={() => alert('blah')}/>
          </div>
          <div className="col-md-3 col-sm-3">
            <Filters/>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  calendarId: React.PropTypes.string.isRequired,
  maxResults: React.PropTypes.number.isRequired,
  initShowRegularEvents: React.PropTypes.bool.isRequired
};

export default App;