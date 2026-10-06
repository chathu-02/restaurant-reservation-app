import { ImageSourcePropType } from "react-native";

export const LOGO: ImageSourcePropType = require("../../assets/images/logo.png");

export const BRAND = {
  name: "Ocean Grace",
  tagline: "Restaurant & Grill",
  hours: "Daily 11:00 AM – 10:00 PM",
  address: "Initium Rd, Dehiwala 10350",
  phone: "+94 11 2514325",
};

// Photo shown on the Home screen below the buttons
export const RESTAURANT_PHOTO: ImageSourcePropType | null = require("../../assets/images/restaurant.jpg");

// Photo behind the green banner. Keep null for a plain green banner.
export const HERO_IMAGE: ImageSourcePropType | null = null;