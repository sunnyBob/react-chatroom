import React from 'react';
import ReactDOM from 'react-dom';
import request from '../../utils/request';
import DataTable from '../dataTable/dataTable';
import { browserHistory } from 'react-router';
import { toast } from 'react-toastify';
import { ModalManager, Icon } from '../common';

class Member extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: '',
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  handleSearch = (searchWord) => {
    this.setState({
      userName: searchWord,
    });
  }

  removeMember = () => {
    ModalManager.confirm({
      content: '确定要移除?',
      onOk: async () => {
        await request({
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
            toast.success('移除成功', toastOption);
            socket.emit('updateMyGroupList', this.user.user_id);
            this.handleRedirect(this.user.user_id);
            return true;
          }
        });
      }
    })
  }

  handleCheckedChange = (ids) => {
    this.ids = ids;
  }

  convertParms = (data) => {
    return {
      retList: data.retList[0].ret,
      total: data.retList[0].count,
    };
  }

  setManager = (userId) => {
    request({
      url: '/manager',
      method: 'post',
      data: {
        userId,
        groupId: this.props.group.id,
      },
    }).then(resp => {
      if (resp.code === '1') {
        this.table.refresh();
        toast.success('设置管理员成功', toastOption);
      }
    });
  }

  handleRedirect = (userId) => {
    const modalContainer = document.getElementsByClassName('modal-container')[0];
    const unmountResult = ReactDOM.unmountComponentAtNode(modalContainer);
    if (unmountResult && modalContainer.parentNode) {
      modalContainer.parentNode.removeChild(modalContainer);
    }
    browserHistory.push(`/chat/${userId}`);
  }

  render() {
    const { count } = this.props.countInfo;
    const pageSize = 1;
    const { isCreater, isManager, createrId } = this.props;
    const columns = [
      { label: '姓名', field: 'username' },
      { label: '年龄', field: 'age' },
      { label: '性别', field: 'sex' },
      { label: '手机号', field: 'phone' },
      { label: '邮箱', field: 'email' },
      { label: '操作', template: row => (
        <div>
          {isCreater && <Icon name="user" className="tooltip" data-tooltip="设置管理员" onClick={this.setManager.bind(this, row.id)}/>}
          <Icon name="comment-alt" prefix1="far" className="tooltip" data-tooltip="发消息" onClick={this.handleRedirect.bind(this, row.id)}/>
        </div>
      )},
    ];
    const params = {
      url: '/group',
      data: {
        groupId: this.props.group.id,
        userId: createrId,
        type: '8',
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
        checkable={(row) => row.id == createrId}
        convertParms={this.convertParms}
        toolbar={{
          hasSearch: true,
          hasRefresh: false,
          onSearch: this.handleSearch,
          items: [{
            align: 'left',
            content: <div>
              {(isCreater || isManager) && <button className="button is-danger is-small" onClick={this.removeMember}>移除</button>}
            </div>,
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
