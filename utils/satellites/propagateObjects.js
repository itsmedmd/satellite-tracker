import { twoline2satrec } from "satellite.js";
const { createPropagatedArray } = require("./createPropagatedArray");

// calculate position and velocity of each object from TLE data
const propagateObjects = (seenSats, data, startDate, interpolationDegree, helperFunctions) => {
  const satrecs = [];
  const newSeen = [...seenSats];

  // transform TLE data to satrec data
  let j = 0;
  for (let i = 0; i < data.length; i++) {
    const name = data[j];
    const tle1 = data[j + 1];
    const tle2 = data[j + 2];

    if (typeof name === "string" && typeof tle1 === "string" && typeof tle2 === "string") {
      const record = twoline2satrec(tle1, tle2);

      if (!newSeen.includes(record.satnum)) {
        newSeen.push(record.satnum);
        satrecs.push({
          record,
          name
        });
      }
    }

    j = j + 3;
  }

  if (satrecs.length === 0) {
    return {
      newSeen,
      data: [],
    };
  }

  // Propagate positions for objects
  return {
    newSeen,
    data: createPropagatedArray(satrecs, startDate, interpolationDegree, helperFunctions)
  };
};

export default propagateObjects;
