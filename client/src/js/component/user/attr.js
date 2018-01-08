import React from 'react';
import './user.less';

class Attr extends React.Component {
  render() {
    const { attrList = [] } = this.props;
    const colSpan = 1;
    return (
      <div className="info-main cols-3">
        {
          attrList.map(item => (
            <div key={item.label} className={`info-item cols-3-${item.colSpan || colSpan}`}>
              <label className="attr-title">{item.label}</label>
              <span className="attr-content">{item.value}</span>
            </div>
          ))
        }
      </div>
    );
  }
}

export default Attr;
