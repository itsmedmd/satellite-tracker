import { useEffect } from 'react';
import Head from 'next/head';

import {
  twoline2satrec,
  sgp4,
  gstime,
  degreesToRadians,
  eciToEcf,
  geodeticToEcf,
  eciToGeodetic,
  ecfToLookAngles,
  degreesLong,
  degreesLat
} from "satellite.js";

import {
  Viewer,
  CesiumTerrainProvider,
  Ion,
  IonResource,
  Cartesian3
} from "cesiumSource/Cesium";

export default function Home() {
  useEffect(() => {
    const tleLine1 = '1 25544U 98067A   13149.87225694  .00009369  00000-0  16828-3 0  9031';
    const tleLine2 = '2 25544 051.6485 199.1576 0010128 012.7275 352.5669 15.50581403831869';
  
    // Initialize a satellite record
    const satrec = twoline2satrec(tleLine1, tleLine2);
  
    // Propagate satellite using time since epoch (in minutes)
    // this creates ECI coordinates
    const positionAndVelocity = sgp4(satrec, 0);
    const positionEci = positionAndVelocity.position;
    const velocityEci = positionAndVelocity.velocity;

    // Set the Observer at 122.03 West by 36.96 North, in RADIANS
    const observerGd = {
        longitude: degreesToRadians(-122.0308),
        latitude: degreesToRadians(36.9613422),
        height: 0.370
    };

    // create GMST for coordinate transforms
    const gmst = gstime(new Date());
    console.log("gmst:", gmst);

    // You can get ECF, Geodetic and Look Angles
    const positionEcf   = eciToEcf(positionEci, gmst);
    const observerEcf   = geodeticToEcf(observerGd);
    const positionGd    = eciToGeodetic(positionEci, gmst);
    const lookAngles    = ecfToLookAngles(observerGd, positionEcf);
    console.log("positionEcf", positionEcf);
    console.log("observerEcf", observerEcf);
    console.log("positionGd", positionGd);
    console.log("lookAngles", lookAngles);

    // The coordinates are all stored in key-value pairs.
    // ECI and ECF are accessed by `x`, `y`, `z` properties.
    const satelliteX = positionEci.x;
    const satelliteY = positionEci.y;
    const satelliteZ = positionEci.z;
    console.log("satelliteX", satelliteX);
    console.log("satelliteY", satelliteY);
    console.log("satelliteZ", satelliteZ);

    // Look Angles may be accessed by `azimuth`, `elevation`, `range_sat` properties.
    const azimuth   = lookAngles.azimuth;
    const elevation = lookAngles.elevation;
    const rangeSat  = lookAngles.rangeSat;
    console.log("azimuth", azimuth);
    console.log("elevation", elevation);
    console.log("rangeSat", rangeSat);

    // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
    const longitude = positionGd.longitude;
    const latitude  = positionGd.latitude;
    const height    = positionGd.height;
    console.log("longitude", longitude);
    console.log("latitude", latitude);
    console.log("height", height);

    // Convert the RADIANS to DEGREES.
    const longitudeDeg = degreesLong(longitude);
    const latitudeDeg  = degreesLat(latitude);
    console.log("longitudeDeg", longitudeDeg);
    console.log("latitudeDeg", latitudeDeg);






    // Create 3D renders using Cesium
    Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODM0ODNmMS0wMmZjLTRiNTUtODAxMy0yMWZlMmI5OWE0ZDAiLCJpZCI6ODQ0ODMsImlhdCI6MTY0NjMxNzk4MX0.uVpY8O0Gg7Q3hjFtCfDksBL_4FCvj9AplE6qGK117K4";

    const viewer = new Viewer("cesium-container", {
      terrainProvider: new CesiumTerrainProvider({
        url: IonResource.fromAssetId(1),
      }),
      maximumScreenSpaceError: 32,
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: true,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false
    });

    viewer.resolutionScale = 0.7;
  });

  return (
    <div>
      <Head>
        <title>Satellite Tracker</title>
      </Head>

      <main>
        <div id="cesium-container" className="fullSize"></div>
      </main>
    </div>
  )
}
