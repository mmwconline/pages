import React from 'react';
import Filters from './Filters.jsx'
import Calendar from './Calendar.jsx'
import LoadMoreButton from './LoadMoreButton.jsx'

import data from '../gcal_example.json'

const calendarId = 'mmwconline.org_5klbp23b863vugjopsb617d6d0@group.calendar.google.com';
const initShowRegularEvents = true;
const initMaxResults = 10;

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      events: [],
      pageToken: null,
      maxResults: initMaxResults,
      startTime: new Date(),
      showRegularEvents: initShowRegularEvents
    };
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