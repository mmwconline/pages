//noinspection NpmUsedModulesInstalled
import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactBootstrapToggle from 'react-bootstrap-toggle'

let on = <span>Shown</span>;
let off = <span>Hidden</span>;
let spanStyle = {
  marginTop: '-15px'
};
let spanStyleTitle = {
  color: '#777'
};
const Toggle = () => {
  return(
    <div className="padding-6">
      <span className="pull-right" style={spanStyle}>
        <ReactBootstrapToggle on={on} off={off} active={false} height="33px" className="pull-right"/>
      </span>
      <span style={spanStyleTitle}>REGULAR EVENTS</span>
    </div>
  )
};

class DatePicker extends React.Component {
  constructor() {
    super();
    this.divId = 'datepicker';
    this.style = {
      margin: 'auto'
    };
  }
  render() {
    return (
    <div className="side-nav margin-bottom-30 margin-top-30">

      <div className="side-nav-head">
        <button className="fa fa-bars"/>
        <h4>FILTER BY START DATE</h4>
      </div>
      <div id={this.divId} data-date={new Date()} style={this.style}></div>
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
      <DatePicker/>
      <hr />
      <Toggle/>
    </div>
  )
};

ReactDOM.render(
  <Filters/>,
  document.getElementById('test'));
