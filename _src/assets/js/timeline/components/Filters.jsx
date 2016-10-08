//noinspection NpmUsedModulesInstalled
import $ from 'jQuery';
import React from 'react';
import ReactBootstrapToggle from 'react-bootstrap-toggle'


let on = <span>Shown</span>;
let off = <span>Hidden</span>;

const SearchBar = () => {
  return (
    <div className="inline-search clearfix margin-bottom-30">
      <input type="search" placeholder="Start Searching..." className="search-input"/>
      <button type="submit">
        <i className="fa fa-search"/>
      </button>
    </div>
  )
};

const Toggle = (props) => {
  return(
    <div className="padding-6">
      <span className="pull-right event-toggle">
        <ReactBootstrapToggle on={on} off={off} active={props.initialToggle} height="33px" className="pull-right"
                              onChange={props.onToggle}/>
      </span>
      <span className="event-toggle-title">REGULAR EVENTS</span>
    </div>
  )
};

Toggle.propTypes = {
  initialToggle: React.PropTypes.bool,
  onToggle: React.PropTypes.func.isRequired
};

Toggle.defaultProps = {
  initialToggle: true
};

// const RegularEventsButton = () => {
//   return (
//     <a href="#" className="btn btn-3d btn-lg btn-red">
//       Regular Events Shown
//       <span className="font block font-lato">Click here to hide</span>
//     </a>
//   );
// };

class DatePicker extends React.Component {
  constructor() {
    super();
    this.divId = 'datepicker';
  }
  render() {
    return (
      <div className="side-nav margin-bottom-30 margin-top-30">

        <div className="side-nav-head">
          <button className="fa fa-bars"/>
          <h4>FILTER BY START DATE</h4>
        </div>
        <div id={this.divId} data-date={new Date()}></div>
      </div>
    );
  }
  componentDidMount() {
    $(`#${this.divId}`).datepicker({
      todayHighlight: true
    });
  }
}

const Filters = (props) => {
  return (
    <div>
      <SearchBar/>
      <hr/>
      <DatePicker/>
      <hr />
      <Toggle onToggle={props.onToggle} initialToggle={props.initShowRegularEvents}/>
    </div>
  )
};

Filters.propTypes = {
  onToggle: React.PropTypes.func.isRequired,
  initShowRegularEvents: React.PropTypes.bool
};

Filters.defaultProps = {
  initShowRegularEvents: true
};

export default Filters;

