import jwt from "jsonwebtoken";

const createToken  = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Chỉ sử dụng secure trong production
    sameSite: "lax", // Sử dụng 'lax' để đảm bảo cookie được gửi trong một số trường hợp
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default createToken;
