const assert = require("assert");

// Utils
const getUTCDate = require("../utils/shared/getUTCDate");

// Satellites
const {
  orbitalPeriod,
  getPointsCountForOrbit,
  isPropagatedObjectValid,
  getFormattedCoordinates,
  julianToDate,
} = require("../utils/satellites/createPropagatedArray");

describe("Utils", function () {
  describe("getUTCDate()", function () {
    it("should return an empty string for no date", function () {
      assert.equal(getUTCDate(), "");
    });

    it("should return an empty string for not Date type", function () {
      assert.equal(getUTCDate("test"), "");
    });

    it("should return UTC date from JS Date", function () {
      assert.equal(getUTCDate(new Date(2021, 2, 3, 14, 20, 30)), "2021-03-03 12:20:30");
    });
  });
});

describe("Satellites", function () {
  describe("julianToDate()", function () {
    it("should convert Julian Date to JS Date", function () {
      assert.equal(julianToDate(2459303.5).toISOString(), "2021-03-30T00:00:00.000Z");
    });
  });

  describe("getFormattedCoordinates()", function () {
    it("should format coordinates", function () {
      assert.deepStrictEqual(getFormattedCoordinates({
        x: 1132.88491949,
        y: 88.88747811411,
        z: 187.3919997,
      }), {
        x: 1132884.91949,
        y: 88887.47811,
        z: 187391.9997,
      });
    });
  });

  describe("isPropagatedObjectValid()", function () {
    it("should return undefined when empty object is provided", function () {
      assert.equal(isPropagatedObjectValid({}), undefined);
    });

    it("should return undefined when missing velocity", function () {
      assert.equal(isPropagatedObjectValid({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
      }), undefined);
    });

    it("should return undefined when missing position", function () {
      assert.equal(isPropagatedObjectValid({
        velocity: {
          x: 1,
          y: 2,
          z: 3,
        },
      }), undefined);
    });

    it("should not be valid when one of position values is not a number", function () {
      assert.equal(isPropagatedObjectValid({
        position: {
          x: 1,
          y: "test",
          z: 3,
        },
        velocity: {
          x: 1,
          y: 2,
          z: 3,
        },
      }), false);
    });

    it("should not be valid when one of velocity values is not a number", function () {
      assert.equal(isPropagatedObjectValid({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
        velocity: {
          x: 1,
          y: 2,
          z: {},
        },
      }), false);
    });

    it("should be valid when all data is present", function () {
      assert.equal(isPropagatedObjectValid({
        position: {
          x: 1,
          y: 2,
          z: 3,
        },
        velocity: {
          x: 1,
          y: 2,
          z: 3,
        },
      }), true);
    });
  });

  describe("getPointsCountForOrbit()", function () {
    const interpolationDegree = 7;

    it("should return 13 with interp degree 7 and orbit duration 10", function () {
      assert.equal(getPointsCountForOrbit(10, interpolationDegree), 13);
    });

    it("should return 13 with interp degree 7 and orbit duration 100", function () {
      assert.equal(getPointsCountForOrbit(100, interpolationDegree), 13);
    });

    it("should return 15 with interp degree 7 and orbit duration 300", function () {
      assert.equal(getPointsCountForOrbit(300, interpolationDegree), 13);
    });

    it("should return 16 with interp degree 7 and orbit duration 400", function () {
      assert.equal(getPointsCountForOrbit(400, interpolationDegree), 16);
    });

    it("should return 17 with interp degree 7 and orbit duration 500", function () {
      assert.equal(getPointsCountForOrbit(500, interpolationDegree), 17);
    });

    it("should return 21 with interp degree 7 and orbit duration 750", function () {
      assert.equal(getPointsCountForOrbit(750, interpolationDegree), 21);
    });

    it("should return 25 with interp degree 7 and orbit duration 1000", function () {
      assert.equal(getPointsCountForOrbit(1000, interpolationDegree), 25);
    });

    it("should return 36 with interp degree 7 and orbit duration 5000", function () {
      assert.equal(getPointsCountForOrbit(5000, interpolationDegree), 36);
    });

    it("should return 38 with interp degree 7 and orbit duration 10000", function () {
      assert.equal(getPointsCountForOrbit(10000, interpolationDegree), 38);
    });

    it("should return 40 with interp degree 7 and orbit duration 50000", function () {
      assert.equal(getPointsCountForOrbit(50000, interpolationDegree), 40);
    });

    it("should return 40 with interp degree 7 and orbit duration 100000", function () {
      assert.equal(getPointsCountForOrbit(100000, interpolationDegree), 40);
    });

    it("should return 40 with interp degree 7 and orbit duration 500000", function () {
      assert.equal(getPointsCountForOrbit(500000, interpolationDegree), 40);
    });

    it("should return 40 with interp degree 7 and orbit duration 1000000", function () {
      assert.equal(getPointsCountForOrbit(1000000, interpolationDegree), 40);
    });

    it("should return 13 with interp degree 7 and orbit duration 0", function () {
      assert.equal(getPointsCountForOrbit(0, interpolationDegree), 13);
    });

    it("should return 13 with interp degree 7 and orbit duration 1", function () {
      assert.equal(getPointsCountForOrbit(1, interpolationDegree), 13);
    });

    it("should return 13 with interp degree 7 and orbit duration -1", function () {
      assert.equal(getPointsCountForOrbit(-1, interpolationDegree), 13);
    });

    it("should return 43 with interp degree 7 and orbit duration -10000", function () {
      assert.equal(getPointsCountForOrbit(-10000, interpolationDegree), 43);
    });

    it("should return 40 with interp degree 7 and orbit duration -100000", function () {
      assert.equal(getPointsCountForOrbit(-100000, interpolationDegree), 40);
    });

    it("should return 40 with interp degree 7 and orbit duration -1000", function () {
      assert.equal(getPointsCountForOrbit(-1000, interpolationDegree), 50);
    });

    it("should return 40 with interp degree 7 and orbit duration 999999999999", function () {
      assert.equal(getPointsCountForOrbit(999999999999, interpolationDegree), 40);
    });
  });

  describe("orbitalPeriod()", function () {
    // Example 1: Low Earth Orbit (LEO) satellite
    const position1 = { x: 1000, y: 2000, z: 3000 };
    const velocity1 = { x: -5, y: 10, z: -15 };

    // Example 2: Geostationary orbit (GEO) satellite
    const position2 = { x: 42164, y: 0, z: 0 };
    const velocity2 = { x: 0, y: 3.07, z: 0 };

    // Example 3: High Earth Orbit (HEO) satellite
    const position3 = { x: 10000, y: 20000, z: 30000 };
    const velocity3 = { x: -2, y: 4, z: -6 };

    // Example 4: Non-circular orbit with low eccentricity
    const position4 = { x: 8000, y: 10000, z: 12000 };
    const velocity4 = { x: 2, y: 3, z: -4 };

    // Example 5: Non-circular orbit with high eccentricity
    const position5 = { x: 5000, y: 10000, z: 0 };
    const velocity5 = { x: 0, y: 6, z: 0 };

    // Example 6: Highly inclined polar orbit
    const position6 = { x: 1000, y: 0, z: 6000 };
    const velocity6 = { x: 5, y: 0, z: 0 };

    it("should be equal to 37.96258352979883 for Low Earth Orbit satellite", function () {
      assert.equal(orbitalPeriod(position1, velocity1), 37.96258352979883);
    });

    it("should be equal to 1436.0595095008016 for Geostationary orbit satellite", function () {
      assert.equal(orbitalPeriod(position2, velocity2), 1436.0595095008016);
    });

    it("should be equal to 1200.4822897237611 for High Earth Orbit satellite", function () {
      assert.equal(orbitalPeriod(position3, velocity3), 1200.4822897237611);
    });

    it("should be equal to 385.6317362938055 for Non-circular orbit with low eccentricity", function () {
      assert.equal(orbitalPeriod(position4, velocity4), 385.6317362938055);
    });

    it("should be equal to 196.08403727202756 for Non-circular orbit with high eccentricity", function () {
      assert.equal(orbitalPeriod(position5, velocity5), 196.08403727202756);
    });

    it("should be equal to 78.68845593056533 for Highly inclined polar orbit", function () {
      assert.equal(orbitalPeriod(position6, velocity6), 78.68845593056533);
    });
  });
});
