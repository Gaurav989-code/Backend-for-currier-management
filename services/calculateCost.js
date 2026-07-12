// Base logistics speed/tier modifiers in India 
const DELIVERY_TYPE_CHARGES = {
  sameDay: 150,    // Premium hyperlocal/same-day air or surface
  overnight: 90,   // Standard Express Air (Next day between metros)
  standard: 45,    // Economical surface shipping (Base rate for 500g)
};

// Category weight/handling variations for National (Pan-India) shipping
const NATIONAL_CATEGORY_CHARGES = {
  documents: 0,         // Base weight under 50g (Standard flat rate)
  electronics: 80,      // Requires handling/insurance surcharges
  fragile: 120,         // Bubble wrap/special handling fee
  clothing: 15,         // Average 0.5kg apparel parcel volumetric modifier
  food: 50,             // Special secure packaging for perishables
  cosmetics: 30,        // Semi-fragile liquid/powder protection
  books: 10,            // Heavy dead-weight adjustment
  small_packages: 40,   // Packages between 0.5kg - 1kg
  large_packages: 180,  // Heavy or volumetric surface cargo (Over 2kg)
};

// Global cross-border priority cargo modifiers out of India
const INTERNATIONAL_CATEGORY_CHARGES = {
  documents: 1200,      // Flat global document rate (under 250g)
  electronics: 2800,    // High customs clearance, risk, and weight handling
  fragile: 1500,        // Rigid wood-crate formatting/international safety wrap
  clothing: 600,        // Boxed export configuration
  food: 900,            // International FDA/customs health certificate clearance
  cosmetics: 800,       // International chemical/liquid flight declarations
  books: 700,           // High international dead-weight logistics cost
  small_packages: 1600, // Standard 0.5kg - 1kg international parcel box
  large_packages: 3500, // Heavy global express air freight base modifier
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
