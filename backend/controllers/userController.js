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
  const { search = "", page = 1, limit = 5 } = req.query;

  const query = {
    $or: [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ],
  };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .limit(Number(limit))
    .skip(skip);

  const pages = Math.ceil(total / Number(limit));

  res.json({
    users,
    pages,
    currentPage: Number(page),
  });
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


const updateUserCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Kiểm tra quyền truy cập
  if (!req.user || req.user._id.toString() !== userId.toString()) {
    res.status(403);
    throw new Error("Forbidden: You cannot update this user's cart");
  }

  const { cartItems } = req.body;

  console.log("Received cartItems:", cartItems); // Log nhận được

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Kiểm tra sự tồn tại của từng sản phẩm trong giỏ hàng
  for (let item of cartItems) {
    const productExists = await Product.findById(item.product);
    if (!productExists) {
      res.status(404);
      throw new Error(`Product with ID ${item.product} not found`);
    }
  }

  // Hợp nhất các mục giỏ hàng trùng lặp bằng cách tăng số lượng
  const mergedCartItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(cartItem => cartItem.product.toString() === item.product.toString());
    if (existingItem) {
      existingItem.qty += item.qty;
    } else {
      acc.push({ product: item.product, qty: item.qty });
    }
    return acc;
  }, []);

  console.log("Merged cartItems:", mergedCartItems); // Log hợp nhất

  // Cập nhật giỏ hàng vào cơ sở dữ liệu
  user.cart = mergedCartItems;

  // Lưu người dùng và sau đó populate giỏ hàng
  const savedUser = await user.save();

  // Populate giỏ hàng
  await savedUser.populate('cart.product', 'name price image countInStock');

  console.log("Updated user cart:", savedUser.cart); // Log cập nhật

  // Trả về giỏ hàng đã được populate đầy đủ thông tin
  res.json(savedUser.cart.map(item => ({
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
