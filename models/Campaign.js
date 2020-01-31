const mongoose = require('mongoose');
const { Schema } = mongoose;
const utils = require('../utils/utils');

const campaignSchema = new Schema({
  title: String,
  description: String,
  start: Date,
  end: Date,
  options: Array,
  time: Date,
});


campaignSchema.set('toJSON', {
  getters: false,
  transform: (doc, ret) => {
    ret.start = utils.yyyymmddreadable(ret.start);
    ret.end = utils.yyyymmddreadable(ret.end);
    delete ret.__v;
    // delete ret._id;
    return ret;
  },
})

mongoose.model('campaigns', campaignSchema);