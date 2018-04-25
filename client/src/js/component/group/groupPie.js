import React from 'react';
class GroupPie extends React.Component {
  static defaultProps = {
    height: 150,
    width: 150,
    color: '#FF9600',
    bigR: 80,
    smallR: 20,
    percent: 0,
    fontSize: 20,
  }

  componentDidMount() {
    this.drawProcess(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.drawProcess(nextProps);
  }

  drawProcess = (props) => {
    const { color, bigR, smallR, fontSize, height, width, percent } = props;
    const c =  this.canvas;
    const ctx = c.getContext('2d');
    // 画灰色的圆
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, bigR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#F6F6F6';
    ctx.fill();
    // 画进度环
    ctx.beginPath();
    ctx.moveTo(width / 2, height / 2);
    ctx.arc(width / 2, height / 2, bigR, Math.PI * 1.5, Math.PI * (1.5 + 2 * percent / 100));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    // 画内填充圆
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, bigR - smallR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#fff';
    ctx.fill();
    // 填充文字
    ctx.font = `bold ${fontSize}px Microsoft YaHei`;
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.moveTo(width / 2, height / 2);
    ctx.fillText(percent+'%', width / 2, height / 2);
  }

  render() {
    const { percent, width, height, wrapClass, label} = this.props;
    return (
      <div className={wrapClass || ''}>
        <canvas ref={canvas => { this.canvas = canvas }} width={width} height={height}></canvas>
        <p>{label}</p>
      </div>
    );
  }
}

export default GroupPie;
