import joi from "joi";

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const addUserSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const createParcelSchema = joi.object({
  senderName: joi.string().min(3).max(100).required(),
  senderPhone: joi.string().min(10).max(15).required(),
  senderAddress: joi.string().min(10).max(200).required(),
  receiverName: joi.string().min(3).max(100).required(),
  receiverPhone: joi.string().min(10).max(15).required(),
  receiverAddress: joi.string().min(10).max(200).required(),
  shipmentType: joi.string().valid("national", "international").required(),
  originCity: joi.string().min(2).max(100).required(),
  destinationCity: joi.string().min(2).max(100).required(),
  deliveryType: joi
    .string()
    .valid("sameDay", "overnight", "standard")
    .required(),
  parcelCategory: joi
    .string()
    .valid(
      "documents",
      "fragile",
      "food",
      "cosmetics",
      "books",
      "electronics",
      "clothing",
      "small_packages",
      "large_packages",
    )
    .required(),
  weight: joi.number().positive().required(),
});

export const addCheckPointSchema = joi.object({
  location: joi.string().min(10).max(200).required(),
  title: joi.string().min(3).max(200).required(),
  description: joi.string().allow("", null),
  status: joi
    .string()
    .valid("arrived", "in_transit", "out_for_delivery", "delivered")
    .required(),
});

export const calculateCostSchema = joi.object({
  originCity: joi.string().min(2).max(100).required(),
  destinationCity: joi.string().min(2).max(100).required(),
  shipmentType: joi.string().valid("national", "international").required(),
  parcelCategory: joi
    .string()
    .valid(
      "documents",
      "fragile",
      "medicine",
      "food",
      "cosmetics",
      "books",
      "electronics",
      "clothing",
      "small_packages",
      "large_packages",
    )
    .required(),
  weight: joi.number().positive().required(),
  deliveryType: joi
    .string()
    .valid("sameDay", "overnight", "standard")
    .required(),
});
