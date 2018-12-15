var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var config = require('./config/resources.js');
const io = require('socket.io')();

// MongoDB initialization and connection
mongoose.Promise = Promise;

var options = {
    useMongoClient: true
};

var urlmongo = config.mongoURL;
mongoose.connect(urlmongo, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during connection'));
db.once('open', function() {
    console.log('\x1b[36m%s\x1b[0m', "[MongoDB] Connected to database at " + urlmongo);
});

var groceryScheme = mongoose.Schema({
    name: String,
    id: String,
    type: String
});
var Grocery = mongoose.model('Grocery', groceryScheme);




// Express and Body-parser initialization
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());





// Router dispatch
router.route('/')
    .all((req, res) => {
        res.json({
            message: "Welcome to Ikka app !",
            methode: req.method
        });
    });

router.route('/login')
    .post((req, res) => {
        res.json({
            message: "Login post",
            methode: req.method
        })
    });

router.route('/groceries')
    .get((req, res) => {
        // Grocery.find(null, (err, groceries) => {
        //     if (err)
        //         res.send(err);
        //     res.json({
        //         message: groceries
        //     })
        // })


        var query = Grocery.find(null);
        query.where('type', 'Vegetable');
        query.limit(3);
        query.then(function(doc) {
            res.json({
                message: doc
            });
        });
        // query.exec().then((err, groceries) => {
        //     if (err) {
        //         throw err;
        //     }
        //     // On va parcourir le résultat et les afficher joliment
        //     var gr;
        //     for (var i = 0, l = groceries.length; i < l; i++) {
        //         gr = groceries[i];
        //         console.log('hey ' + gr);
        //     }
        // });

    })
    .post((req, res) => {
        var gr = new Grocery();
        gr.name = req.body.name;
        gr.id = req.body.id;
        gr.type = req.body.type;
        gr.save((err) => {
            if (err)
                res.send(err);

            io.sockets.emit('grocery:refresh');

            res.json({
                message: 'Grocery succesfully added'
            });

        });
    })





app.use(router);
io.listen(app.listen(config.serverPort, config.serverIP, () => {
    console.log('\x1b[36m%s\x1b[0m', "[Server] Server listening on http://" + config.serverIP + ":" + config.serverPort);
    console.log('\x1b[36m%s\x1b[0m', "[Socket.io] Communication established on http://" + config.serverIP + ":" + config.serverPort);
}));



io.on('connection', function(socket) {
    console.log('\x1b[36m%s\x1b[0m', '[Socket.io] User connected');
    socket.emit('connected');

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
        var query = Grocery.find({}, 'type');

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
        var query = Grocery.find({
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
        Grocery.deleteOne({
            name: product
        }, (err) => {
            console.log(err);
        });

        io.sockets.emit('grocery:refresh');
    });

    /* ---- MISCELLANOUS ---- */
    socket.on('debug', (type) => {
        var query = Grocery.find({}, 'name type');
        query.then(function(doc) {

        });
    });
});