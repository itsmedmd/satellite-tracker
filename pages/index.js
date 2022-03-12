import { useEffect } from 'react';
import Head from 'next/head';

import { twoline2satrec, sgp4 } from "satellite.js";
import { Viewer, CesiumTerrainProvider, Ion, IonResource } from "cesiumSource/Cesium";

export default function Home() {
  useEffect(() => {
    const tleLine1 = '1 25544U 98067A   13149.87225694  .00009369  00000-0  16828-3 0  9031';
    const tleLine2 = '2 25544 051.6485 199.1576 0010128 012.7275 352.5669 15.50581403831869';
  
    // Initialize a satellite record
    const satrec = twoline2satrec(tleLine1, tleLine2);
  
    // Propagate satellite using time since epoch (in minutes)
    const positionAndVelocity = sgp4(satrec, 0);
  
    console.log(positionAndVelocity);

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
