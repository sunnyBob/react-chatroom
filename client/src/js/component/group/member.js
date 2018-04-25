import React from 'react';
import request from '../../utils/request';
import DataTable from '../dataTable/dataTable';

class Member extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
    };
  }

  handleSearch = (searchWord) => {
    this.setState({
      userName: searchWord,
    });
  }

  removeMember = () => {
    request({
      url: '/group',
      method: 'delete',
      data: {
        ids: this.ids,
        groupId: this.props.group.id,
        groupName: this.props.group.group_name,
      },
    }).then(resp => {
      if (resp.code === '1') {
        this.table.refresh();
      }
    });
  }

  handleCheckedChange = (ids) => {
    this.ids = ids;
  }

  render() {
    const { count } = this.props.countInfo;
    const pageSize = 1;
    const columns = [
      { label: '姓名', field: 'username' },
      { label: '年龄', field: 'age' },
      { label: '性别', field: 'sex' },
      { label: '手机号', field: 'phone' },
      {label: '邮箱', field: 'email'},
    ];
    const params = {
      url: '/group',
      data: {
        groupId: this.props.group.id,
        type: '4',
        userName: this.state.userName,
        limit: pageSize,
      },
    };

    return (
      <DataTable
        rowKey='id'
        ref={table => { this.table = table; }}
        params={params}
        columns={columns}
        showToolbar={true}
        toolbar={{
          hasSearch: true,
          hasRefresh: false,
          onSearch: this.handleSearch,
          items: [{
            align: 'left',
            content: <button className="button is-danger" onClick={this.removeMember}>移除</button>,
          }]
        }}
        noDataText={t('No Data')}
        onCheckedChange={this.handleCheckedChange}
        striped={true}
        bordered={true}
        hasCheckbox={true}
        handleSearch={this.handleSearch}
        pagination={{
          pageSize,
          isShow: true,
          size: 'small',
          align: 'right',
          layout: 'total, pager, sizer, jumper',
        }}
      />
    );
  }
}

export default Member;
