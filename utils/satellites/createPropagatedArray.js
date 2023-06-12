const { propagate } = require("satellite.js");

const EARTH_RADIUS_KM = 6371;
const GRATIVATIONAL_EARTH_PARAMETER = 3.986004418 * Math.pow(10, 14);

// Get orbital period in minutes
const orbitalPeriod = (position, velocity) => {
  const { x, y, z} = position;
  const { x: vx, y: vy, z: vz} = velocity;

  const positionVectorMagnitude = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
  const velocityVectorMagnitude = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2) + Math.pow(vz, 2));

  const semiMajorAxis =
    positionVectorMagnitude / (1 - Math.pow(velocityVectorMagnitude, 2) * EARTH_RADIUS_KM / GRATIVATIONAL_EARTH_PARAMETER);
  
  const orbitalPeriod = 2 * Math.PI * Math.pow(semiMajorAxis * 1000, 1.5) / Math.sqrt(GRATIVATIONAL_EARTH_PARAMETER);
  
  return orbitalPeriod / 60;
};

// Calculate how many points an object should have in its orbit
// and how much time should be between different points
const getPointsCountForOrbit = (orbitDuration, interpolationDegree) => {
  // min amount of points is interpolationDegree + 1 but add extra 5
  // because it helps to increase the precision
  const min = interpolationDegree + 1 + 5;

  // Some objects have very complex orbits so they need a lot of points
  // but in order to minimise the amount of data points needed for those
  // situations this would need way more complex orbit calculations.
  // That is why some objects with very complex orbits may have a lot of
  // incorrections in their orbits with the current approach but it is enough
  // as there is no need to have exact orbits down to details and a rough
  // approximation is enough.
  const max = 50;

  const defaultTime = 15; // minutes
  const increaseStep = 200; // minutes
  const increaseTime = 5; // minutes

  // Every 'increaseStep' minutes, increase 'minuteDistance' by 'increaseTime'
  // in order to make long orbits with gradually less points
  const increasedDistance = Math.round(orbitDuration / increaseStep) * increaseTime;
  const minuteDistance = defaultTime + increasedDistance;
  const pointsCount = Math.round(orbitDuration / minuteDistance);

  if (pointsCount > max) {
    return max;
  }

  if (pointsCount < min) {
    return min;
  }

  return pointsCount;
};

// Calculate object position and velocity
const propagateObject = (record, time) => {
  return propagate(
    record,
    time.getUTCFullYear(),
    time.getUTCMonth() + 1, // month has to be in range from 1 to 12
    time.getUTCDate(),
    time.getUTCHours(),
    time.getUTCMinutes(),
    time.getUTCSeconds()
  );
};

// Some objects have bad data so check the validity of it
const isPropagatedObjectValid = (object) => {
  const positionValid = object.position && !Object.values(object.position).some((val) => isNaN(val));
  const velocityValid = object.velocity && !Object.values(object.velocity).some((val) => isNaN(val));
  return positionValid && velocityValid;
};

const getFormattedCoordinates = (position) => {
  const km = 1000; // need to multiply each coordinate by 1000 to get meters
  const precision = 5;

  return {
    x: Number((position.x * km).toFixed(precision)),
    y: Number((position.y * km).toFixed(precision)),
    z: Number((position.z * km).toFixed(precision)),
  };
};

// Convert JulianDate number to JS date
const julianToDate = (julianDate) => {
  const unixTime = (julianDate - 2440587.5) * 86400;
  return new Date(unixTime * 1000);
};

// Propagate an array of satrecs with provided time
const createPropagatedArray = (satrecs, startDate, interpolationDegree, helperFunctions) => {
  const { SampledPositionProperty, JulianDate, Cartesian3 } = helperFunctions;
  const results = [];
  const time = new Date(startDate); // create date copy to not modify the original date
  const startTime = time.getTime();
  const objPositions = null;
  let orbitDuration = 0;

  satrecs.forEach(({ record, name }) => {
    objPositions = null;
    time.setTime(startTime);
    let propagated = propagateObject(record, time);

    // Sometimes propagated data is invalid, so check for validity before continuing
    if (isPropagatedObjectValid(propagated)) {
      let periodMinutes = orbitalPeriod(propagated.position, propagated.velocity);

      if (!isNaN(periodMinutes)) {
        orbitDuration = periodMinutes.toFixed(1); // We don't need exact precision
        const pointsCount = getPointsCountForOrbit(orbitDuration, interpolationDegree);
        const times = [];
        const positions = [];

        // first point
        times.push(JulianDate.fromDate(time));
        let coords = getFormattedCoordinates(propagated.position);
        positions.push(new Cartesian3(coords.x, coords.y, coords.z));

        // calculate all required following points after the first one
        let errors = false;
        let periodsSum = 0;
        const minutesBetweenPoints = orbitDuration / (pointsCount - 1);

        for (let i = 1; i < pointsCount; i++) {
          time.setTime(startTime + (i * minutesBetweenPoints * 60 * 1000));

          // if it's the last point, set it the same as the
          // first position in order to make a smooth orbit
          if ((i + 1) === pointsCount) {
            times.push(JulianDate.fromDate(time));
            positions.push(positions[0]);
            break;
          }

          propagated = propagateObject(record, time);

          // Sometimes propagated data is invalid, so check for validity before continuing.
          // If at least 1 point data for an object is invalid, do not use that object at all.
          if (isPropagatedObjectValid(propagated)) {
            times.push(JulianDate.fromDate(time));
            coords = getFormattedCoordinates(propagated.position);
            positions.push(new Cartesian3(coords.x, coords.y, coords.z));

            periodMinutes = orbitalPeriod(propagated.position, propagated.velocity);
            periodsSum += i === 1 ? periodMinutes * 2 : periodMinutes;
          } else {
            errors = true;
            break;
          }
        }

        // Filter out objects with errors and objects that have very different orbital
        // period calculations from different points (that means that data is bad)
        const averagePeriod = periodsSum > 0 ? periodsSum / (pointsCount - 1) : 0; // minutes
        const orbitError = periodMinutes - averagePeriod; // minutes
        let allowedOrbitError = 0;
        const periodErrorStep = 10; // minutes

        // The longer the orbit, the bigger orbit calculation error we allow
        if (averagePeriod >= periodErrorStep) {
          // Add 1 minute of error for each step
          allowedOrbitError += Math.round(averagePeriod / periodErrorStep);
        }

        if (!errors && Math.abs(orbitError) < allowedOrbitError) {
          objPositions = new SampledPositionProperty();
          objPositions.addSamples(times, positions);
        }
      }
    }

    if (objPositions) {
      results.push({
        position: objPositions,
        orbitDuration,
        name,
        epochDate: julianToDate(record.jdsatepoch),
        satnum: record.satnum
      });
    }
  });

  return results;
};

// Export as CommonJS to enable testing
module.exports = {
  orbitalPeriod,
  getPointsCountForOrbit,
  isPropagatedObjectValid,
  getFormattedCoordinates,
  julianToDate,
  createPropagatedArray,
};
