const async = require('async');
const Woof = require('../models/woof');
const User = require('../models/user');

module.exports = function (io) {

  io.on('connection', function (socket) {
    console.log("Connected");
    let user = socket.request.user;
    console.log(user.name);


    socket.on('woof', (data) => {
      console.log(data);
      async.parallel([
        function (callback) {
          io.emit('incomingWoof', { data, user });
        },

        function (callback) {
          async.waterfall([
            function (callback) {
              let woof = new Woof();
              woof.content = data.content;
              woof.owner = user._id;
              woof.save(function (err) {
                callback(err, woof);
              })

            },

            function (woof, callback) {
              User.update(
                {
                  _id: user._id
                },
                {
                  $push: { woofs: { woof: woof._id } },

                }, function (err, count) {
                  callback(err, count);// end of the code
                }
              );
            }
          ]);
        }
      ]);
    });
  });
}
