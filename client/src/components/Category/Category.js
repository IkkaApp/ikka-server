import React, {Component} from 'react';
import Product from '../Product/Product.js';
import {connect} from 'react-redux';
// import {addProduct, setUserAuth} from './../../redux/actions/index.actions.js'

// function mapDispatchToProps(dispatch) {
//   return {
//     addProduct: product => dispatch(addProduct(product)),
//     setUserAuth: user => dispatch(setUserAuth(user))
//   };
// }

const mapStateToProps = state => {
  return {socket: state.socket};
};

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
    this.props.socket.on('product/on_type:result', (data) => {
      if (data[this.state.name] != null) 
        this.setState({
          products: data[this.state.name]
        });
      }
    );

    // Listen for server side refresh
    this.props.socket.on('product:refresh', () => {
      this.props.socket.emit('product/on_type:get', this.state.name);
      this.forceUpdate();
      console.log('forcerefreshed Product');
    });

    // Ask for products depending on type
    this.props.socket.emit('product/on_type:get', this.state.name);

    // this.props.addProduct('hello');
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

export default connect(mapStateToProps, null)(Category);
