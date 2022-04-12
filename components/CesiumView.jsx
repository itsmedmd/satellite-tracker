import { useEffect, useState, useCallback } from 'react';
import {
  Viewer,
  IonImageryProvider,
  Cartesian3,
  Ion,
  NearFarScalar,
  JulianDate,
  PointPrimitiveCollection
} from "cesiumSource/Cesium";

import { combinedTLE } from "utils/combinedTLE";
import createPropagatedArray from "utils/createPropagatedArray";
import propagateObjects from "utils/propagateObjects";

import Navigation from "components/Navigation";
import TimeControls from "components/TimeControls";

const CesiumView = ({token}) => {
  const startTime = new Date();
  const [clockTime, setClockTime] = useState(startTime);
  const [viewerObject, setViewerObject] = useState(null);
  const [pointsCollectionObject, setPointsCollectionObject] = useState(null);
  const [objectCategories, setObjectCategories] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  let lastTime = null;

  // toggle points visibility of a specified category
  const changePointsVisibility = (category) => {
    for (let i = 0; i < pointsCollectionObject.length; i++) {
      const point = pointsCollectionObject.get(i);
      if (point.color.red === category.color.red &&
          point.color.green === category.color.green &&
          point.color.blue === category.color.blue) {
        point.show = !point.show;
      }
    }
    // re-render the scene in case the clock (constant re-rendering) is stopped
    viewerObject.scene.requestRender();
  };

  // navigation has been toggled
  const handleNavToggle = useCallback((value) => {
    setIsNavOpen(value);
  }, [isNavOpen]);
  
  // about page in navigation has been toggled
  const handleAboutToggle = useCallback((value) => {
    setIsAboutOpen(value);
  }, [isAboutOpen]);

  // toggle visibility of a specified category 
  const changeCategoryVisibility = useCallback((name) => {
    const newCategories = [...objectCategories];
    let changedCategory = null;
    newCategories.forEach((category) => {
      if (category.name === name) {
        changedCategory = category;
        category.visible = !category.visible;
      }
    });
    setObjectCategories(newCategories);
    changePointsVisibility(changedCategory);
  }, [objectCategories]);

  // change time flow multiplier
  const changeMultiplier = (multiplier) => {
    viewerObject.clock.multiplier = multiplier;
  };

  // update predicted object position in a set moment of time
  const updatePosition = (pointsCollection, satrecs, currentTime) => {
    // clone JulianDate but set seconds with Math.floor
    const newTime = new JulianDate();
    JulianDate.clone(currentTime, newTime);
    newTime.secondsOfDay = Math.floor(newTime.secondsOfDay);

    if (!newTime.equals(lastTime)) {
      const newDate = JulianDate.toDate(newTime);
      setClockTime(newTime);
      lastTime = newTime;

      // Propagate objects
      const results = createPropagatedArray(satrecs, newDate);

      // set new positions for objects in 3D viewer
      const km = 1000; // need to multiply each coordinate by 1000 to get km
      const points = pointsCollection._pointPrimitives;

      for (let i = 0; i < points.length; i++) {
        if (results[i] && points[i]) {
          points[i].position =  new Cartesian3(results[i].position.x * km, results[i].position.y * km, results[i].position.z * km);
        }
      }
    }
  }; 

  useEffect(() => {
    if (token) {
      Ion.defaultAccessToken = token;

      // create Cesium viewer
      const viewer = new Viewer("cesium-container", {
        imageryProvider: false,
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        vrButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        targetFrameRate: 60,
        requestRenderMode: true,
        maximumScreenSpaceError: 32
      });

      // set world imagery
      viewer.imageryLayers.addImageryProvider(
        new IonImageryProvider({ assetId: 3845 })
      );

      viewer.clock.canAnimate = false; // do not start the clock before the points are created
      viewer.clock.multiplier = 0; // set initial clock as stopped
      viewer.resolutionScale = 0.7;
      viewer.scene.screenSpaceCameraController.minimumZoomDistance = 4e6; // max zoom in distance in meters
      viewer.scene.screenSpaceCameraController.maximumZoomDistance = 0.5e9; // max zoom out distance in meters

      // Calculate position and velocity from TLE data
      const initialObjectCategories = [];
      const propagatedCategories = combinedTLE.map((category) => {
        initialObjectCategories.push({
          name: category.name,
          color: category.color,
          visible: true
        });

        return {
          data: propagateObjects(category.data, startTime),
          name: category.name,
          color: category.color
        }
      });

      const km = 1000; // need to multiply each coordinate by 1000 to get km
      let allSatrecs = [];
      const pointsCollection = viewer.scene.primitives.add(new PointPrimitiveCollection());

      // Create entities in 3D viewer for each object
      propagatedCategories.forEach((category) => {
        // append satrecs for category to all satrecs variable
        allSatrecs = allSatrecs.concat(category.data.satrecs);

        // create 3D entities with category color
        category.data.results.forEach((obj) => 
          pointsCollection.add({
            position: new Cartesian3(obj.position.x * km, obj.position.y * km, obj.position.z * km),
            color: category.color,
            pixelSize: 2,
            scaleByDistance: new NearFarScalar(8e6, 1.5, 11e6, 1),
            translucencyByDistance: new NearFarScalar(4e7, 1, 1e9, 0)
          })
        );
      });

      // render scene with initial points
      viewer.scene.requestRender();

      // start the clock and set options for it
      viewer.clock.canAnimate = true;
      viewer.clock.shouldAnimate = true;

      setViewerObject(viewer);
      setPointsCollectionObject(pointsCollection);
      setObjectCategories(initialObjectCategories);

      // start updating the position of points based on clock time
      viewer.scene.preRender.addEventListener(() => updatePosition(pointsCollection, allSatrecs, viewer.clock.currentTime));
    }
  }, [token]);

  return (
    <>
        <Navigation
            objectCategories={objectCategories}
            changeCategoryVisibility={changeCategoryVisibility}
            handleNavToggle={handleNavToggle}
            handleAboutToggle={handleAboutToggle}
        />
        <TimeControls
            clockTime={JulianDate.toDate(clockTime)}
            handleMultiplierChange={changeMultiplier}
            isNavOpen={isNavOpen}
            isAboutOpen={isAboutOpen}
        />
        <main>
            <div
                id="cesium-container"
                className={`
                    fullSize
                    ${isNavOpen && 'nav-open'}
                    ${isAboutOpen && 'about-open'}
                `}
            ></div>
        </main>
    </>
  )
};

export default CesiumView;
