import React, {Component} from 'react';
import str from '../../constants/labels.constants.js'
import Signin from '../Signin/Signin.js'
import Signup from '../Signup/Signup.js'
import {connect} from 'react-redux';
import axios from 'axios';
import {endpointPort, endpointIP} from '../../config/resources.js'
import {setUserAuth, setAppStarting, setToken} from '../../redux/actions/index.actions.js'

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
      authState: str.SIGNUP,
      username: ''
    }

    this.switchAuth = this.switchAuth.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;

    if (this.props.isStarting) 
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
      <span>{
          this.props.isConnected
            ? <span>Logged as {this.state.username}</span>
            : 'Disconnected'
        }</span>
      <button onClick={this.switchAuth}>Switch to {
          this.state.authState === str.SIGNUP
            ? str.SIGNIN
            : str.SIGNUP
        }</button>
      <h3>{this.state.authState}</h3>
      {
        this.state.authState === str.SIGNUP
          ? <Signup></Signup>
          : <Signin></Signin>
      }
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
