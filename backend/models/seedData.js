import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

import Category from "./categoryModel.js";

dotenv.config(); 

// Kết nối tới MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

const createCategories = async () => {
  try {
    console.log("Clearing old categories...");
    await Category.deleteMany();
    console.log("Old categories cleared.");

    console.log("Creating Categories...");
    const categoryNames = new Set();
    const predefinedCategories = [
      "Clothing",
      "Movies",
      "Industrial",
      "Tools",
      "Beauty",
      "Games",
      "Jewelry",
      "Home",
      "Garden",
      "Books",
      "Music",
      "Automotive",
      "Outdoors",
      "Shoes",
      "Kids",
      "Baby",
      "Toys",
      "Sports",
      "Grocery",
      "Computers",
      "Electronics",
      "Health",
      "Office",
      "Pets",
      "Art",
    ];

    while (categoryNames.size < 500) {
      const baseCategory = predefinedCategories[
        faker.number.int({ min: 0, max: predefinedCategories.length - 1 })
      ];
      const uniqueCategory = `${baseCategory}_${faker.string.uuid().slice(0, 5)}`;
      categoryNames.add(uniqueCategory);
    }

    console.log(`Generated ${categoryNames.size} unique categories.`);
    console.log("Inserting categories into database...");

    const categories = Array.from(categoryNames).map((name) => ({ name }));
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} Categories created.`);
  } catch (err) {
    console.error("Error creating Categories:", err);
    process.exit(1);
  }
};


// Chạy script
const runSeeder = async () => {
  await connectDB();
  await createCategories(); // Chỉ tạo Categories
  console.log("Seeding complete!");
  process.exit();
};

runSeeder();
