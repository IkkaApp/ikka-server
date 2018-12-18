import React, {Component} from 'react';
import axios from 'axios';
// import {socket} from './../../config/communications.js';
import {endpointIP, endpointPort} from './../../config/resources.js'

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usernameInput: '',
      passwordInput: '',
      username: '',
      isLogged: false
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.signinButton = this.signinButton.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;

    axios.post('http://' + endpointIP + ':' + endpointPort + '/login/start', {}).then((res) => {
      this.setState({isLogged: true, username: res.data.email});
    }).catch((err) => {
      console.error(err.response);
    });
  }

  handleUsernameChange(event) {
    this.setState({usernameInput: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({passwordInput: event.target.value});
  }

  signinButton() {
    axios.post('http://' + endpointIP + ':' + endpointPort + '/signup', {
      email: this.state.usernameInput,
      password: this.state.passwordInput
    }).then((res) => {
      if (res.status === 201) {
        this.setState({isLogged: true, username: this.state.usernameInput});
      }
    }).catch((err) => {
      console.error(err.response);
    });
  }

  render() {
    return <div>
      <span>{
          this.state.isLogged
            ? <span>Logged as {this.state.username}</span>
            : 'Disconnected'
        }</span>
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
      <button onClick={this.signinButton}>Signin</button>
    </div>;
  }
}

export default Signup;
