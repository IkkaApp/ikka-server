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
                email: decoded.email,
                token: req.cookies.token
              })
            } else { // User no longer exists
              res.clearCookie('token')
              res.status(401).send({
                error: 'USER_NO_LONGER_EXISTS'
              })
            }
          })

      } else { // Token expired or no token
        res.clearCookie('token')
        res.status(401).send({
          error: 'TOKEN_EXPIRED'
        })
      }
    })
  })


  router.route('/signup')
    .post((req, res) => {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log(err);
          return res.json({
            message: err,
            error: 'INTERNAL_SERVER_ERROR'
          })
        } else {
          User.findOne({
              email: req.body.email
            })
            .exec()
            .then((user) => {
              if (user) { // User already exists
                res.status(409).json({
                  error: 'USER_ALREADY_EXISTS'
                })
              } else { // User doesn't exists for now
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
                      expiresIn: '1d'
                    })
                  res.cookie('token', JWTToken, {
                    expiresIn: 90000,
                    httpOnly: true
                  })
                  res.status(201).json({
                    success: 'New user has been created',
                    token: JWTToken
                  })
                }).catch((error) => {
                  console.log(error)
                  res.status(500).json({
                    error: 'INTERNAL_SERVER_ERROR'
                  })
                })
              }
            })
            .catch(err => {
              console.log(err)
              res.status(500).json({
                error: 'INTERNAL_SERVER_ERROR'
              })
            })
        }
      })
    })

  router.post('/login', function(req, res) {
    User.findOne({
        email: req.body.email
      })
      .exec()
      .then((user) => {
        if (user) { // User exists
          bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (err) { // If password don't match
              return res.status(401).json({
                error: 'WRONG_PASSWORD'
              });
            }
            if (result) {
              const JWTToken = jwt.sign({
                  email: user.email,
                  _id: user._id
                },
                config.secret, {
                  expiresIn: '1d'
                })
              res.clearCookie('token')
              res.cookie('token', JWTToken, {
                expiresIn: 90000,
                httpOnly: true
              })
              res.status(200).json({
                message: 'Login successful',
                token: JWTToken
              })
            } else {
              res.status(401).json({
                error: 'WRONG_PASSWORD'
              });
            }
          });
        } else { // User doesn't exists
          res.status(401).json({
            error: 'USER_NOT_FOUND'
          })
        }
      })

  })

  router.route('/logout')
    .post((req, res) => {
      res.clearCookie('token')
      res.status(204).send({
        message: 'Logout successful'
      })
    })

  return router
})()