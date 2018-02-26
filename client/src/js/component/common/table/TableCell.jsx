import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import { Checkbox, Radio } from '../index';

class TableCell extends React.Component {
  static propTypes = {
    row: PropTypes.object,
    column: PropTypes.object,
    rowIndex: PropTypes.number,
    cellIndex: PropTypes.number,
    onCheckChange: PropTypes.func,
    checkable: PropTypes.func,
    rowKey: PropTypes.string,
    isChecked: PropTypes.bool,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.isChecked,
    };

    this.handleToggleCheck = this.handleToggleCheck.bind(this);
  }

  handleToggleCheck(row) {
    this.setState({
      isChecked: !this.state.isChecked,
    }, this.props.onCheckChange(!this.state.isChecked, row));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isChecked !== this.state.isChecked) {
      this.setState({ isChecked: nextProps.isChecked });
    }
  }

  // componentWillMount() {
  //   this.setState({ isChecked: this.props.isChecked });
  // }

  render() {
    const { row, column, rowIndex, cellIndex, rowKey, checkable } = this.props;
    const className = column.className;

    const key = row[rowKey];
    if (column.isIndex) return <td key={`cellIndex-${rowIndex}-${cellIndex}`}>{rowIndex + 1}</td>;
    if (column.isCheck) {
      const isDisabled = isFunction(checkable) ? checkable(row) : false;
      return (
        <td key={`cellCheck-${key}`} className="table-check">
          <Checkbox
            checked={this.state.isChecked}
            onChange={() => this.handleToggleCheck(row)}
            disabled={isDisabled}
          />
        </td>
      );
    }
    if (column.isRadio) {
      const isDisabled = isFunction(checkable) ? checkable(row) : false;
      return (
        <td key={`cellRadio-${key}`} className="table-check">
          <Radio
            checked={this.state.isChecked}
            onChange={() => this.handleToggleCheck(row)}
            disabled={isDisabled}
          />
        </td>
      );
    }

    let content = row[column.field];
    if (column.template) {
      content = column.template(row);
    }

    let style = {};
    if (column.style) {
      style = column.style(row[column.field]);
    }

    let classes = '';
    if (isFunction(className)) {
      classes = className(row[column.field]);
    } else {
      classes = className;
    }

    return (
      <td style={style} className={classes}>
        {content}
      </td>
    );
  }
}

export default TableCell;
