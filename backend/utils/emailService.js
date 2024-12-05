import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Cấu hình handlebars
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("./backend/views/"), // Thư mục chứa các template phụ
      defaultLayout: false,
    },
    viewPath: path.resolve("./backend/views/"), // Đường dẫn tới thư mục chứa template
    extName: ".hbs", // Đuôi mở rộng của file template
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `"Your Store" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    template: options.template, // Tên file template
    context: options.context, // Dữ liệu truyền vào template
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
