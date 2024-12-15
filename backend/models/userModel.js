import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin:  { type: Boolean, required: true, default: false },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      qty:     { type: Number, required: true, default: 1 },
    }
  ],
}, { timestamps: true,
     versionKey: false,
 });

export default mongoose.model('User', userSchema);
