import React from 'react';
import classNames from 'classnames';
import Icon from '../icon/index';

class Card extends React.Component {
  render(） {
    const { childern, title, icon, footer } = this.props;
    return (
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">
            {title}
          </p>
          <a href="#" class="card-header-icon" aria-label="more options">
            <Icon name={icon}/>
          </a>
        </header>
        <div class="card-content">
          <div class="content">
            {children}
          </div>
        </div>
        <footer class="card-footer">
          {footer}
        </footer>
      </div>
    );
  }
}

export default Card;
