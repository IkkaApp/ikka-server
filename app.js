const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const config = require('./config/resources.js');
const io = module.exports = require('socket.io')();
const socketioJwt = require("socketio-jwt");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const Product = require('./models/product.model.js')
const authRoute = require('./routes/auth.route.js');
const productRoute = require('./routes/product.route.js');

// MongoDB initialization and connection
mongoose.Promise = Promise;

const options = {
  useMongoClient: true
};

const urlmongo = config.mongoURL;
mongoose.connect(urlmongo, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during connection'));
db.once('open', function() {
  console.log('\x1b[36m%s\x1b[0m', "[MongoDB] Connected to database at " + urlmongo);
});


// Express and Body-parser initialization
const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(cookieParser());





// Router dispatch
router.route('/')
  .all((req, res) => {
    res.json({
      message: "Welcome to Ikka app !",
      methode: req.method
    });
  });

app.use('/', authRoute);
app.use('/', productRoute);




app.use(router);
io.listen(app.listen(config.serverPort, config.serverIP, () => {
  console.log('\x1b[36m%s\x1b[0m', "[Server] Server listening on http://" + config.serverIP + ":" + config.serverPort);
  console.log('\x1b[36m%s\x1b[0m', "[Socket.io] Communication established on http://" + config.serverIP + ":" + config.serverPort);
}));


io.use(socketioJwt.authorize({
  secret: config.secret,
  handshake: true
}));

io.on('connection', function(socket) {
  console.log('\x1b[36m%s\x1b[0m', '[Socket.io] User connected');
  socket.emit('connected');

  socket.on('authenticated', function(socket) {
    console.log('hello! ' + socket.decoded_token.name);
  });
  socket.on('disconnect', function() {
    console.log('\x1b[36m%s\x1b[0m', '[Socket.io] User disconnected');
  });


  /* ---- PRODUCT ---- */
  // socket.on('get_product', (content) => {
  //     var query = Grocery.find({
  //         name: content.object
  //     });
  //
  //     query.then(function(doc) {
  //         socket.emit('result', doc);
  //     });
  // });

  // socket.on('get_all_products', (data) => {
  //     var query = Grocery.find({}, 'name');
  //
  //     query.then(function(doc) {
  //         socket.emit('result', doc);
  //     });
  // });

  /* ---- TYPE ---- */
  socket.on('type/all:get', () => {
    var query = Product.find({}, 'type');

    query.then(function(doc) {
      var types = new Set();
      doc.forEach(item => {
        types.add(item.type);
      })
      var t = [...types];
      socket.emit('type/all:result', t);
    });
  });

  socket.on('product/on_type:get', (type) => {
    const query = Product.find({
      'type': type
    });
    const products = {};
    products[type] = [];
    query.then(function(doc) {
      doc.map((content) => {
        products[type].push(content.name);
      })
      socket.emit('product/on_type:result', products);
    });
  })

  /* ---- DELETE ---- */
  socket.on('product:delete', (product) => {
    Product.deleteOne({
      name: product
    }, (err) => {
      console.log(err);
    });

    io.sockets.emit('product:refresh');
  });

  /* ---- MISCELLANOUS ---- */
  socket.on('debug', (type) => {
    var query = Product.find({}, 'name type');
    query.then(function(doc) {

    });
  });
});