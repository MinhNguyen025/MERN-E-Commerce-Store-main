import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import sendEmail from "../utils/emailService.js"; // Import hàm gửi email
import User from "../models/userModel.js";
import mongoose from 'mongoose';

// Utility Function
function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice + 
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Tìm các sản phẩm từ database
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x.product) },
    });

    // Kiểm tra xem tất cả các sản phẩm có tồn tại không
    if (itemsFromDB.length !== orderItems.length) {
      res.status(400);
      throw new Error("Một số sản phẩm không tồn tại trong database.");
    }

    // Khớp thông tin sản phẩm giữa client và database
    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient.product}`);
      }

      return {
        name: matchingItemFromDB.name,
        qty: itemFromClient.qty,
        image: matchingItemFromDB.image,
        price: matchingItemFromDB.price,
        product: itemFromClient.product,
      };
    });

    // Tính toán giá trị đơn hàng
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems);

    // Lưu đơn hàng vào cơ sở dữ liệu
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("Đơn hàng được tạo:", createdOrder);

    // **Xác minh ID user trước khi cập nhật giỏ hàng**
    console.log("User ID from token:", req.user._id);

    // **Xóa giỏ hàng của user sau khi tạo đơn hàng**
    const currentUser = await User.findById(req.user._id);
    if (currentUser) {
      currentUser.cart = []; // Đặt giỏ hàng thành rỗng
      await currentUser.save(); // Lưu thay đổi
      console.log("Giỏ hàng đã được xóa cho user:", currentUser._id);
      console.log("Giỏ hàng sau khi lưu:", currentUser.cart); // Log giỏ hàng sau khi lưu
    }

    // Gửi email xác nhận đơn hàng
    const orderItemsForEmail = dbOrderItems.map((item) => ({
      name: item.name,
      qty: item.qty,
      price: item.price.toFixed(2),
      total: (item.qty * item.price).toFixed(2),
    }));

    const emailData = {
      username: req.user.username,
      orderId: createdOrder._id,
      orderDate: new Date().toLocaleDateString(),
      shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        country: shippingAddress.country,
      },
      orderItems: orderItemsForEmail,
      subtotal: itemsPrice,
      tax: taxPrice,
      shipping: shippingPrice,
      total: totalPrice,
    };

    try {
      await sendEmail({
        to: req.user.email,
        subject: "Confirmation of Your Order",
        template: "emails/orderConfirmation",
        context: emailData,
      });
      console.log("Email sent successfully.");
    } catch (emailError) {
      console.error("Error sending email:", emailError);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", startDate, endDate } = req.query;

    const match = {};

    // Tìm kiếm theo Order ID
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        // Tìm kiếm chính xác nếu Order ID hợp lệ
        match._id = new mongoose.Types.ObjectId(search);
      } else {
        // Tìm kiếm phần mềm nếu Order ID chưa đầy đủ
        match.$expr = {
          $regexMatch: {
            input: { $toString: '$_id' },
            regex: `^${search}`,
            options: 'i' // Không phân biệt hoa thường
          }
        };
      }
    }

    // Lọc theo khoảng ngày nếu có
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) {
        const start = new Date(startDate);
        match.createdAt.$gte = start;
      }
      if (endDate) {
        const end = new Date(endDate);
        // Đặt thời gian cuối ngày để bao gồm cả ngày endDate
        end.setHours(23, 59, 59, 999);
        match.createdAt.$lte = end;
      }
    }

    // Xây dựng pipeline cho aggregation
    const pipeline = [];

    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'users', // Tên collection của User
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: "$user" }, // Giải nén mảng user
      { $sort: { createdAt: -1 } }, // Sắp xếp theo ngày tạo giảm dần
      { $skip: (page - 1) * limit }, // Bỏ qua các trang trước
      { $limit: parseInt(limit) } // Giới hạn số đơn hàng mỗi trang
    );

    const orders = await Order.aggregate(pipeline);

    // Đếm tổng số đơn hàng phù hợp
    const total = await Order.countDocuments(match);

    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    console.log("User ID from token:", req.user._id);

    const orders = await Order.find({ user: req.user._id });
    if (!orders || orders.length === 0) {
      res.status(404);
      throw new Error("No orders found for this user");
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updateOrder = await order.save();
      res.status(200).json(updateOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
