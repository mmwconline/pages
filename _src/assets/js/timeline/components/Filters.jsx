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

const Toggle = () => {
  return(
    <div className="padding-6">
      <span className="pull-right event-toggle">
        <ReactBootstrapToggle on={on} off={off} active={true} height="33px" className="pull-right"/>
      </span>
      <span className="event-toggle-title">REGULAR EVENTS</span>
    </div>
  )
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

const Filters = () => {
  return (
    <div>
      <SearchBar/>
      <hr/>
      <DatePicker/>
      <hr />
      <Toggle/>
    </div>
  )
};

export default Filters;

