import React from 'react';

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

const Event = (props) => {

  let
    { startMonthStr,
      startDayOfMonth,
      startYear,
      interval
    } = props.getPrintFields();

  return (

    <div className="inews-item">
      <a className="inews-thumbnail" href="#">
        <img className="img-responsive" src={props.imgUrl ? props.imgUrl : props.defaultPicture } alt="image" />
      </a>

      <div className="inews-item-content">

        <div className="inews-date-wrapper">
          <span className="inews-date-day">{ startDayOfMonth }</span>
          <span className="inews-date-month">{ startMonthStr }</span>
          <span className="inews-date-year">{ startYear }</span>
        </div>

        <div className="inews-content-inner">

          <h3 className="size-20"><a href="#">{ props.title }</a></h3>
          <ul className="blog-post-info list-inline noborder margin-bottom-20 nopadding">
            <li>
              <a href="">
                <i className="fa fa-hourglass-start"/>
                <span className="font-lato">{ interval }</span>
              </a>
            </li>

            { getLocation(props.location) }

          </ul>
          <div dangerouslySetInnerHTML={props.getRawDescriptionMarkup()}></div>
        </div>
      </div>
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