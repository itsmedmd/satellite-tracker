import { useEffect } from 'react';
import Head from 'next/head';
import * as satellite from "satellite.js";

import spaceStationsTLE from "data/spaceStationsTLE";

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
  const propagateOrbitalDebris = (data, now) => {
    const debrisRecords = [];
    const datasetSize = data.length;
    const posVel = []; 

    let j = 0;
    for (let i=0; i < datasetSize; i++) {
      const tle1 = data[j];
      const tle2 = data[j + 1];
      if (typeof tle1 == 'string' || tle1 instanceof String || typeof tle2 == 'string' || tle2 instanceof String) {
          debrisRecords.push(satellite.twoline2satrec(tle1, tle2));
      }
      j = j + 2;
    }

    // Propagate debris
    for (let i=0; i < datasetSize; i++) {
      if (debrisRecords[i] != undefined) { 
         const propagated = satellite.propagate(
           debrisRecords[i],
           now.getUTCFullYear(),
           now.getUTCMonth() + 1, // month has to be in range 1-12.
           now.getUTCDate(),
           now.getUTCHours(),
           now.getUTCMinutes(),
           now.getUTCSeconds()
        );

        if (propagated.position && propagated.velocity) {
          posVel.push(propagated);
        }
      }
    }

    return posVel;
  };

  const startUpdate = (data, objects) => {
   const km =  1000;
   const debrisPos = new Cartesian3(0, 0, 0);

   for (let i=0; i < data.length; i++) {
      if (data[i] != undefined) {
        debrisPos.x = data[i].position.x * km;
        debrisPos.y = data[i].position.y * km ;
        debrisPos.z = data[i].position.z * km;
        objects[i].position = debrisPos;
      }
    }

    //setInterval(function () {updatePosition() }, 50);
  };

  useEffect(() => {
    const now = new Date();
    const propagatedData = propagateOrbitalDebris(spaceStationsTLE, now);

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
    
    const objects = [];
    for (let debrisID = 0; debrisID < propagatedData.length; debrisID++) {
      objects.push(viewer.entities.add(
          {
            position: {
              value: Cartesian3.fromDegrees(-75.59777, 40.03883),
              referenceFrame: ReferenceFrame.FIXED 
            },
            point: {
              color: CesiumColor.CHARTREUSE,
              pixelSize : 5
            }
          }
        )
      );
    }

    const km =  1000;
    const debrisPos = new Cartesian3(0, 0, 0);
 
    for (let i=0; i < propagatedData.length; i++) {
       if (propagatedData[i] != undefined) {
         debrisPos.x = propagatedData[i].position.x * km;
         debrisPos.y = propagatedData[i].position.y * km ;
         debrisPos.z = propagatedData[i].position.z * km;
         objects[i].position = debrisPos;
       }
     }

    //startUpdate(propagatedData, objects);
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
