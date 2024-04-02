# Satellite Tracker

## About

A website where you can track positions and orbits of over 22,000 satellites orbiting the Earth in a 3D geospatial viewer powered by Cesium.

This project uses publicly available satellite TLE (Two-Line Element) data sets that are easily accessible and provided by [CelesTrak](https://celestrak.com/NORAD/elements/).

To make practical use of the TLE data, the project uses Shashwat Kandadai's JavaScript library called [satellite.js](https://github.com/shashwatak/satellite-js) for satellite position propagation via TLE data sets that contain orbital information about each object.

All objects are then rendered in a 3D geospatial viewer provided by [Cesium](https://cesium.com). By the nature of the data contained within TLE sets, it is possible to determine the position of each object at any given moment in time, be it the present, the future or the past. The project makes use of this feature with the "time flow multiplier" slider, although satellite positions are not physically exact and only approximated for the sake of getting better performance. Clicking on a satellite object displays approximate (interpolated) satellite orbit path.

You can find live version [here](https://satellites-itsmedmd.vercel.app).

For v2.0.0, the code was extracted from another personal project so there are some parts that might seem like unnecessarily split away. It's because those splits make sense in the full project from which this code was extracted, it's just that I didn't go through every single part to cater the code for this separated project.

## Launch guide

Confirmed working on Node.js 18.19.0 and npm 10.2.3

1. Create a Cesium (https://cesium.com/) account, log in, navigate to "Access Tokens" tab and find your token or create a new one
2. In the root project directory create an .env file (e.g. ".env.local") and add your token like this: `CESIUM_TOKEN=YOUR_TOKEN_HERE`
3. In Cesium website, navigate to "My Assets" tab and verify that an Earth model is present in your assets with the ID of 3845 (deployed project uses "Blue Marble Next Generation July, 2004" model). This asset ID is hardcoded and can be changed in `components/satellites/CesiumView/index.jsx` file (look for the number `3845` in the project)
4. Run `npm i`
5. Run `npm run dev` - your project should be running in development mode now

To create a production build:
1. Run `npm run build`
2. Run `npm run start` - your project should be running in production mode now
