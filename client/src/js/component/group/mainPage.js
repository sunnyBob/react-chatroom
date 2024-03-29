import React from 'react';
import GroupPie from './groupPie';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import request from '../../utils/request';
import RootStore from '../../stores/rootStore';
import {AttrList} from '../common';

@observer
class MainPage extends React.Component {
  handleEdit = (data, cb) => {
    data.groupId = this.props.group.id;
    request({
      url: '/group',
      method: 'put',
      data,
    }).then(resp => {
      if (resp.code === '1') {
        cb();
        this.props.fetchData();
        socket.emit('updateGroupList', this.props.group.id);
      }
    });
  }

  render() {
    const { count, maleCount, after90Count } = this.props.countInfo;
    const { announce, introduce, group_name, id} = this.props.group;
    const { isCreater, isManager, creater } = this.props;

    const attrList = [{
      label: t('群Id'),
      value: id,
      colSpan: 1,
    }, {
      label: t('群主'),
      value: creater.username,
      colSpan: 1,
    }, {
      label: t('群名称'),
      field: 'group_name',
      value: group_name,
      colSpan: 3,
      editable: isCreater || isManager,
    }, {
      label: t('群介绍'),
      field: 'announce',
      value: announce,
      colSpan: 3,
      editable: isCreater || isManager,
    }, {
      label: t('群公告'),
      field: 'introduce',
      value: introduce,
      editable: true,
      colSpan: 3,
      editable: isCreater || isManager,
    }];

    return (
      <div className="main-page">
        <AttrList attrList={attrList} wrapClass="group-attr" handleEdit={this.handleEdit}/>
        <div>
          <label className="attr-label">成员分布</label>
          <div className="columns">
            <GroupPie
              wrapClass="column graph"
              key="sex" color="#3ea2c0"
              bigR={70}
              smallR={15}
              fontSize={24}
              percent={count ? parseInt(maleCount / count  * 100, 10) : 0}
              label={`男 - ${maleCount}人`}
            />
            <GroupPie
              wrapClass="column graph"
              key="after90" color="#713986"
              bigR={70}
              smallR={15}
              fontSize={24}
              percent={count ? parseInt(after90Count / count  * 100, 10) : 0}
              label={`90后 - ${after90Count}人`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MainPage;
