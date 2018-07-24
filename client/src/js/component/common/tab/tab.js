import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Tab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
    }
  }

  handleClick = (data, index) => {
    this.setState({
      index,
    });
    this.props.handleClick && this.props.handleClick(data, index);
  }

  renderTab = () => {
    const tab = [];
    let content = [];
    React.Children.forEach(this.props.children, (tabItem, index) => {
      tab.push(React.cloneElement(
        tabItem,
        {isActive: this.state.index === index, key: index, index, handleClick: this.handleClick},
      ));
      this.state.index === index && (content = [tabItem.props.children]);
    })
    return {
      tab,
      content,
    };
  }

  render() {
    const { tab, content } = this.renderTab();
    const { isCenter, isBoxed = true, size } = this.props;
    return (
      <div>
        <div className={classNames('tabs', {'is-boxed': isBoxed}, {'is-centered': isCenter}, {[`is-${size}`]: size})}>
          <ul>
            {tab}
          </ul>
        </div>
        <div>
          {content}
        </div>
      </div>
    );
  }
}

Tab.propTypes = {
  isCenter: PropTypes.bool,
}

export default Tab;
