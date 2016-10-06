import $ from 'jQuery';
import moment from 'moment';
import EventModel from '../models/EventModel';

const key = 'AIzaSyCy-RXvh3d-1OvRfYy6_p8uyKxYeaF5w4A';

export default class CalendarService {

  static getEvents({calendarId, maxResults, dateLowerBound, query, showRegularEvents, pageToken}) {
    let deferredObject = $.Deferred();

    let uri = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxAttendees=1` +
      `&timeMin=${dateLowerBound.toISOString()}&key=${key}`;

    if (showRegularEvents == true)
      uri += '&orderBy=startTime&singleEvents=true';
    if (pageToken != null)
      uri += '&pageToken=' + pageToken;
    if (query != null)
      uri += '&q=' + query;

    // in other words, if they want to see recurring events just ONCE (showRegularEvents = false), and they're looking
    // in the future, don't put a cap, because it's likely they won't have many one-off events in the future
    if (maxResults != null && (showRegularEvents || dateLowerBound == null || moment(dateLowerBound).isBefore(moment())))
      uri += '&maxResults=' + maxResults * 3; // always get extra, for when the user filters and still wants to see maxResults

    $.ajax({
      type: 'GET',
      url: encodeURI(uri),
      dataType: 'json',
      success: (response) => {
        let models = response.items.map(e => new EventModel(e));

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
  }

  /**
   *
   * @param itemsArray        An array of array of items, where each array of items corresponds to a calendar's events.
   * @returns {Array}         An array that contains all the items in one flat array, sorted out
   */
  static aggregateAndSort(itemsArray) {
    var items = [],
      itemsArrayWithIndex = [],
      bestCurrItem;
    if (itemsArray == null || itemsArray.length === 0)
      return items;
    for (var i = 0; i < itemsArray.length; i++)
      itemsArrayWithIndex.push({items: itemsArray[i], index: 0});

    var findNextDate = function() {
      var currTime = new Date(8640000000000000), //max possible date
        tempTime = null,
        currIndex = -1,
        currItem = null;
      for (var i = 0; i < itemsArrayWithIndex.length; i++) {
        if (itemsArrayWithIndex[i].index < itemsArrayWithIndex[i].items.length) {
          tempTime = itemsArrayWithIndex[i].items[itemsArrayWithIndex[i].index].startTime;
          if (tempTime < currTime) {
            currTime = tempTime;
            currIndex = i;
          }
        }
      }
      if (currIndex !== -1) {
        currItem = itemsArrayWithIndex[currIndex].items[itemsArrayWithIndex[currIndex].index];
        itemsArrayWithIndex[currIndex].index = 1 + itemsArrayWithIndex[currIndex].index;
      }
      return currItem;
    };

    while ((bestCurrItem = findNextDate()) != null)
      items.push(bestCurrItem);
    return items;
  }
}