import React, {Component} from 'react';
import {connect} from 'react-redux';
import './Product.scss';
import {Col, Row, Grid} from 'react-bootstrap';
// import {socket} from './../../config/communications.js';

const mapStateToProps = state => {
  return {socket: state.socket};
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      editMode: false
    };

    this.deleteProduct = this.deleteProduct.bind(this)
    this.toggleProduct = this.toggleProduct.bind(this)
  }

  deleteProduct() {
    // this.props.socket.emit('product:delete', this.state.name);
    this.setState((state, props) => {
      return {
        editMode: !state.editMode
      }
    })
  }

  toggleProduct() {
    this.setState((state, props) => {
      return {
        editMode: !state.editMode
      }
    })
  }

  render() {
    const thisStyle = {
      maxWidth: '100%',
      maxHeight: '100%'
    };

    let displayMode = (
      this.state.editMode
      ? 'fadeOut'
      : 'fadeIn') + ' displayContainer';

    let editMode = (
      this.state.editMode
      ? 'fadeIn'
      : 'fadeOut2') + ' editContainer';
    // <div className='container2'>
    //   <div>
    //     <div className={displayMode}>
    //       <span>{this.state.name}</span>
    //     </div>
    //     <div className='editContainer'>
    //       <div className={editMode}>
    //         <span>Return</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    return <Grid className='productContainer'>
      <Row className='productInside'>
        <Col sm={2}>
          <img src='https://static.openfoodfacts.org/images/products/302/933/000/3533/nutrition_fr.101.400.jpg' className='productImage'/>
        </Col>
        <Col sm={6}>
          <span>Beautiful product</span>
        </Col>
        <Col sm={1} smOffset={3} className='quantityGauge'>
          <div ></div>
        </Col>
      </Row>
    </Grid>;
  }
}

export default connect(mapStateToProps, null)(Product);
