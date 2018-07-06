const router = require('express').Router();
const async = require('async');
const User = require('../models/user');
const Woof = require('../models/woof');

router.get('/', (req, res, next) => {
  if (req.user) {
    Woof.find({})
      .sort('-created')
      .populate('owner')
      .exec(function (err, woofs) {
        if (err) {
          console.log(woofs);
          return next(err);
        }
        res.render('main/home', { woofs: woofs });
      });
  } else {
    res.render('./main/landing');
  }
});

router.get('/user/:id', (req, res, next) => {
  async.waterfall([
    function (callback) {
      Woof.find({ owner: req.params.id })
        .populate('owner')
        .exec(function (err, woofs) {
          callback(err, woofs);
        });
    },

    function (woofs, callback) {
      User.findOne({ _id: req.params.id })
        .populate('following')
        .populate('followers')
        .exec(function (err, user) {
          let follower = user.followers.some(function (friend) {
            return friend.equals(req.user._id);
          });
          let currentUser;
          if (req.user._id.equals(user._id)) {
            currentUser = true;
          } else {
            currentUser = false;
          }
          res.render('main/user', { foundUser: user, woofs: woofs, currentUser: currentUser, follower: follower });
        });
    }
  ]);
});

router.post('/follow/:id', (req, res, next) => [
  async.parallel([
    function (callback) {
      User.update(
        {
          _id: req.user._id,
          following: { $ne: req.params.id }
        },
        {
          $push: { following: req.params.id }
        },
        function (err, count) {
          callback(err, count);
        }
      )
    },
    function (callback) {
      User.update(
        {
          _id: req.params.id,
          followers: { $ne: req.user._id }
        },
        {
          $push: { followers: req.user._id }
        },
        function (err, count) {
          callback(err, count);
        }
      )
    }
  ], function (err, results) {
    if (err) {
      return next(err);
    }
    res.json("Success");
  })
]);

router.post('/unfollow/:id', (req, res, next) => [
  async.parallel([
    function (callback) {
      User.update(
        {
          _id: req.user._id
        },
        {
          $pull: { following: req.params.id }
        },
        function (err, count) {
          callback(err, count);
        }
      )
    },
    function (callback) {
      User.update(
        {
          _id: req.params.id
        },
        {
          $pull: { followers: req.user._id }
        },
        function (err, count) {
          callback(err, count);
        }
      )
    }
  ], function (err, results) {
    if (err) {
      return next(err);
    }
    res.json("Success");
  })
]);

module.exports = router;