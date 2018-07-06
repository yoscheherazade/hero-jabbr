const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WoofSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: String,
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Woof', WoofSchema);