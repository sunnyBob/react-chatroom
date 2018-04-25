import React from 'react';
import { Table } from '../common';
import request from '../../utils/request';

class DataTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      current: 1,
      total: 0,
    };
  }

  componentDidMount() {
    this.fetchData(this.props.params);
  }

  refresh = () => {
    this.fetchData(this.props.params);
  }

  fetchData = (params) => {
    request(params).then(resp => {
      if (resp.code === '1') {
        this.setState({ data: resp.retList, total: resp.total });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params !== nextProps.params) {
      this.fetchData(nextProps.params);
    }
  }

  handlePageChange = (page) => {
    let data = { ...this.props.params.data };
    const pageSize = this.props.pagination.pageSize;
    data.limit = pageSize;
    data.offset = (page - 1) * pageSize;
    const params = {
      url: this.props.params.url,
      data,
    };
    this.setState({
      current: page,
    }, () => {
      this.fetchData(params);
    });
  }

  handleCheckedChange = (rowIds, row) => {
    this.props.onCheckedChange && this.props.onCheckedChange(rowIds, row);
  }

  render() {
    const { columns, hasCheckbox, pagination, ...props } = this.props;
      
    return (
      <Table
        columns={columns}
        hasCheckbox={hasCheckbox}
        pagination={{
          onChange: this.handlePageChange,
          total: this.state.total,
          current: this.state.current,
          ...pagination,
        }}
        onCheckedChange={this.handleCheckedChange}
        className='is-fullwidth'
        data={this.state.data}
        {...props}
      />
    );
  }
}

export default DataTable;
