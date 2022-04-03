import { propagate } from "satellite.js";

// Propagate an array of satrecs with provided time
const createPropagatedArray = (satrecs, now) => {
    const results = [];

    satrecs.forEach((record) => {
      if (record) { 
        const propagated = propagate(
          record,
          now.getUTCFullYear(),
          now.getUTCMonth() + 1, // month has to be in range from 1 to 12
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        );

        if (propagated.position && propagated.velocity) {
          results.push(propagated);
        }
      }
    });

    return results;
};

export default createPropagatedArray;
