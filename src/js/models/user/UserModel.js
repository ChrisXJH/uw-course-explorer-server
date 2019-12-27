import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  displayName: String,
  created: { type: Date, default: Date.now },
  oauth: [
    {
      provider: { type: String, index: true },
      id: { type: String, index: true }
    }
  ]
});

userSchema.set('toObject', {
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.created;
    delete ret.oauth;
    return ret;
  }
});

export default model('User', userSchema);
