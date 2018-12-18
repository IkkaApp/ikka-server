const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const config = require('./../config/resources.js')
const User = require('./../models/user.model.js')

module.exports = (() => {
  const router = express.Router()

  router.post('/login/start', function(req, res) {
    jwt.verify(req.cookies.token, config.secret, (err, decoded) => {
      if (decoded) {
        User.findOne({
            email: decoded.email
          })
          .exec()
          .then((user) => {
            if (user) { // User exists
              res.status(200).json({
                email: decoded.email
              })
            } else {
              res.clearCookie('token')
              res.status(401).send({
                error: 'UserNoLongerExists'
              }) // User no longer exists
            }
          })

      } else {
        res.clearCookie('token')
        res.status(401).send({
          error: 'TokenExpired'
        }) // Token expired or no token
      }
    })
  })


  router.route('/signup')
    .post((req, res) => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.json({
            error: err
          })
        } else {
          User.findOne({
              email: req.body.email
            })
            .exec()
            .then((user) => {
              if (user) { // User already exists
                res.status(409).json({
                  success: 'User already exists'
                })
              } else {
                const user = new User({
                  _id: new mongoose.Types.ObjectId(),
                  email: req.body.email,
                  password: hash,
                  creationDate: Date.now()
                  // TODO: Add isAdmin field
                }) // Create and save new user
                user.save().then((result) => {
                  const JWTToken = jwt.sign({
                      email: user.email,
                      _id: user._id
                    },
                    config.secret, {
                      expiresIn: '10s'
                    })
                  // res.clearCookie('token')
                  res.cookie('token', JWTToken, {
                    expiresIn: 90000,
                    httpOnly: true
                  })
                  res.status(201).json({
                    success: 'New user has been created with JWT token',
                    token: JWTToken
                  })
                }).catch((error) => {
                  console.log(error)
                  res.status(500).json({
                    error: err
                  })
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    })


  router.route('/logout')
    .post((req, res) => {
      res.clearCookie('token')
      res.status(200).send({
        message: 'Logout successful'
      })
    })

  return router
})()