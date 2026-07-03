import { Parcel } from "../models/parcelSchema.js";
import { calculateCost } from "../services/calculateCost.js";
import { generateTrackingId } from "../services/generateTrackingId.js";
import {
  createParcelSchema,
  addCheckPointSchema,
  calculateCostSchema,
} from "../validations/validations.js";

// Create a new parcel

export const createParcel = async (req, res, next) => {
  try {
    const { error, value } = createParcelSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const priceInfo = calculateCost({
      originCity: value.originCity,
      destinationCity: value.destinationCity,
      shipmentType: value.shipmentType,
      parcelCategory: value.parcelCategory,
      weight: value.weight,
      deliveryType: value.deliveryType,
    });

    let trackingId = generateTrackingId();

    if (!trackingId) {
      return res
        .status(400)
        .json({ message: "Failed to generate tracking ID" });
    }

    const newParcel = await Parcel.create({
      ...value,
      trackingId,
      price: priceInfo.price,
      checkPoints: [
        {
          location: value.originCity,
          status: "Parcel arrived",
          title: `Parcel arrived at ${value.originCity} branch`,
          description: `Parcel has arrived at ${value.originCity} branch and is ready for processing.`,
          updatedBy: req.user ? req.user.name : "System",
        },
      ],
    });

    res.status(201).json(newParcel);
  } catch (error) {
    res.status(400).json({ message: error.message });
    next(error);
  }
};

export const getParcelByTrackingId = async (req, res, next) => {
  try {
    const { trackingId } = req.params;
    const parcel = await Parcel.findOne({ trackingId });

    if (!parcel) {
      return res.status(404).json({
        message: "parcel not found ",
      });
    }

    res.status(200).json(parcel);
  } catch (error) {
    next(error);
  }
};

export const addCheckPoints = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = addCheckPointSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({
        message: "parcel not found ",
      });
    }

    const checkPoint = {
      ...value,
      updatedBy: req.user ? req.user.name : "System",
      timestamp: new Date(),
    };

    parcel.checkpoints.push(checkPoint);
    parcel.status = value.status;
    await parcel.save();

    res.status(201).json(parcel);
  } catch (error) {
    next(error);
  }
};

export const getAllParcels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const matchStage = {};

    if (status) {
      matchStage["lastCheckpoint.status"] = status;
    }

    if (search) {
      matchStage.trackingId = { $regex: search, $options: "i" };
    }

    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: { $arrayElemAt: ["$checkpoints", -1] },
          },
        },
        {
          $match: matchStage,
        },
        {
          $count: "total",
        },
      ]),
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;

    res.status(200).json({
      data: parcels,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const calculateCostCalculator = async (req, res, next) => {
  try {
    const { error, value } = calculateCostSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const priceInfo = calculateCost(value);

    res.status(200).json(priceInfo);
  } catch (error) {
    next(error);
  }
};
