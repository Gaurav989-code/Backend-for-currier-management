import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";
import { addUserSchema, loginSchema } from "../validations/validations.js";

// Generate JWT

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


// Register a new user

export const addUser = async (req, res, next) => {
  try {
    const { error, value } = addUserSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password } = value;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// Login user and get token

export const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await existingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(existingUser._id);

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        token,
        user: {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
        },
      });
  } catch (error) {
    console.error(error);

    next(error);

    res.status(500).json({ message: "Internal server error" });
  }
};
