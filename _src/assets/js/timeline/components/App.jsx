import React from 'react';
import Filters from './Filters.jsx'
import Calendar from './Calendar.jsx'
import LoadMoreButton from './LoadMoreButton.jsx'
import CalendarService from '../services/CalendarService.js'
import {TransitionMotion, spring, presets} from 'react-motion';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.service = new CalendarService(props.calendarId, props.maxResults);
    this.calendarId = props.calendarId;
    this.maxResults = props.maxResults;

    this.state = {
      events: [],
      startTime: new Date(),
      showRegularEvents: props.initShowRegularEvents,
      query: null,
      hasMore: false,
      showMedia: props.initShowMedia
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

  onShowRegularEventsToggle(val) {
    this.setState({
      showRegularEvents: val
    }, this.getEvents);
  }

  onShowMediaToggle(val) {
    this.setState({
      showMedia: val
    });
  }

  onSearch(query) {
    this.setState({
      query: query
    }, this.getEvents);
  }

  onStartDateChange({date}) {
    this.setState({
      startTime: date
    }, this.getEvents);
  }

  componentDidMount() {
    this.getEvents();
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-9 col-sm-9">
            <TransitionMotion defaultStyles={this.getDefaultStyles()} styles={this.getStyles()}
                              willLeave={this.willLeave} willEnter={this.willEnter}>
              {styledEvents => <Calendar events={ styledEvents } showMedia={this.state.showMedia}/>}
            </TransitionMotion>
            <LoadMoreButton hide={!this.state.hasMore} onLoadMore={() => this.getEvents()}/>
          </div>
          <div className="col-md-3 col-sm-3">
            <Filters onRegularEventsToggle={this.onShowRegularEventsToggle.bind(this)}
                     initShowRegularEvents={this.state.showRegularEvents}
                     onSearch={this.onSearch.bind(this)} 
                     onStartDateChange={this.onStartDateChange.bind(this)}
                     onMediaToggle={this.onShowMediaToggle.bind(this)}
                     initShowMedia={this.state.showMedia}/>
          </div>
        </div>
      </div>
    );
  }
  getDefaultStyles() {
    return this.state.events.map(e => {
      let { id, ...others } = e;
      return {
        key: id,
        style: {
          maxHeight: 0,
          opacity: 1
        },
        data: {
          ...others
        }
      };
    });
  }

  getStyles() {
    return this.state.events.map(e => {
      let { id, ...others } = e;
      console.log(e);
      return {
        key: id,
        style: {
          maxHeight: spring(2000, presets.gentle),
          opacity: spring(1, presets.gentle)
        },
        data: {
          ...others
        }
      };
    });
  }

  willEnter() {
    return {
      maxHeight: 0,
      opacity: 1,
    };
  }

  willLeave() {
    return {
      maxHeight: spring(0),
      opacity: spring(0),
    };
  }
}

App.propTypes = {
  calendarId: React.PropTypes.string.isRequired,
  maxResults: React.PropTypes.number.isRequired,
  initShowRegularEvents: React.PropTypes.bool,
  initShowMedia: React.PropTypes.bool
};
App.defaultProps = {
  initShowRegularEvents: true,
  initShowMedia: true
};
export default App;