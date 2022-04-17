# Satellite Tracker

A website where you can track real-time positions of almost 20,000 satellites orbiting the Earth in a 3D geospatial viewer.

 This project uses publicly available satellite TLE (Two-Line Element) data sets that are easily accessible and provided by [CelesTrak](https://celestrak.com/NORAD/elements/).

To make any practical use of the TLE data, the project uses Shashwat Kandadai's JavaScript library called [satellite.js](https://github.com/shashwatak/satellite-js) for satellite position propagation via TLE data sets that contain orbital information about each object.

All objects are then rendered in a 3D geospatial viewer provided by [Cesium](https://cesium.com). By the nature of the data contained within TLE sets, it is possible to determine the position of each object at any given moment in time, be it the present, the future or the past. The project makes use of this feature with the "time flow multiplier" slider.

You can find live version [here](https://satellites-itsmedmd.vercel.app).
