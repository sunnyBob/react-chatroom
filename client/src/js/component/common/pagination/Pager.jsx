import React from 'react';
import PropTypes from 'prop-types';

class Pager extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    pageNo: PropTypes.number,
    size: PropTypes.string,
    handleChangePage: PropTypes.func,
  };

  render() {
    const {
      isActive,
      pageNo,
      size,
      handleChangePage,
    } = this.props;
    const activeClass = isActive ? `button is-primary ${size}` : `button ${size}`;

    return (
      <li>
        <a className={activeClass} onClick={handleChangePage}>{pageNo}</a>
      </li>
    );
  }
}

export default Pager;
