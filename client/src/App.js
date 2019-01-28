import React, {Component} from 'react';
import 'App.css';
import Content from 'components/Content/Content.js';
import Auth from 'components/Auth/Auth.js'
import axios from 'axios';
import {endpointPort, endpointIP} from 'config/resources'
import {connect} from "react-redux";
import {setUserAuth} from 'redux/actions/index.actions.js'
import {Grid, Row, Col, ButtonToolbar} from 'react-bootstrap';

function mapDispatchToProps(dispatch) {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    }
  })
}

const mapStateToProps = state => {
  return {isConnected: state.isConnected, token: state.token};
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: []
    }

    this.debugAction = this.debugAction.bind(this);
    this.disconnectUser = this.disconnectUser.bind(this);
  }

  debugAction() {
    console.log(this.props.token);
  }

  disconnectUser() {
    axios.post('http://' + endpointIP + ':' + endpointPort + '/logout', {}).then((res) => {
      if (res.status === 204) {
        this.props.setUserAuth(false);
      }
    }).catch((err) => {
      console.error(err.response);
      this.props.setUserAuth(false);
    });
  }

  componentDidMount() {}

  render() {
    return (<div className="App">
      <Grid>
        <Row className="show-grid">
          <Col>
            <button onClick={this.debugAction}>DEBUG MAIN</button>
            {this.props.isConnected && <button onClick={this.disconnectUser}>Log out</button>}

            <Grid>
              <Row className="show-grid">
                <Col md={6} mdOffset={3}>
                  {!this.props.isConnected && <Auth></Auth>}
                </Col>
              </Row>
            </Grid>

            <Grid>
              <Row className="show-grid">
                <Col md={12}>
                  {this.props.isConnected && <Content/>}
                </Col>
              </Row>
            </Grid>

          </Col>
        </Row>
      </Grid>
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
