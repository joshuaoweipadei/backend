const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25,
    minlength: 2,
  },
  email: { 
    type: String,
    trim: true,
    unique: true,
    index: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true });

accountSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
      // remove these props when object is serialized 
      // delete ret._id;
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
  }
});

module.exports = mongoose.model('Account', accountSchema);