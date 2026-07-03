const DELIVERY_TYPE_CHARGES = {
  sameDay: 200,
  overnight: 100,
  standard: 0,
};

const NATIONAL_CATEGORY_CHARGES = {
  document: -100,
  electronics: 150,
  fragile: 250,
  clothing: 0,
  food: 120,
  medicine: 150,
  cosmetics: 100,
  books: -20,
  small_package: 100,
  large_package: 250,
};

const INTERNATIONAL_CATEGORY_CHARGES = {
  document: 400,
  electronics: 3000,
  fragile: 500,
  clothing: 150,
  food: 250,
  medicine: 300,
  cosmetics: 200,
  books: 80,
  small_package: 250,
  large_package: 550,
};

export const calculateCost = ({
  originCity,
  destinationCity,
  shipmentType,
  parcelCategory,
  weight,
  deliveryType,
}) => {
  
  const isSameCity = originCity.trim().toLowerCase() === destinationCity.trim().toLowerCase();

  const deliveryTypeCharge = DELIVERY_TYPE_CHARGES[deliveryType] || 0;

  //national shipment cost calculation

  if (shipmentType === "national") {
    const categoryCharges = NATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;

    if (isSameCity) {
      const baseCost = 100; // Base cost for same city shipment

      const weightPrice = weight * 300;

      const price =
        baseCost + weightPrice + categoryCharges + deliveryTypeCharge;

      return {
        type: "national",
        parcelCategory,
        price,
      };
    }

    //out of city

    const baseCost = 200; // Base cost for same city shipment

    const weightPrice = weight * 300;

    const price = baseCost + weightPrice + categoryCharges + deliveryTypeCharge;

    return {
      type: "national",
      parcelCategory,
      price,
    };
  }

  if (shipmentType === "international") {
    const categoryCharges = INTERNATIONAL_CATEGORY_CHARGES[parcelCategory] || 0;

    if (weight <= 0) {
      throw new Error("weight must be greater than 0 ");
    }
    let price;

    if (weight <= 0.5) {
      price = 5000;
    } else if (weight <= 1) {
      price = 11000;
    } else {
      const extraKg = Math.ceil(weight - 1);
      price = 11000 + extraKg * 5000;
    }

    price += categoryCharges;

    return {
      type: "international",
      parcelCategory,
      price,
    };
  }

  throw new Error("Invalid shipment configuration ");
};
