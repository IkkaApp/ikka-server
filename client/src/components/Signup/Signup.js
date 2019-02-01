import React, {Component} from 'react';
import './Signup.scss';
import axios from 'axios';
import {endpointIP, endpointPort} from '../../config/resources.js'
import {connect} from 'react-redux';
import {setUserAuth, setToken} from '../../redux/actions/index.actions.js'
import str from '../../constants/labels.constants.js'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  Col,
  Form,
  FormGroup,
  FormControl,
  Button,
  HelpBlock
} from 'react-bootstrap'

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
      errorMessage: '',
      usernameState: null,
      passwordState: null,
      buttonText: 'Sign up',
      buttonDisabled: false
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
    this.setState({buttonDisabled: true});
    axios.post('http://' + endpointIP + ':' + endpointPort + '/signup', {
      email: this.state.usernameInput,
      password: this.state.passwordInput
    }).then((res) => {
      if (res.status === 201) {
        this.props.setUserAuth(true);
        // TODO: clear errorMessage
        this.props.setToken(res.data.token);
      }
      this.setState({buttonDisabled: false});
    }).catch((err) => {
      console.log(err);
      this.props.setToken('');
      this.setState({
        // errorMessage: (
        //   err == 'Network Error'
        //   ? str[err.response.data.error]
        //   : 'Server is currently burning, please try again later'),
        errorMessage: str[err.response.data.error],
        usernameState: 'error',
        passwordState: 'error',
        buttonDisabled: false
      });
      this.props.setUserAuth(false);
    });
  }

  // TODO: set input rules
  // TODO: reset validation rules on input focus
  render() {
    return <Form horizontal={true} className='signinForm'>
      <FormGroup controlId='formHorizontalEmail' bsSize='large' validationState={this.state.usernameState}>
        <Col sm={12} smOffset={0}>
          <FormControl type='email' placeholder='Email' name='username' onChange={this.handleUsernameChange}/>
        </Col>
      </FormGroup>

      <FormGroup controlId='formHorizontalPassword' bsSize='large' validationState={this.state.passwordState}>
        <Col sm={12} smOffset={0}>
          <FormControl type='password' placeholder='Password' name='password' onChange={this.handlePasswordChange}/>
        </Col>
        <Col sm={12} smOffset={0}>
          <HelpBlock>{this.state.errorMessage}</HelpBlock>
        </Col>
      </FormGroup>

      <FormGroup>
        <Col sm={12} smOffset={0}>
          <Button type='button' block={true} bsSize='large' bsStyle='success' onClick={this.signupUser} disabled={this.state.buttonDisabled}>{
              this.state.buttonDisabled
                ? <FontAwesomeIcon icon="circle-notch" spin={true} size='lg'/>
                : 'Sign up'
            }</Button>
        </Col>
      </FormGroup>
    </Form>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
