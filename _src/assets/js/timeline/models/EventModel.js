//given https://www.youtube.com/watch?v=oyEuk8j8imI, it'll return oyEuk8j8imI
export function getYTubeID(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length == 11) {
    return match[2];
  } else {
    return false;
  }
}

export default class Event {

  constructor(calendarApiEvent) {
    if (calendarApiEvent == null)
      throw 'item cannot be null';
    if (calendarApiEvent.status == 'cancelled') {
      throw "cancelled events are not currently supported";
    }

    this.id = calendarApiEvent.id;
    this.startTime = new Date(calendarApiEvent.start.dateTime || calendarApiEvent.start.date);
    this.endTime = new Date(calendarApiEvent.end.dateTime || calendarApiEvent.end.date);
    this.isAllDayEvent = calendarApiEvent.start.dateTime == null;

    this.title = calendarApiEvent.summary;
    this.location = calendarApiEvent.location;
    // this.eventLink = calendarApiEvent.htmlLink;

    this.imgUrl = null;
    this.ytId = null;
    this.description = null;

    if (calendarApiEvent.attachments != null && calendarApiEvent.attachments.length > 0) {
      this.imgUrl = 'https://drive.google.com/uc?export=view&id=' + calendarApiEvent.attachments[0].fileId;
    }

    if (calendarApiEvent.description != null) {
      this.description = calendarApiEvent.description.split('\n');
      if (this.description.length > 0) {
        this.ytId = getYTubeID(this.description[0]) || null;
        if (this.ytId != null)
          this.description.shift();
        this.description = this.description.join('\n')
      }
      else
        this.description = calendarApiEvent.description;
    }
  }
}