import React, {Component} from 'react';
import './App.css';
import Content from './components/Content/Content.js';
import Auth from './components/Auth/Auth.js'
import axios from 'axios';
import {endpointPort, endpointIP} from './config/resources.js'
import {connect} from "react-redux";
import {setUserAuth} from './redux/actions/index.actions.js'

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
      <header className="App-header">
        <button onClick={this.debugAction}>DEBUG MAIN</button>
        {this.props.isConnected && <button onClick={this.disconnectUser}>Log out</button>}
        {!this.props.isConnected && <Auth></Auth>}
        {this.props.isConnected && <Content/>}
      </header>
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
