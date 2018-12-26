import React, {Component} from 'react';
import axios from 'axios';
import {endpointIP, endpointPort} from './../../config/resources.js'
import {connect} from 'react-redux';
import {setUserAuth, setToken} from './../../redux/actions/index.actions.js'
import str from './../../constants/labels.constants.js'

function mapDispatchToProps(dispatch) {
  return ({
    setUserAuth: (value) => {
      dispatch(setUserAuth(value))
    },
    setToken: (value) => {
      dispatch(setToken(value))
    }
  })
}

const mapStateToProps = state => {
  return {isConnected: state.isConnected};
};

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
      passwordInput: '',
      username: '',
      errorMessage: ''
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signupUser = this.signupUser.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;

    // axios.post('http://' + endpointIP + ':' + endpointPort + '/login/start', {}).then((res) => {
    //   this.props.setUserAuth(true);
    // }).catch((err) => {
    //   console.error(err.response);
    //   this.props.setUserAuth(false);
    // });
  }

  handleUsernameChange(event) {
    this.setState({usernameInput: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({passwordInput: event.target.value});
  }

  signupUser() {
    axios.post('http://' + endpointIP + ':' + endpointPort + '/signup', {
      email: this.state.usernameInput,
      password: this.state.passwordInput
    }).then((res) => {
      if (res.status === 201) {
        this.props.setUserAuth(true);
        // TODO: clear errorMessage
        this.props.setToken(res.data.token);
      }
    }).catch((err) => {
      console.log(err);
      this.props.setToken('');
      this.setState({
        errorMessage: str[err.response.data.error]
      });
      this.props.setUserAuth(false);
    });
  }

  render() {
    return <div>
      <form>
        <label>
          Username:
          <input name="username" onChange={this.handleUsernameChange}/>
        </label>
        <br/>
        <label>
          Password:
          <input name="password" type="password" onChange={this.handlePasswordChange}/>
        </label>
      </form>
      <span>{this.state.errorMessage}</span>
      <button onClick={this.signupUser}>Signup</button>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
