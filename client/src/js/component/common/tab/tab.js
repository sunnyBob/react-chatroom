import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Tab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: '',
      index: 0,
    }
  }
  
  handleClick = (data, index) => {
    this.setState({
      content: [data],
      index,
    });
    this.props.handleClick && this.props.handleClick(data, index);
  }

  renderTab = () => {
    const tab = [];
    const content = [];
    React.Children.forEach(this.props.children, (tabItem, index) => {
      tab.push(React.cloneElement(
        tabItem,
        {isActive: this.state.index === index, key: index, index, handleClick: this.handleClick},
      ));
      !this.state.content && index === 0 && (this.state.content = [tabItem.props.children]);
    })
    return tab;
  }

  render() {
    const tab = this.renderTab();
    const { isCenter } = this.props;
    const style = isCenter ? 'is-centered' : '';
    return (
      <div>
        <div className={`tabs is-boxed ${style}`}>
          <ul>
            {tab}
          </ul>
        </div>
        <div>
          {this.state.content}
        </div>
      </div>
    );
  }
}

Tab.propTypes = {
  isCenter: PropTypes.bool,
}

export default Tab;
