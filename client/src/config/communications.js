import openSocket from 'socket.io-client';
import {
    endpointIP,
    endpointPort
} from './resources.js'

const socket = openSocket('http://' + endpointIP + ':' + endpointPort);

export {
    socket
};