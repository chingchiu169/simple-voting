const mongoose = require('mongoose');
const { Schema } = mongoose;

const voteSchema = new Schema({
  hkid: String,
  campaign: String,
  for: String,
  time: { type: Date, default: new Date() }
});

voteSchema.set('toJSON', {
  getters: false,
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret.hkid;
    return ret;
  },
})

mongoose.model('votes', voteSchema);