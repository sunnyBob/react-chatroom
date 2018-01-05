import React, { Component } from 'react';
import { Card } from '../'

import './popover.less';

export default class Popover extends Component {
  render() {
    const { content } = this.props;
    return (
      <Card showHeader={false}>
        {content}
      </Card>
    );
  }
}
