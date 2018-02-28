import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import Pager from './Pager';
import { Select } from '../';

class Pagination extends React.Component {
  static propTypes = {
    pageSize: PropTypes.number,
    current: PropTypes.number,
    total: PropTypes.number,
    onChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    simple: PropTypes.bool,
    sizeOptions: PropTypes.array,
    align: PropTypes.string,
    size: PropTypes.string,
    layout: PropTypes.string,
    hasPagerList: PropTypes.bool,
  };

  static defaultProps = {
    pageSize: 10,
    current: 1,
    onChange: () => {},
    onPageSizeChange: () => {},
    layout: 'total, pager, sizer, jumper',
    hasPagerList: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      current: props.current || 1,
      pageSize: props.pageSize,
      sizeOptions: props.sizeOptions || [
        props.pageSize * 1,
        props.pageSize * 2,
        props.pageSize * 3,
        props.pageSize * 4,
        props.pageSize * 5,
      ],
      totalPage: 1,
      total: props.total,
      show: true,
    };

    this.uniqueKey = shortid.generate();

    this.hasPrev = this.hasPrev.bind(this);
    this.hasNext = this.hasNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
    this.handleJumpPrev = this.handleJumpPrev.bind(this);
    this.handleJumpNext = this.handleJumpNext.bind(this);
    this.handleQuickJumper = this.handleQuickJumper.bind(this);
  }

  setTotalPage() {
    const total = this.state.total;
    const pageSize = this.state.pageSize;
    const totalPage = Math.floor((total - 1) / pageSize) + 1;

    if (totalPage < 1) {
      this.setState({ show: false });
    } else {
      this.setState({ totalPage, show: true });
    }
  }

  hasPrev() {
    return this.state.current > 1;
  }

  hasNext() {
    return this.state.current < this.state.totalPage;
  }

  handlePrev() {
    if (!this.hasPrev()) return;
    this.handleChangePage(this.state.current - 1);
  }

  handleNext() {
    if (!this.hasNext()) return;
    this.handleChangePage(this.state.current + 1);
  }

  handleJumpPrev() {
    this.handleChangePage(Math.max(1, this.state.current - 5));
  }

  handleJumpNext() {
    this.handleChangePage(Math.min(this.state.totalPage, this.state.current + 5));
  }

  handleChangePage(p) {
    if (p !== this.state.current) {
      this.setState({
        current: p,
      });
      this.props.onChange(p);
    }
  }

  handlePageSizeChange(value) {
    const pageSize = Number(value);
    this.setState({ pageSize }, () => {
      this.setTotalPage();
      this.handleChangePage(1);
      this.props.onPageSizeChange(pageSize);
    });
  }

  handleQuickJumper(e) {
    const page = Number(e.target.value);
    if (!page || isNaN(page)) return;

    if (page > this.state.totalPage) return;

    if (e.keyCode === 13) {
      this.handleChangePage(page);
    }
  }

  componentWillMount() {
    this.sizeClass = this.props.size === 'small' ? 'is-small' : '';
    this.alignClass = this.props.align ? `is-${this.props.align}` : '';

    this.setTotalPage();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pageSize !== this.props.pageSize ||
      nextProps.total !== this.props.total) {
      const total = nextProps.total;
      const pageSize = nextProps.pageSize;
      this.setState({ total, pageSize }, () => this.setTotalPage());
    }
    if (nextProps.current && nextProps.current !== this.state.current) {
      this.setState({ current: nextProps.current });
    }
  }

  componentDidMount() {
    this.handleChangePage(this.state.current);
  }

  render() {
    const sizeClass = this.sizeClass;
    const alignClass = this.alignClass;
    const pagerList = [];
    let pager = null;
    let total = null;
    let sizer = null;
    let jumper = null;
    let prevPager = null;
    let nextPager = null;
    let firstPager = null;
    let lastPager = null;
    const { current, show } = this.state;
    const pageSizeOptions = this.state.sizeOptions.map(option => ({ label: `${option} 条/页`, value: option }));

    if (this.props.simple) {
      const prevClass = this.hasPrev()
        ? `button is-primary ${sizeClass}`
        : `button is-light is-disabled ${sizeClass}`;
      const nextClass = this.hasNext()
        ? `button is-primary ${sizeClass}`
        : `button is-light is-disabled ${sizeClass}`;
      pager = (
        <ul key={`${this.uniqueKey}-simple-ul`}>
          <li className="page-info">
            {/* <input */}
            {/* className={`input ${sizeClass}`} */}
            {/* value={current} */}
            {/* type="number" */}
            {/* min="1" */}
            {/* onKeyUp={this.handleQuickJumper} */}
            {/* /> */}
            {current} / {this.state.totalPage}
          </li>
          <li>
            <a className={prevClass} onClick={this.handlePrev}>
              <i className="fa fa-angle-left"></i>
            </a>
          </li>
          <li>
            <a className={nextClass} onClick={this.handleNext}>
              <i className="fa fa-angle-right"></i>
            </a>
          </li>
        </ul>
      );
    } else {
      if (this.state.totalPage <= 6) {
        for (let i = 1; i <= this.state.totalPage; i++) {
          const active = current === i;
          pagerList.push(
            <Pager
              key={`${this.uniqueKey}-pager-${i}`}
              pageNo={i}
              isActive={active}
              size={sizeClass}
              handleChangePage={this.handleChangePage.bind(this, i)}
            />,
          );
        }
      } else {
        prevPager = (
          <li className="btn-jumper" key={`${this.uniqueKey}-prevPager`}>
            <a
              className={`button is-primary is-inverted ${sizeClass}`}
              onClick={this.handleJumpPrev}
            >
              <i className="fa fa-angle-double-left"></i>
            </a>
          </li>
        );
        nextPager = (
          <li className="btn-jumper" key={`${this.uniqueKey}-nextPager`}>
            <a
              className={`button is-primary is-inverted ${sizeClass}`}
              onClick={this.handleJumpNext}
            >
              <i className="fa fa-angle-double-right"></i>
            </a>
          </li>
        );
        firstPager = (
          <Pager
            active={false}
            size={sizeClass}
            pageNo={1}
            key={`${this.uniqueKey}-firstPager`}
            handleChangePage={this.handleChangePage.bind(this, 1)}
          />
        );
        lastPager = (
          <Pager
            active={false}
            size={sizeClass}
            pageNo={this.state.totalPage}
            key={`${this.uniqueKey}-lastPager`}
            handleChangePage={this.handleChangePage.bind(this, this.state.totalPage)}
          />
        );

        let left = Math.max(1, current - 2);
        let right = Math.min(current + 2, this.state.totalPage);

        if (current - 1 <= 2) {
          right = 1 + 4;
        }

        if (this.state.totalPage - current <= 2) {
          left = this.state.totalPage - 4;
        }

        for (let i = left; i <= right; i++) {
          const active = current === i;
          pagerList.push(
            <Pager
              key={`${this.uniqueKey}-pager-${i}`}
              pageNo={i}
              size={sizeClass}
              isActive={active}
              handleChangePage={this.handleChangePage.bind(this, i)}
            />,
          );
        }

        if (current - 1 >= 4) {
          pagerList.unshift(prevPager);
        }
        if (this.state.totalPage - current >= 4) {
          pagerList.push(nextPager);
        }

        if (left !== 1) {
          pagerList.unshift(firstPager);
        }
        if (right !== this.state.totalPage) {
          pagerList.push(lastPager);
        }
      }

      total = <span key={`${this.uniqueKey}-total`}>共 {this.props.total} 条</span>;
      jumper = (
        <span key={`${this.uniqueKey}-jumper`}>
          <span>跳至</span>
          <input
            className={`input ${sizeClass}`}
            type="number"
            min="1"
            onKeyUp={this.handleQuickJumper}
          />
          <span>页</span>
        </span>
      );
      sizer = (
        <Select
          key={`${this.uniqueKey}-pageSize`}
          options={pageSizeOptions}
          onChange={this.handlePageSizeChange}
          value={this.state.pageSize}
          size={this.props.size}
        />
      );
      pager = (
        <ul key={`${this.uniqueKey}-pager`}>
          <li>
            <a className={`button ${sizeClass}`} onClick={this.handlePrev} disabled={!this.hasPrev()}>
              <i className="fa fa-angle-left"></i>
            </a>
          </li>
          {this.props.hasPagerList ? pagerList.map(page => page) : null}
          <li>
            <a className={`button ${sizeClass}`} onClick={this.handleNext} disabled={!this.hasNext()}>
              <i className="fa fa-angle-right"></i>
            </a>
          </li>
        </ul>
      );
    }

    const items = {
      total, sizer, pager, jumper,
    };
    const components = this.props.layout.split(',');
    return show ? (
      <nav className={`pagination ${sizeClass} ${alignClass}`}>
        {components.map(item => items[item.trim()])}
      </nav>
    ) : null;
  }
}

export default Pagination;
