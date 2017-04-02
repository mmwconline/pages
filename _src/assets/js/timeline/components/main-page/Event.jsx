import React from 'react';

function getLocation(locationStr) {
  if (locationStr)
    return (
      <li>
        <i className="fa fa-map-marker"/>
        <span className="font-lato">{ locationStr }</span>
      </li>
    );
}
function getMedia(imgUrl, ytId, defaultImage) {
  //can either have an image or a video; not both. Image takes precedence
  if (imgUrl)
    return (
      <div className="inews-thumbnail">
        <img className="img-responsive" src={imgUrl} alt="image" />
      </div>
    );
  else if (ytId)
    return (
      <div className="inews-thumbnail">
        <div className="embed-responsive embed-responsive-16by9">
          <iframe className="embed-responsive-item" src={`https://www.youtube.com/embed/${ytId}?wmode=transparent`} width="350" height="200"></iframe>
        </div>
      </div>
    );
  else
    return (
      <div className="inews-thumbnail">
        <img className="img-responsive" src={defaultImage} alt="image" />
      </div>
    )

}
const Event = (props) => {

  let
    { startDateStr,
      startMonthStr,
      startDayOfMonth,
      startYear,
      interval
    } = props.getPrintFields();

  return (

    <div className="inews-item">
      { getMedia(props.imgUrl, props.ytId, props.defaultPicture) }

      <div className="inews-item-content">

        <div className="inews-date-wrapper">
          <span className="inews-date-day">{ startDayOfMonth }</span>
          <span className="inews-date-month">{ startMonthStr }</span>
          <span className="inews-date-year">{ startYear }</span>
        </div>

        <div className="inews-content-inner">

          <h3 className="size-20 styleColor">{ props.title }</h3>
          <ul className="blog-post-info list-inline noborder margin-bottom-20 nopadding">
            <li>
              <i className="fa fa-calendar"/>
              <span className="font-lato">{ startDateStr }</span>
            </li>
            <li>
              <i className="fa fa-hourglass-start"/>
              <span className="font-lato">{ interval }</span>
            </li>

            { getLocation(props.location) }

          </ul>
          <div style={{minHeight: '55px'}} dangerouslySetInnerHTML={props.getRawDescriptionMarkup()}></div>
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
  getPrintFields: React.PropTypes.func.isRequired,
  getRawDescriptionMarkup: React.PropTypes.func.isRequired,
  defaultPicture: React.PropTypes.string.isRequired
};
Event.defaultProps = {
  showMedia: true
};
export default Event;