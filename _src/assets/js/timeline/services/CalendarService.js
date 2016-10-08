import $ from 'jQuery';
import EventModel from '../models/EventModel';

const key = 'AIzaSyCy-RXvh3d-1OvRfYy6_p8uyKxYeaF5w4A';

export default class CalendarService {

  constructor(calendarId, maxResults) {
    if (CalendarService.isNullOrWhitespaces(calendarId)) throw `calendarId is null`;
    if (maxResults == null || maxResults <= 0) throw `maxResults = ${maxResults}`;

    this.calendarId = calendarId;
    this.maxResults = maxResults;
    this.init(new Date(), null, null);
  }

  init(startTime, query, showRegularEvents) {
    this.lastQuery = query;
    this.lastShowRegularEvents = showRegularEvents;
    this.lastStartTime = startTime;

    this.pageToken = null;
    this.eventsNotReturned = [];
    this.eventsReturned = [];
  }

  getEvents({startTime, query, showRegularEvents}) {
    let deferredObject = $.Deferred();

    if (this.hasQueryChanged(startTime, query, showRegularEvents))
      this.init(startTime, query, showRegularEvents);

    let eventsNotReturnedSize = this.eventsNotReturned.length;
    if ((this.pageToken == null && eventsNotReturnedSize > 0) || eventsNotReturnedSize >= this.maxResults) {

      this.eventsReturned.push(...this.eventsNotReturned.splice(0, this.maxResults));
      deferredObject.resolve(this.eventsReturned, this.pageToken != null);
      return deferredObject.promise();
    }
    this.loadMoreEvents(startTime, query, showRegularEvents)
      .then((nextPageToken, events) => {

        this.pageToken = nextPageToken;
        this.eventsNotReturned.push(...events);
        this.eventsReturned.push(...this.eventsNotReturned.splice(0, this.maxResults));
        deferredObject.resolve(this.eventsReturned, this.pageToken != null);
      });

    return deferredObject;
  }

  loadMoreEvents(dateLowerBound, query, showRegularEvents) {
    let deferredObject = $.Deferred();
    let uri = `https://www.googleapis.com/calendar/v3/calendars/${this.calendarId}/events?maxAttendees=1` +
      `&timeMin=${dateLowerBound.toISOString()}&key=${key}&maxResults=${this.maxResults * 3}`;

    if (showRegularEvents == true)
      uri += '&orderBy=startTime&singleEvents=true';
    if (this.pageToken != null)
      uri += '&pageToken=' + this.pageToken;
    if (query != null)
      uri += '&q=' + query;

    $.ajax({
      type: 'GET',
      url: encodeURI(uri),
      dataType: 'json',
      success: (response) => {
        let models = response.items
          .filter(i => i.status !== 'cancelled')
          .map(e => new EventModel(e));

        // if they want to see one-off events only, orderBy=startTime cannot be passed in the api call; have to sort it
        // yourself. You may also see recurring events that start before dateLowerBound. Therefore, filter them out.
        if (!showRegularEvents)
          models = models
            .filter(e => e.endTime.getTime() >= dateLowerBound.getTime())
            .sort((a,b) => a.startTime.getTime() - b.startTime.getTime());

        deferredObject.resolve(response.nextPageToken, models);
      },
      error: (error) => {
        deferredObject.reject(error);
      }
    });

    return deferredObject.promise();
  }

  hasQueryChanged(startTime, query, showRegularEvents) {
    return !(startTime.getTime() === this.lastStartTime.getTime()
      && showRegularEvents === this.lastShowRegularEvents
      && (CalendarService.isNullOrWhitespaces(query) && CalendarService.isNullOrWhitespaces(this.lastQuery) || query === this.lastQuery));
  }

  static isNullOrWhitespaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
}