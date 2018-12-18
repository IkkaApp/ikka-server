import React, {Component} from 'react';
import Product from './../Product/Product.js';
import {socket} from './../../config/communications.js';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      name: props.name
    };
  }

  componentDidMount() {
    // Listen for incoming products
    socket.on('product/on_type:result', (data) => {
      if (data[this.state.name] != null) 
        this.setState({
          products: data[this.state.name]
        });
      }
    );

    // Listen for server side refresh
    socket.on('product:refresh', () => {
      socket.emit('product/on_type:get', this.state.name);
      this.forceUpdate();
      console.log('forcerefreshed Product');
    });

    // Ask for products depending on type
    socket.emit('product/on_type:get', this.state.name);
  }

  // {
  //     ...state,
  //     header: {
  //         ...state.header,
  //         Categories: {}
  //     }
  // }
  render() {
    return <div>
      <h3>{this.state.name}</h3>
      {this.state.products.map((name) => <Product name={name} key={name}/>)}
    </div>;
  }
}

export default Category;
