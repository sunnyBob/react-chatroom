import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import shortid from 'shortid';

import TableCell from './TableCell';

class TableBody extends React.Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    columns: PropTypes.array,
    checkable: PropTypes.func,
    showIndex: PropTypes.bool,
    rowClassName: PropTypes.func,
    onCheckChange: PropTypes.func,
    onRowClick: PropTypes.func,
    rowKey: PropTypes.string,
    selectedRowKeys: PropTypes.array,
  };

  constructor() {
    super();

    this.uniqueId = shortid.generate();
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(row) {
    if (this.props.onRowClick) {
      this.props.onRowClick(row);
    }
  }

  render() {
    const {
      data,
      columns,
      rowClassName,
      rowKey,
      selectedRowKeys,
      onRowClick,
      checkable,
    } = this.props;

    let cursorClass = '';
    if (onRowClick) cursorClass = 'tr-pointer';

    return (
      <tbody>
        {data.map((row, index) => {
          const key = row[rowKey] || `${this.uniqueId}-${index}`;
          let className = '';
          if (rowClassName) {
            className = rowClassName(row, index);
          }
          return (
            <tr key={`tr-${key}`} className={classNames(className, cursorClass)} onClick={() => this.handleRowClick(row)}>
              {columns.map((column, cellIndex) => {
                if (!column.visible) return null;
                let isChecked = false;
                if ((column.isCheck || column.isRadio) && selectedRowKeys.indexOf(key) >= 0) {
                  isChecked = true;
                }
                return (
                  <TableCell
                    key={`cell-${index}-${cellIndex}`}
                    column={column}
                    row={row}
                    rowIndex={index}
                    cellIndex={cellIndex}
                    rowKey={rowKey}
                    onCheckChange={this.props.onCheckChange}
                    isChecked={isChecked}
                    checkable={checkable}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    );
  }
}

export default TableBody;
