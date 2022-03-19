import { useEffect } from 'react';
import Head from 'next/head';
import * as satellite from "satellite.js";

import { combinedTLE } from "utils/combineTLE";

import {
  Viewer,
  CesiumTerrainProvider,
  Ion,
  IonResource,
  Cartesian3,
  ReferenceFrame,
  Color as CesiumColor
} from "cesiumSource/Cesium";

export default function Home() {
  // calculate position and velocity of each object from TLE data
  const propagateObjects = (data, now) => {
    const objects = [];
    const results = []; 

    let j = 0;
    for (let i=0; i < data.length; i++) {
      const tle1 = data[j];
      const tle2 = data[j + 1];
      if (typeof tle1 == 'string' || tle1 instanceof String || typeof tle2 == 'string' || tle2 instanceof String) {
        objects.push(satellite.twoline2satrec(tle1, tle2));
      }
      j = j + 2;
    }

    // Propagate debris
    for (let i=0; i < data.length; i++) {
      if (objects[i]) { 
         const propagated = satellite.propagate(
          objects[i],
          now.getUTCFullYear(),
          now.getUTCMonth() + 1, // month has to be in range 1-12.
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          now.getUTCSeconds()
        );

        if (propagated.position && propagated.velocity) {
          results.push(propagated);
        }
      }
    }

    return results;
  };

  useEffect(() => {
    // Calculate position and velocity from TLE data
    const now = new Date();
    const propagatedData = propagateObjects(combinedTLE, now);

    // Create 3D Cesium viewer
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

    viewer.resolutionScale = 0.8;
    
    // Create entities in 3D viewer for each object
    const km =  1000; // need to multiply each coordinate by 1000 to get km
    const objects = [];

    propagatedData.forEach((obj) => 
      objects.push(viewer.entities.add(
          {
            position: {
              x: obj.position.x * km,
              y: obj.position.y * km,
              z: obj.position.z * km
            },
            point: {
              color: CesiumColor.CHARTREUSE,
              pixelSize : 4
            }
          }
        )
      )
    );
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
