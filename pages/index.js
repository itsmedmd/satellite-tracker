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
  NearFarScalar,
  JulianDate,
  PointPrimitiveCollection,
  Color as CesiumColor
} from "cesiumSource/Cesium";

export default function Home() {
  let lastTime = null;

  // Propagate an array of satrecs with provided time
  // using a web worker (if available)
  const createPropagatedArray = (satrecs, now, worker) => {
    return new Promise(function(resolve, reject) {
      // if web workers are supported, use the created worker
      if (worker && 1 > 2) {
        console.log("worker", worker);
        worker.onmessage = (e) => {
          resolve(e.data);
        };
  
        worker.postMessage({ satrecs, now });
      } else {
        console.log("fallback");
        // if web workers are not supported, use this fallback code
        const results = [];

        satrecs.forEach((record) => {
          if (record) { 
            const propagated = satellite.propagate(
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
  
        resolve(results);
      }
    });
  };

  // calculate position and velocity of each object from TLE data
  const propagateObjects = (data, now, worker) => {
    return new Promise(function(resolve, reject) {
      const satrecs = [];

      // transform TLE data to satrec data
      let j = 0;
      for (let i=0; i < data.length; i++) {
        const tle1 = data[j];
        const tle2 = data[j + 1];
        if (typeof tle1 == 'string' && typeof tle2 == 'string') {
          satrecs.push(satellite.twoline2satrec(tle1, tle2));
        }
        j = j + 2;
      }
  
      // Propagate objects
      createPropagatedArray(satrecs, now, worker)
      .then(results => resolve({ results, satrecs }));
    });
  };

  // update predicted object position in a set moment of time
  const updatePosition = (pointsCollection, satrecs, worker, currentTime) => {
    // clone JulianDate but set seconds with Math.floor
    const newTime = new JulianDate();
    JulianDate.clone(currentTime, newTime);
    newTime.secondsOfDay = Math.floor(newTime.secondsOfDay);

    if (!newTime.equals(lastTime)) {
      console.log("updating");
      // ADD GUARD AGAINST TIME INCREASE
      // ADD GUARD AGAINST TIME INCREASE
      // ADD GUARD AGAINST TIME INCREASE
      // ADD GUARD AGAINST TIME INCREASE
      // ADD GUARD AGAINST TIME INCREASE
      const newDate = JulianDate.toDate(newTime)
      lastTime = newTime;

      // Propagate objects
      createPropagatedArray(satrecs, newDate, worker)
      .then(results => {
          // set new positions for objects in 3D viewer
          const km = 1000; // need to multiply each coordinate by 1000 to get km
          const points = pointsCollection._pointPrimitives;

          for (let i = 0; i < points.length; i++) {
            if (results[i] && points[i]) {
              points[i].position =  new Cartesian3(results[i].position.x * km, results[i].position.y * km, results[i].position.z * km);
            }
          }
      });
    }
  }; 

  useEffect(() => {
    let worker = null;
    if (window.Worker) {
      worker = new Worker("webWorkers/positionUpdateWorker.js");
    }

    // Create 3D Cesium viewer
    Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODM0ODNmMS0wMmZjLTRiNTUtODAxMy0yMWZlMmI5OWE0ZDAiLCJpZCI6ODQ0ODMsImlhdCI6MTY0NjMxNzk4MX0.uVpY8O0Gg7Q3hjFtCfDksBL_4FCvj9AplE6qGK117K4";

    const viewer = new Viewer("cesium-container", {
      terrainProvider: new CesiumTerrainProvider({
        url: IonResource.fromAssetId(1),
      }),
      //animation: false,
      baseLayerPicker: false,
      fullscreenButton: true,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      targetFrameRate: 24,
      requestRenderMode: true
    });

    viewer.scene.debugShowFramesPerSecond = true;
    viewer.resolutionScale = 0.7;

    // Calculate position and velocity from TLE data,
    // render objects in initial object positions and
    // start periodically updating their positions
    const now = new Date();
    const pointsCollection = viewer.scene.primitives.add(new PointPrimitiveCollection());
    
    propagateObjects(combinedTLE, now, worker)
    .then(({ results: propagatedData, satrecs }) => {
      // Create entities in 3D viewer for each object
      const km =  1000; // need to multiply each coordinate by 1000 to get km

      propagatedData.forEach((obj) => 
        pointsCollection.add({
          position: new Cartesian3(obj.position.x * km, obj.position.y * km, obj.position.z * km),
          color: CesiumColor.CHARTREUSE,
          pixelSize: 2,
          scaleByDistance: new NearFarScalar(1e2, 1.5, 1e9, 0),
          translucencyByDistance: new NearFarScalar(4e7, 1, 1e9, 0)
        })
      );

      viewer.scene.render();
      viewer.scene.preRender.addEventListener(() => updatePosition(pointsCollection, satrecs, worker, viewer.clock.currentTime));
    });
    
    return () => {
      worker.terminate();
      pointsCollection.removeAll();
    };
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
