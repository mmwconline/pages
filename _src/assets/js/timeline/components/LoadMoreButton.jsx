import React from 'react';

const LoadMoreButton = (props) => {
  return (
    <div className="text-center">

      <a onClick={props.onLoadMore} className="btn btn-lg btn-3d btn-reveal btn-primary">
        <i className="fa fa-calendar-plus-o"/>
        <span>Load More</span>
      </a>
    </div>
  )
};

LoadMoreButton.propTypes = {
  onLoadMore: React.PropTypes.func.isRequired
};

export default LoadMoreButton;