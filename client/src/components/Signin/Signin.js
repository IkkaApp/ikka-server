import React, {Component} from 'react';
import axios from 'axios';
import {endpointIP, endpointPort} from '../../config/resources.js'
import {connect} from 'react-redux';
import {setUserAuth, setToken} from '../../redux/actions/index.actions.js'
import str from '../../constants/labels.constants.js'

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
  return {isConnected: state.isConnected, token: state.token};
};

class Signin extends Component {
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
    this.signinUser = this.signinUser.bind(this);
  }

  componentDidMount() {
    axios.defaults.withCredentials = true;
  }

  handleUsernameChange(event) {
    this.setState({usernameInput: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({passwordInput: event.target.value});
  }

  signinUser() {
    axios.post('http://' + endpointIP + ':' + endpointPort + '/login', {
      email: this.state.usernameInput,
      password: this.state.passwordInput
    }).then((res) => {
      if (res.status === 200) {
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
      <button onClick={this.signinUser}>Signin</button>
    </div>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
