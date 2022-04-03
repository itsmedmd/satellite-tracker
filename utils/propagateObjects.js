import createPropagatedArray from "./createPropagatedArray";
import { twoline2satrec } from "satellite.js";

// calculate position and velocity of each object from TLE data
const propagateObjects = (data, now) => {
    const satrecs = [];

    // transform TLE data to satrec data
    let j = 0;
    for (let i=0; i < data.length; i++) {
      const tle1 = data[j];
      const tle2 = data[j + 1];
      if (typeof tle1 == 'string' && typeof tle2 == 'string') {
        satrecs.push(twoline2satrec(tle1, tle2));
      }
      j = j + 2;
    }

    // Propagate objects
    const results = createPropagatedArray(satrecs, now);
    return { results, satrecs };
};

export default propagateObjects;
