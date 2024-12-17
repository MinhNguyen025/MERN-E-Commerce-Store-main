import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the inputs.");
  }

  const userExists = await User.findOne({ email });
  if (userExists) res.status(400).send("User already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// File: controllers/userController.js

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt with email:", email);

  // Validate that both email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide both email and password.");
  }

  // Find the user by email
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    // If user does not exist, send a 401 Unauthorized response
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  // Compare the provided password with the hashed password in the database
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    // If password is invalid, send a 401 Unauthorized response
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  // If authentication is successful, create a JWT token
  createToken(res, existingUser._id);

  // Send a 200 OK response with user details
  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
  });
});


const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// Lấy giỏ hàng của user
const getUserCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!req.user || req.user._id.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("Forbidden: You cannot access this user's cart");
  }

  const user = await User.findById(userId).populate('cart.product', 'name price image countInStock');

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user.cart.map(item => ({
    _id: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    qty: item.qty,
    countInStock: item.product.countInStock
  })));
});

// File: controllers/userController.js

const updateUserCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!req.user || req.user._id.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("Forbidden: You cannot update this user's cart");
  }

  const { cartItems } = req.body;

  console.log("Received cartItems:", cartItems); // Thêm log

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Kiểm tra từng sản phẩm trong cartItems để đảm bảo sản phẩm tồn tại
  for (let item of cartItems) {
    const productExists = await Product.findById(item.product);
    if (!productExists) {
      res.status(404);
      throw new Error(`Product with ID ${item.product} not found`);
    }
  }

  // Chuẩn bị dữ liệu để cập nhật
  const updatedCart = cartItems.map(item => ({
    product: item.product,
    qty: item.qty,
  }));

  console.log("Updating cart with:", updatedCart); // Thêm log

  // Sử dụng findByIdAndUpdate để cập nhật giỏ hàng một cách nguyên tử
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { cart: updatedCart },
    { new: true } // Trả về tài liệu mới sau khi cập nhật
  ).populate('cart.product', 'name price image countInStock');

  if (!updatedUser) {
    res.status(404);
    throw new Error("User not found after update");
  }

  console.log("Updated user cart:", updatedUser.cart); // Thêm log

  // Trả về giỏ hàng đã được populate đầy đủ thông tin
  res.json(updatedUser.cart.map(item => ({
    _id: item.product._id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    qty: item.qty,
    countInStock: item.product.countInStock
  })));
});


export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  updateUserCart,
  getUserCart,
};
