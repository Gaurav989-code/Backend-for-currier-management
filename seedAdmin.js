import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME;

    let existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin user already exists.");
      return;
    }

    const admin = await new User({
      email,
      password,
      name,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully.");

    await mongoose.connection.close();
    process.exit(0); // Exit the process successfully
  } catch (error) {
    console.error("Error occurred while seeding admin user:", error);
    process.exit(1); // Exit the process with an error
  }
};

seedAdmin();
