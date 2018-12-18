const express = require('express')
const mongoose = require('mongoose')
const io = require('./../app.js');
const config = require('./../config/resources.js')
const Product = require('./../models/product.model.js')

module.exports = (() => {
  const router = express.Router()

  router.route('/products')
    .get((req, res) => {
      Product.find({}, (err, products) => {
        if (err)
          res.send(err);
        res.json({
          message: products
        })
      })
    })
    .post((req, res) => {
      var pr = new Product();
      pr.name = req.body.name;
      pr.id = req.body.id;
      pr.type = req.body.type;
      pr.save((err) => {
        if (err)
          res.send(err);

        io.sockets.emit('product:refresh');

        res.status(201).json({
          message: 'Product successfully added',
          product: pr
        });

      });
    })

  return router
})()