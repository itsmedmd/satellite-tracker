// utils
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { faCameraRotate, faArrowRotateRight, faCompress } from "@fortawesome/free-solid-svg-icons";
import { enterFullscreen, exitFullscreen } from "@/utils/shared/screenUtils";
import propagateObjects from "@/utils/satellites/propagateObjects";
import { setSearchFilterValue, setShowingSearchItemsCount } from "@/store/reducers/satellitesSlice";
import { useDispatch } from "react-redux";

// components and styles
import Options from "@/components/satellites/Options";
import TimeControls from "@/components/satellites/TimeControls";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./index.module.scss";

const CesiumView = ({
  recentLaunches,
  token,
  setLoadingStatus,
}) => {
  const dispatch = useDispatch();

  const interpolationDegree = 7;
  const initialClockMultiplier = 0;

  const viewer = useRef({}); // Cesium viewer object reference
  const startDate = useMemo(() => new Date(), []);
  const pointPixelSize = useMemo(() => 1.8, []);

  // categories that will have their objects hidden on load
  const hiddenByDefault = useMemo(() => ["Other", "Debris"], []);

  const [objectCategories, setObjectCategories] = useState([]);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleNavToggle = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }

    setIsFullscreen(!isFullscreen);
  };

  const handleOptionsToggle = (value) => {
    setIsNavOpen(value);
  };

  // about page in options has been toggled
  const handleAboutToggle = (value) => {
    setIsAboutOpen(value);
  };

  // change time flow multiplier
  const changeMultiplier = (multiplier) => {
    viewer.current.entities.values.forEach((entity) => {
      if (entity.clock) {
        entity.clock.multiplier = multiplier;
      }
    });

    viewer.current.clock.multiplier = multiplier;
  };

  // toggle points visibility of a specified category
  const changePointsVisibility = (category) => {
    const newEntities = viewer.current.entities.values;
    for (let i = 0; i < newEntities.length; i++) {
      const entity = newEntities[i];

      if (entity.categoryName === category.name) {
        entity.show = !entity.show;

        // If timer is stopped, we need to force position recalculation
        // because otherwise some points might stay invisible
        if (viewer.current.clock.multiplier === 0 && entity.allPositions) {
          entity.position = entity.allPositions.getValue(entity.clock.currentTime);
        }
      }
    }
  };

  // toggle visibility of a specified category and all its objects
  const toggleCategoryVisibility = (name) => {
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
  };

  // propagate objects for each category and get information about categories
  const propagateCategories = useCallback((combinedTLE, helperFunctions) => {
    // Add recent launches to the beginning of the list
    if (recentLaunches) {
      combinedTLE.unshift({
        color: {
          alpha: 1,
          blue: 1,
          green: 0,
          red: 1,
        },
        data: recentLaunches,
        name: "Past month launches",
      });
    }

    const initialObjectCategories = [];
    const propagatedCategories = [];
    let seenSats = [];

    combinedTLE.forEach((category) => {
      const { newSeen, data } = propagateObjects(seenSats, category.data, startDate, interpolationDegree, helperFunctions);
      seenSats = newSeen;

      if (data.length > 0) {
        const extraData = {
          name: category.name,
          color: category.color,
          visible: !hiddenByDefault.includes(category.name),
        };

        initialObjectCategories.push({
          objectsCount: data.length,
          ...extraData
        });

        propagatedCategories.push({
          data,
          ...extraData
        });
      }
    });

    return {
      propagatedCategories,
      initialObjectCategories
    };
  }, [hiddenByDefault, recentLaunches, startDate]);

  const resetCamera = () => {
    viewer.current.trackedEntity = undefined;
    viewer.current.camera.flyHome(0.6); // animation time in seconds
  };

  // Remove polylines, labels and reset sizes for points
  const clearExtraEntities = () => {
    const entities = viewer.current.entities.values.slice();
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      if (entity.polyline) {
        viewer.current.entities.remove(entity);
      } else if (entity.wasSelected) {
        // 'wasSelected' means that the point has label and increased pixel size
        entity.wasSelected = false;
        entity.point.pixelSize = pointPixelSize;
        entity.label = undefined;
      }
    }
  };

  const selectEntity = (id) => {
    // Start tracking the entity
    const entity = viewer.current.entities.getById(id);
    viewer.current.trackedEntity = entity;

    // Trigger the selectedEntityChanged event manually to show
    // entity orbit path and label if it's not showing them yet
    if (!entity.wasSelected) {
      viewer.current.selectedEntityChanged.raiseEvent(viewer.current.trackedEntity);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      return;
    }

    const combinedTLE = import("@/utils/satellites/combinedTLE");
    const Cesium = import("@/cesiumSource/Cesium");

    Promise.all([Cesium, combinedTLE]).then((values) => {
      setIsLoaded(true);

      // destructure imported modules
      const { ...Cesium } = values[0];
      const { default: combinedTLE } = values[1];

      Cesium.Ion.defaultAccessToken = token;

      // create Cesium viewer
      viewer.current = new Cesium.Viewer("cesium-container", {
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
        requestRenderMode: false,
        maximumScreenSpaceError: 128
      });

      // set world imagery
      viewer.current.imageryLayers.addImageryProvider(
        new Cesium.IonImageryProvider({ assetId: 3845 })
      );

      // add settings for Cesium
      const start = Cesium.JulianDate.fromDate(startDate);
      
      viewer.current.clock.startTime = start.clone();
      viewer.current.clock.currentTime = start.clone();
      viewer.current.clock.canAnimate = false;
      viewer.current.clock.shouldAnimate = false;
      viewer.current.clock.multiplier = initialClockMultiplier;
      viewer.current.clock.clockStep = Cesium.ClockRange.TICK_DEPENDENT;
      viewer.current.resolutionScale = 0.8;
      viewer.current.scene.screenSpaceCameraController.minimumZoomDistance = 4e6; // max zoom-in distance in meters
      viewer.current.scene.screenSpaceCameraController.maximumZoomDistance = 0.5e9; // max zoom-out distance in meters
      viewer.current.scene.globe.depthTestAgainstTerrain = true; // Make things behind terrain disappear

      // Calculate position from TLE data
      const {propagatedCategories, initialObjectCategories} = propagateCategories(combinedTLE, {
        SampledPositionProperty: Cesium.SampledPositionProperty,
        JulianDate: Cesium.JulianDate,
        Cartesian3: Cesium.Cartesian3,
      });

      // Create entities for each object
      const points = [];
      propagatedCategories.forEach((category) => {
        category.data.forEach(({position, orbitDuration, name, epochDate, satnum}, i) => {
          const entity = viewer.current.entities.add({
            id: `${category.name}-${satnum}-${i}`,
            epochDate,
            allPositions: position,
            position,
            point: {
              color: category.color,
              pixelSize: pointPixelSize,
              scaleByDistance: new Cesium.NearFarScalar(2e7, 1.9, 9e7, 1),
              translucencyByDistance: new Cesium.NearFarScalar(2e7, 1, 9e7, 0.8),
            },
            name: name,
            satnum,
            categoryName: category.name,
            show: category.visible,
          });

          entity.position.setInterpolationOptions({
            interpolationDegree,
            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation,
          });

          // Set the entity's clock settings to control how time progresses for the object
          entity.clock = new Cesium.Clock({
            startTime: start.clone(),
            currentTime: start.clone(),
            stopTime: Cesium.JulianDate.addMinutes(start.clone(), orbitDuration, new Cesium.JulianDate()),
            multiplier: initialClockMultiplier,
            clockStep: Cesium.ClockRange.TICK_DEPENDENT,
            shouldAnimate: true,
            canAnimate: true,
          });

          points.push(entity);
        });
      });

      // Handle clocks for each object individually
      viewer.current.clock.onTick.addEventListener((clock) => {
        if (clock.multiplier === 0) {
          return;
        }

        // Update positions and clocks of each entity separately
        points.forEach((entity) => {
          if (entity.isShowing) {
            entity.clock.tick(); // Advance entity clock

            if (Cesium.JulianDate.compare(entity.clock.stopTime, entity.clock.currentTime) < 0) {
              // If reached the stop time, reset the clock to start over
              entity.clock.currentTime = entity.clock.startTime.clone();
            } else if (Cesium.JulianDate.compare(entity.clock.startTime, entity.clock.currentTime) > 0) {
              // If going backwards, when startTime is hit, set time to stopTime so that a loop would be made
              entity.clock.currentTime = entity.clock.stopTime.clone();
            }

            if (entity.allPositions) {
              entity.position = entity.allPositions.getValue(entity.clock.currentTime);
            }
          }
        });
      });

      // Show or hide orbit paths and labels for items when selecting them
      viewer.current.selectedEntityChanged.addEventListener((selectedEntity) => {
        if (Cesium.defined(selectedEntity) && Cesium.defined(selectedEntity.name)) {
          // orbit path polyline
          const polylineID = `orbit-path-${selectedEntity.id}`;

          if (selectedEntity.wasSelected) {
            // Reset selected entity size and clear its orbit path and label
            selectedEntity.wasSelected = false;
            selectedEntity.point.pixelSize = pointPixelSize;
            selectedEntity.label = undefined;
            viewer.current.entities.removeById(polylineID);
          } else {
            selectedEntity.wasSelected = true;
            selectedEntity.point.pixelSize = 5;

            // Add label
            selectedEntity.label = new Cesium.LabelGraphics({
              text: `${selectedEntity.name.trim()} (${selectedEntity.satnum})`,
              style : Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
              pixelOffset : new Cesium.Cartesian2(0, -10),
              // Increased size and reduced scaling to improve resolution of the text
              font : "57px Helvetica",
              scale: 0.3,
            });

            if (!selectedEntity.allPositions) {
              return;
            }

            // Get array of JulianDate times
            const times = selectedEntity.allPositions._property._times; 
            
            // Extract Cartesian3 positions from the SampledPositionProperty
            const cartesianPositions = [];
            for (let i = 0; i < times.length; i++) {
              const cartesianPosition = new Cesium.Cartesian3();
              selectedEntity.allPositions.getValue(times[i], cartesianPosition);
              cartesianPositions.push(cartesianPosition);
            }

            // Add the orbit path polyline to the viewer
            viewer.current.entities.add({
              categoryName: selectedEntity.categoryName,
              id: polylineID,
              polyline: {
                positions: cartesianPositions,
                width: 1,
                material: Cesium.Color.clone(selectedEntity.point.color.getValue()),
              },
            });
          }
        }
      });

      // Create a screen space event handler to handle click events on the canvas
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.current.scene.canvas);
      handler.setInputAction((click) => {
        const pickedObject = viewer.current.scene.pick(click.position);

        // If the clicked object is a polyline, remove it
        if (Cesium.defined(pickedObject)
          && Cesium.defined(pickedObject.id)
          && Cesium.defined(pickedObject.id.polyline)) {
          viewer.current.entities.remove(pickedObject.id);
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Event listener to turn off loader after the scene renders for the first time
      const turnOffLoader = () => {
        viewer.current.scene.postRender.removeEventListener(turnOffLoader);
        setTimeout(() => {
          setLoadingStatus(false);
        }, 500);
      };

      // Start animation
      viewer.current.clock.canAnimate = true;
      viewer.current.clock.shouldAnimate = true;

      setObjectCategories(initialObjectCategories);

      viewer.current.scene.postRender.addEventListener(turnOffLoader);
      viewer.current.camera.flyHome(0.5); // set initial camera position
    });

    return () => {
      dispatch(setSearchFilterValue(""));
      dispatch(setShowingSearchItemsCount(100));
    };
  }, [dispatch, isLoaded, pointPixelSize, propagateCategories, setLoadingStatus, startDate, token]);

  return (
    <>
      <Options
        objectCategories={objectCategories}
        toggleCategoryVisibility={toggleCategoryVisibility}
        handleOptionsToggle={handleOptionsToggle}
        handleAboutToggle={handleAboutToggle}
        selectEntity={selectEntity}
        entities={!viewer.current?.entities?.values?.length
          ? []
          : viewer.current.entities.values
            .filter((entity) => entity.point)
            .map((entity) => ({
              id: entity.id,
              name: entity.name.toLowerCase(),
              categoryName: entity.categoryName.toLowerCase(),
              satnum: entity.satnum,
              epochDate: entity.epochDate,
              visible: entity.isShowing
            }))
        }
      />
      <TimeControls
        handleMultiplierChange={changeMultiplier}
        isNavOpen={isNavOpen}
        isAboutOpen={isAboutOpen}
      />

      {
        !isNavOpen && !isAboutOpen &&
          <div className={styles["utils"]}
          >
            <button
              onClick={resetCamera}
              title="Reset camera view"
            >
              <FontAwesomeIcon
                icon={faCameraRotate}
                className={styles["icon"]}
              />
            </button>
            <button
              onClick={clearExtraEntities}
              title="Clear extra entities"
            >
              <FontAwesomeIcon
                icon={faArrowRotateRight}
                className={styles["icon"]}
              />
            </button>
            <button 
              onClick={handleNavToggle}
              title="Toggle fullscreen mode"
            >
              <FontAwesomeIcon
                icon={faCompress}
                className={styles["icon"]}
              />
            </button>
          </div>
      }

      <main className={styles["content"]}>
        <div
          id="cesium-container"
          className={`
            fullSize
            ${isNavOpen ? "nav-open" : ""}
            ${isAboutOpen ? "about-open" : ""}
          `}
        ></div>
      </main>
    </>
  );
};

export default CesiumView;
