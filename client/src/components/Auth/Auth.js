import React, {Component} from 'react';
import './Auth.scss';
import Signin from '../Signin/Signin.js'
import Signup from '../Signup/Signup.js'
import str from '../../constants/labels.constants.js'
import {endpointPort, endpointIP} from '../../config/resources.js'
import axios from 'axios';
import {connect} from 'react-redux';
import {setUserAuth, setAppStarting, setToken} from '../../redux/actions/index.actions.js'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Grid, Row, Col, Button} from 'react-bootstrap'

function mapDispatchToProps(dispatch) {
  return ({
    setAppStarting: (value) => {
      dispatch(setAppStarting(value))
    },
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setToken: (value) => {
      dispatch(setToken(value))
    }
  })
}

const mapStateToProps = state => {
  return {isStarting: state.isStarting, isConnected: state.isConnected, token: state.token};
};

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authState: str.SIGNIN,
      username: '',
      intervalId: null // DEBUG Used to reconnect after server booting
    }

    this.switchAuth = this.switchAuth.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;

    if (this.props.isStarting) {
      axios.post('http://' + endpointIP + ':' + endpointPort + '/login/start', {}).then((res) => {
        this.props.setUserAuth(true);
        this.props.setAppStarting(false);
        this.props.setToken(res.data.token);
      }).catch((err) => {
        console.error(err.response);
        this.props.setUserAuth(false);
        this.props.setAppStarting(false);
        this.props.setToken('');
      });
    }

    if (this.props.token === '') {
      var intervalId = setInterval(this.timer.bind(this), 500);
      this.setState({intervalId: intervalId});
    }
  }

  // DEBUG
  timer() {
    console.log('test');
    if (this.props.token === '') {
      axios.post('http://' + endpointIP + ':' + endpointPort + '/login/start', {}).then((res) => {
        this.props.setUserAuth(true);
        this.props.setAppStarting(false);
        this.props.setToken(res.data.token);
      }).catch((err) => {
        console.error(err.response);
        this.props.setUserAuth(false);
        this.props.setAppStarting(false);
        this.props.setToken('');
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }
  // DEBUG END

  // BUTTONS
  switchAuth() {
    this.setState((state, props) => {
      return {
        authState: (
          state.authState === str.SIGNUP
          ? str.SIGNIN
          : str.SIGNUP)
      };
    });
  }

  render() {
    return <div>
      <hr/>
      <Grid>
        <Row>
          <Col sm={6} smOffset={3} className='authContainer'>
            <Row>
              <Col sm={4} smOffset={8}>
                <Button onClick={this.switchAuth} type='button' block={true} bsStyle='info' className='authSwitcher'>
                  <FontAwesomeIcon icon="arrow-circle-right" size='lg'/> {
                    this.state.authState === str.SIGNUP
                      ? str.SIGNIN
                      : str.SIGNUP
                  }</Button>
              </Col>
            </Row>

            {
              this.state.authState === str.SIGNUP
                ? <Signup></Signup>
                : <Signin></Signin>
            }
          </Col>
        </Row>
      </Grid>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
