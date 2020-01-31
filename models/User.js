const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  hkid: String,
  token: String,
  hash: String
});

userSchema.set('toJSON', {
  getters: false,
  transform: (doc, ret) => {
    delete ret.hkid;
    delete ret.hash;
    delete ret.__v;
    delete ret._id;
    return ret;
  },
})

mongoose.model('users', userSchema);