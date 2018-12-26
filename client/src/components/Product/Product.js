import React, {Component} from 'react';
import {connect} from 'react-redux';
// import {socket} from './../../config/communications.js';

const mapStateToProps = state => {
  return {socket: state.socket};
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    };

    this.deleteProduct = this.deleteProduct.bind(this)
  }

  deleteProduct() {
    this.props.socket.emit('product:delete', this.state.name);
  }

  render() {
    const thisStyle = {
      marginLeft: '1rem',
      height: '2rem'
    };

    return <div>
      <span>{this.state.name}</span>
      <button style={thisStyle} onClick={this.deleteProduct}>Delete</button>
    </div>;
  }
}

export default connect(mapStateToProps, null)(Product);
