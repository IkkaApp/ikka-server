import React, {Component} from 'react';
import './Product.scss';
import {connect} from 'react-redux';
import {Col, Row, Grid, Button} from 'react-bootstrap';

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
    this.testButton = this.testButton.bind(this)
  }

  deleteProduct() {
    this.props.socket.emit('product:delete', this.state.name);
  }

  toggleProduct(event) {
    if (event.target.tagName !== 'BUTTON') 
      this.setState((state, props) => {
        return {
          editMode: !state.editMode
        }
      })
  }

  testButton(event) {
    console.log('click');
  }

  render() {
    let displayMode = (
      this.state.editMode
      ? 'displayFadeOut'
      : 'fadeIn') + ' productInside';

    let editMode = (
      this.state.editMode
      ? 'fadeIn'
      : 'editFadeOut') + ' editContainer';

    return <Grid className='productContainer'>
      <Row className={displayMode} onClick={this.toggleProduct}>
        <Col sm={2} xs={2}>
          <img src='https://static.openfoodfacts.org/images/products/302/933/000/3533/nutrition_fr.101.400.jpg' alt='ProductImg' className='productImage'/>
        </Col>
        <Col sm={6} xs={6}>
          <span>Beautiful product</span>
        </Col>
        <Col sm={1} smOffset={3} xs={3} xsOffset={1} className='quantityGauge'>
          <div></div>
        </Col>
      </Row>

      <Grid className={editMode}>
        <Row onClick={this.toggleProduct}>
          <Col sm={2} xs={2}>
            <Button type='button' block={true} bsSize='large' bsStyle='success' onClick={this.testButton}>TEST</Button>
          </Col>
          <Col sm={6} xs={6}>
            <Button type='button' block={true} bsSize='large' bsStyle='success' onClick={this.testButton}>TEST</Button>
          </Col>
          <Col sm={3} smOffset={1} xs={3} xsOffset={1}>
            <Button type='button' block={true} bsSize='large' bsStyle='success' onClick={this.testButton}>TEST</Button>
          </Col>
        </Row>
      </Grid>

    </Grid>;
  }
}

export default connect(mapStateToProps, null)(Product);
