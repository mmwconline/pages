import React from 'react';
import moment from 'moment';
import Remarkable from 'remarkable';
import classnames from 'classnames';

let md = new Remarkable();

function getMedia(imgUrl, ytId, showMedia) {
  let classes = classnames('margin-bottom-20', {hide: !showMedia});
  //can either have an image or a video; not both. Image takes precedence
  if (imgUrl)
    return (
      <figure className={classes}>
        <img className="img-responsive" src={imgUrl} alt=""/>
      </figure>
    );
  else if (ytId)
    return (
      <div className={classes}>
        <div className="embed-responsive embed-responsive-16by9">
          <iframe className="embed-responsive-item" src={`https://www.youtube.com/embed/${ytId}?wmode=transparent`} width="800" height="450"></iframe>
        </div>
      </div>
    );
  return null;
}

function getLocation(locationStr) {
  if (locationStr)
    return (
      <li>
        <a href="#">
          <i className="fa fa-map-marker"/>
          <span className="font-lato">{ locationStr }</span>
        </a>
      </li>
    );
}

function getRawMarkup(markup) {
  var rawMarkup = md.render(markup);
  return { __html: rawMarkup };
}

const Event = (props) => {

  let startTime       = moment(props.startTime),
      endTime         = moment(props.endTime);

  // when it's an all day event, the date is given in UTC midnight, so we have to use formatting in utc.
  // thus, we just turn a flag on that says to do that
  if (props.isAllDayEvent) {
    startTime.utc();
    endTime.utc();
  }
  let startDateStr    = startTime.format('ddd, MMM D, YYYY'),     // Tue, Jun 29, 2014
      startMonthStr   = startTime.format('MMM'),                  // Jun
      startDayOfMonth = startTime.date(),
      startTimeStr    = startTime.format('h:mma'),                // 8:00pm
      endDateStr      = endTime.format('ddd, MMM D, YYYY'),
      endTimeStr      = endTime.format('h:mma'),
      interval;

  // we have two fields: 1) tells user the date the event is at. 2) a) either what time to what time if same day and not
  // all day, or b) "ALL DAY" if the event is all day, or c) the end date if it's across multiple days

  if (props.isAllDayEvent) {
    if (endTime.diff(startTime, 'days') === 1) // if the difference is only one day apart, say ALL DAY
      interval = "ALL DAY";
    else
      interval = endDateStr; // if multiple days apart, just say the end date
  }
  else {
    if (startTime.isSame(endTime, 'day')) // if year, month and day are equal
      interval = startTimeStr + " to " + endTimeStr; // 4:00pm to 8:00pm
    else { // i.e., they have time but span over multiple days, so just reformat and include the time
      startDateStr = startTime.format('ddd, MMM D, YYYY h:mma');
      interval = endTime.format('ddd, MMM D, YYYY h:mma')
    }
  }

  return (
    <div style={props.style} className="blog-post-item">

      <div className="timeline-entry">
        { startDayOfMonth }<span>{ startMonthStr} </span>
        <div className="timeline-vline"></div>
      </div>

      { getMedia(props.imgUrl, props.ytId, props.showMedia) }

      <h2>{ props.title } </h2>

      <ul className="blog-post-info list-inline">
        <li>
          <a href="#">
            <i className="fa fa-calendar"/>
            <span className="font-lato">{ startDateStr }</span>
          </a>
        </li>
        <li>
          <a href="#">
            <i className="fa fa-hourglass-start"/>
            <span className="font-lato">{ interval }</span>
          </a>
        </li>

        { getLocation(props.location) }

      </ul>

      <div dangerouslySetInnerHTML={getRawMarkup(props.description)}></div>
    </div>
  )
};

Event.propTypes = {
  title: React.PropTypes.string.isRequired,
  location: React.PropTypes.string,
  startTime: React.PropTypes.instanceOf(Date).isRequired,
  endTime: React.PropTypes.instanceOf(Date).isRequired,
  isAllDayEvent: React.PropTypes.bool.isRequired,
  description: React.PropTypes.string,
  imgUrl: React.PropTypes.string,
  ytId: React.PropTypes.string,
  style: React.PropTypes.shape({
    maxHeight: React.PropTypes.number,
    opacity: React.PropTypes.number
  }).isRequired,
  showMedia: React.PropTypes.bool
};
Event.defaultProps = {
  showMedia: true
};
export default Event;