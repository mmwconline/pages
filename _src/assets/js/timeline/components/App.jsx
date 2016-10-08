import React from 'react';
import Filters from './Filters.jsx'
import Calendar from './Calendar.jsx'
import LoadMoreButton from './LoadMoreButton.jsx'
import CalendarService from '../services/CalendarService.js'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.service = new CalendarService(props.calendarId, props.maxResults);
    this.state = {
      calendarId: props.calendarId,
      events: [],
      maxResults: props.maxResults,
      startTime: new Date(),
      showRegularEvents: props.initShowRegularEvents,
      query: null,
      hasMore: false
    };
  }

  getEvents() {
    this.service.getEvents({
      startTime: this.state.startTime,
      query: this.state.query,
      showRegularEvents: this.state.showRegularEvents,
    })
      .done((events, hasMore) => {
        this.setState({
          events: events,
          hasMore: hasMore
        });
      })
      .fail(e => console.log(e));
  }

  componentDidMount() {
    this.getEvents();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9 col-sm-9">
            <Calendar events={ this.state.events }/>
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