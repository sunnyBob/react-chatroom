import React from 'react';
import { Icon } from '../';

import './attr.less';

class Attr extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  handleEdit(label, content) {
    const status = this.state[label];
    this[label].innerHTML = `<input value="${content}"/>`;
    this.setState({
      [label]: 'check',
    })
  }

  handleCancel(label, content) {
    this[label].innerHTML = content;
    this.setState({
      [label]: 'edit',
    })
  }

  handleOk(label, content, e) {
    if (this.props.handleOk){
      this.props.handleOk(e.target.value);
    } else {
      this.handleCancel(label, content);
    } 
  }

  renderIcon = (item) => {
    const {label, value} = item;
    const status = this.state[label] || 'edit';
     return status === 'edit' ? <Icon name="pencil-square-o" className="attr-opt" onClick={this.handleEdit.bind(this, label, value)}/>
      : (
        <span>
          <Icon name="close" className="attr-opt" onClick={this.handleCancel.bind(this, label, value)}/>
          <Icon name="check" className="attr-opt" onClick={this.handleOk.bind(this, label, value)}/>
        </span>
      );
  }

  render() {
    const { attrList = [] } = this.props;
    const colSpan = 1;

    return (
      <div className="info-main cols-3">
        {
          attrList.map(item => (
            <div key={item.label} className={`info-item cols-3-${item.colSpan || colSpan}`}>
              <label className="attr-title">{item.label}</label>
              <span className="attr-content">
                <span className="attr-value" ref={ref => {this[item.label] = ref}}>{item.value}</span>
                {item.editable ? this.renderIcon(item) : null}
              </span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Attr;
