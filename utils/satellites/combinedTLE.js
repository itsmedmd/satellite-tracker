import { Color as CesiumColor } from "@/cesiumSource/Cesium";

import communicationsTLE from "@/data/communications";
import debrisTLE from "@/data/debris";
import miscellaneousTLE from "@/data/miscellaneous";
import navigationTLE from "@/data/navigation";
import scientificTLE from "@/data/scientific";
import specialInterestTLE from "@/data/special-interest";
import starlinkTLE from "@/data/starlink";
import weatherEarthTLE from "@/data/weather-earth";
import fullCatalogTLE from "@/data/full-catalog";

// https://cesium.com/learn/cesiumjs/ref-doc/Color.html
const debrisColor = CesiumColor.FLORALWHITE.withAlpha(0.6);
const starlinkColor = CesiumColor.GOLD.withAlpha(0.85);
const communicationsColor = CesiumColor.MEDIUMSPRINGGREEN;
const weatherEarthColor = CesiumColor.SALMON;
const specialInterestColor = CesiumColor.RED;
const scientificColor = CesiumColor.INDIANRED;
const miscellaneousColor = CesiumColor.LIME;
const navigationColor = CesiumColor.HOTPINK;
const otherColor = CesiumColor.DODGERBLUE;

const debris = {
  name: "Debris",
  color: debrisColor,
  data: [...debrisTLE]
};

const specialInterest = {
  name: "Special interest",
  color: specialInterestColor,
  data: [...specialInterestTLE]
};

const weatherEarth = {
  name: "Weather and Earth resources",
  color: weatherEarthColor,
  data: [...weatherEarthTLE]
};

const communications = {
  name: "Communications",
  color: communicationsColor,
  data: [...communicationsTLE]
};

const starlink = {
  name: "Starlink",
  color: starlinkColor,
  data: [...starlinkTLE]
};

const navigation = {
  name: "Navigation",
  color: navigationColor,
  data: [...navigationTLE]
};

const scientific = {
  name: "Scientific",
  color: scientificColor,
  data: [...scientificTLE]
};

const miscellaneous = {
  name: "Miscellaneous",
  color: miscellaneousColor,
  data: [...miscellaneousTLE]
};

const fullCatalogData = {
  name: "Other",
  color: otherColor,
  data: [...fullCatalogTLE]
};

const combinedTLE = [
  specialInterest,
  scientific,
  navigation,
  weatherEarth,
  starlink,
  miscellaneous,
  communications,
  debris,
  fullCatalogData,
];

export default combinedTLE;
