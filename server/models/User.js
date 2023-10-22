import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: Buffer,
});

export const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  address: String,
  pic: Buffer,
  content: String,
  role: {
    type: String,
    default: 'visitor',
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Reference to products
});

export const UserModel = mongoose.model('User', UserSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
