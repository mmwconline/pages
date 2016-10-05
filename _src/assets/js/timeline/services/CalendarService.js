import $ from 'jQuery';

const key = 'AIzaSyCy-RXvh3d-1OvRfYy6_p8uyKxYeaF5w4A';

export default class CalendarService {
  static getEvents({calendarId, maxResults, dateLowerBound, query, showRegularEvents}) {
    let uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxAttendees=1&timeMin=${dateLowerBound.toISOString()}`;
    let deferredObject = $.Deferred();


  }
}