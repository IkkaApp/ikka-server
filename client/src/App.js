import React, {Component} from 'react';
import './App.css';
import {socket} from './config/communications.js';
import Category from './components/Category/Category.js';
import Signup from './components/Signup/Signup.js';
import axios from 'axios';
import {endpointPort, endpointIP} from './config/resources.js'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      types: []
    }

    this.searchItems = this.searchItems.bind(this);
    this.deleteSelected = this.deleteSelected.bind(this);
    this.debugAction = this.debugAction.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    // Listen for categories incoming
    socket.on('type/all:result', (types) => {
      if (types != null) 
        this.setState({types: types});
      else 
        console.log('Nothing found');
      }
    );

    // Get groceries on connection
    socket.on('connected', () => {
      console.log('[Socket.io] Connected');
      socket.emit('type/all:get');
    });

    // Listen for server side refresh
    socket.on('product:refresh', () => {
      socket.emit('type/all:get');
      this.forceUpdate();
      console.log('forcerefreshed Category');
    });
  }

  // BUTTONS
  searchItems() {
    socket.emit('type/all:get');
    // if (this.state.searchInput === '')
    //     socket.emit('get_all_products', {});
    // else
    //     socket.emit('get_product', {object: this.state.searchInput});
  }

  deleteSelected() {
    socket.emit('product:delete', this.state.searchInput);
  }

  debugAction() {
    axios.post('http://' + endpointIP + ':' + endpointPort + '/login', {user: 'hello world'}).then((res) => {
      console.log(res)
    }).catch((error) => {
      console.error(error)
    });
  }

  handleChange(event) {
    this.setState({searchInput: event.target.value});
  }

  render() {
    return (<div className="App">
      <header className="App-header">
        <input type="text" value={this.state.searchInput} onChange={this.handleChange}/>

        <button onClick={this.searchItems}>Get products</button>
        <button onClick={this.deleteSelected}>Delete</button>
        <button onClick={this.debugAction}>debugAction</button>

        {this.state.types.map((type) => <Category name={type} key={type}/>)}

        <Signup></Signup>
      </header>

    </div>);
  }
}

export default App;
