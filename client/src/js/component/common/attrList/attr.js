import React from 'react';
import { Icon } from '../';

import './attr.less';

const keyVlaue = {};
class Attr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  handleEdit(field, content) {
    if (content === null) content = '';
    this[field].innerHTML = `<input value="${content}" id="${field}" />`;
    this.setState({
      [field]: 'check',
    })
  }

  handleCancel(field, content) {
    if (content === null) content = '';
    this[field].innerHTML = content;
    this.setState({
      [field]: 'edit',
    })
  }

  handleOk(field, content) {
    if (this.props.handleEdit){
      content = document.getElementById(field).value
      this.props.handleEdit({[field]: content}, ()=> {
        this.handleCancel(field, content);
      });
    } else {
      this.handleCancel(field, content);
    }
  }

  renderIcon = (item) => {
    const {field} = item;
    const status = this.state[field] || 'edit';
    const value = keyVlaue[field];
    return status === 'edit' ? <Icon name="pencil-square-o" className="attr-opt" onClick={this.handleEdit.bind(this, field, value)}/>
    : (
      <span>
        <Icon name="close" className="attr-opt" onClick={this.handleCancel.bind(this, field, value)}/>
        <Icon name="check" className="attr-opt" onClick={this.handleOk.bind(this, field, value)}/>
      </span>
    );
  }

  render() {
    const { attrList = [] } = this.props;
    const colSpan = 1;

    return (
      <div className="info-main cols-3">
        {
          attrList.map(item => {
            keyVlaue[item.field] = item.value;
            return (
              <div key={item.label} className={`info-item cols-3-${item.colSpan || colSpan}`}>
                <label className="attr-title">{item.label}</label>
                <span className="attr-content">
                  <span className="attr-value" ref={ref => {this[item.field] = ref}}>{item.value}</span>
                  {item.editable ? this.renderIcon(item) : null}
                </span>
              </div>
            );
          })
        }
      </div>
    );
  }
}

export default Attr;
