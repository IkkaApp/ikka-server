import React, {Component} from 'react';
import Product from '../Product/Product.js';
import {connect} from 'react-redux';
import {Col, Row, Grid} from 'react-bootstrap';

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
    return <Grid>
      <Row>
        <Col sm={12}>
          <h3>{this.state.name}</h3>
        </Col>
      </Row>
      <Row>
        <Col sm={12}>
          {this.state.products.map((name) => <Product name={name} key={name}/>)}
        </Col>
      </Row>
    </Grid>;
  }
}

export default connect(mapStateToProps, null)(Category);
