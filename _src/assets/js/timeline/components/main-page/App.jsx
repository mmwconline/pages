import React from 'react';
import CalendarService from '../../services/CalendarService.js'
import Event from './Event.jsx'
import ErrorMessage from '../ErrorMessage.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);

    this.service = new CalendarService(props.calendarId, props.maxResults);
    this.calendarId = props.calendarId;
    this.maxResults = props.maxResults;
    this.showRegularEvents = props.initShowRegularEvents;

    this.state = {
      events: [],
      hasError: false
    };
  }

  getEvents() {
    this.service.getEvents({
      startTime: new Date(),
      query: null,
      showRegularEvents: this.showRegularEvents
    })
      .done((events) =>
        this.setState({
          events: events,
          hasError: false
        }))
      .fail(() =>
        this.setState({
          hasError: true
        }));
  }

  componentDidMount() {
    this.getEvents();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <h2>Upcoming Events <span className="size-18">/ see you there!</span></h2>
          <ErrorMessage noEvents={this.state.events.length === 0} error={this.state.hasError}/>
          {this.state.events.map((e) => {
            let {id, ...others} = e;
            return <Event key={id} {...others} getPrintFields={e.getPrintFields}
                          getRawDescriptionMarkup={e.getRawDescriptionMarkup} />
          })}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  calendarId: React.PropTypes.string.isRequired,
  maxResults: React.PropTypes.number.isRequired,
  initShowRegularEvents: React.PropTypes.bool
};
App.defaultProps = {
  initShowRegularEvents: true
};

export default App;
