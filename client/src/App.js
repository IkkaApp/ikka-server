import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {socket} from './config/communications.js';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {}

        this.sendIO = this.sendIO.bind(this);
    }

    componentDidMount() {
        socket.on('answer', (data) => {
            console.log('incoming : ' + data);
        });
    }

    sendIO() {
        socket.emit('hello', {
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
