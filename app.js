var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');

// MongoDB initialization and connection
mongoose.Promise = Promise;

var options = {
    useMongoClient: true
};

var urlmongo = "mongodb://127.0.0.1:27017/ikka_master";

mongoose.connect(urlmongo, options);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error during connection'));
db.once('open', function() {
    console.log("Connected to database");
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
        query.where('type', 'vegetable');
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
            res.json({
                message: 'Grocery succesfully added'
            });
        });
    })





app.use(router);
var HOSTNAME = '192.168.1.33';
var PORT = 4242;
app.listen(PORT, HOSTNAME, function() {
    console.log("Server listening on http://" + HOSTNAME + ":" + PORT);
});