import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from 'socket.io-client';
var config = require('./config/ressources.js');

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            socket: null
        }

        this.sendIO = this.sendIO.bind(this);
    }

    componentDidMount() {
        this.setState({
            socket: socketIOClient('http://' + config.endpointIP + ':' + config.endpointPort)
        });
    }

    sendIO() {
        this.state.socket.emit('hello', {
            hello: 'world',
            bye: 'people'
        });
        console.log('The link was clicked.');
    }

    render() {
        return (<div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit
                    <code>src/App.js</code>
                    and save to reload.
                </p>
                <button onClick={this.sendIO}>Bonjour</button>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
        </div>);
    }
}

export default App;
