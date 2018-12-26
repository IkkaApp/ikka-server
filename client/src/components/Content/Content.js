import React, {Component} from 'react';
import Category from './../Category/Category.js';
import {connect} from 'react-redux';
import {setToken, setSocket} from './../../redux/actions/index.actions.js'
import {connectSocket} from './../../config/communications.js'

function mapDispatchToProps(dispatch) {
  return ({
    setToken: (value) => {
      dispatch(setToken(value))
    },
    setSocket: (value) => {
      dispatch(setSocket(value))
    }
  })
}

const mapStateToProps = state => {
  return {token: state.token, socket: state.socket};
};

class Content extends Component {
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.token !== this.props.token) { // If a new token is found
      // Connect to socket with Jwt token
      const socketStart = connectSocket(this.props.token).on('connected', () => {
        // Set global socket
        this.props.setSocket(socketStart);

        // Get groceries on connection
        this.props.socket.emit('type/all:get');
      });

      // Listen for categories incoming
      socketStart.on('type/all:result', (types) => {
        if (types != null) 
          this.setState({types: types});
        else 
          console.log('Nothing found');
        }
      );

      // Listen for server side refresh
      socketStart.on('product:refresh', () => {
        socketStart.emit('type/all:get');
        this.forceUpdate();
        console.log('forcerefreshed Category');
      });
    }
  }

  componentDidMount() {}

  // BUTTONS
  searchItems() {
    this.state.soc.emit('type/all:get');
    // if (this.state.searchInput === '')
    //     socket.emit('get_all_products', {});
    // else
    //     socket.emit('get_product', {object: this.state.searchInput});
  }

  deleteSelected() {
    this.state.soc.emit('product:delete', this.state.searchInput);
  }

  debugAction() {}

  handleChange(event) {
    this.setState({searchInput: event.target.value});
  }

  // <input type="text" value={this.state.searchInput} onChange={this.handleChange}/>
  // <button onClick={this.searchItems}>Get products</button>
  // <button onClick={this.deleteSelected}>Delete</button>
  // <button onClick={this.debugAction}>debugAction</button>

  render() {
    return (<div>
      <hr/> {this.state.types.map((type) => <Category name={type} key={type}/>)}
    </div>);
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Content);
