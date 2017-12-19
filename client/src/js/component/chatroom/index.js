import React from 'react';

class ChatRoom extends React.Component {
  render() {
    console.log(this.props.children);
    return (
      <div>
        welcome to ChatRoom!
      </div>
    )
  }
}

export {
  ChatRoom
}
