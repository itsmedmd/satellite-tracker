import { Color as CesiumColor } from "cesiumSource/Cesium";

// special-interest satellites
import spaceStationsTLE from "../data/spaceStationsTLE";
import brightestTLE from "../data/brightestTLE";
import activeTLE from "../data/activeTLE";
import analystTLEa from "../data/analystTLE";

// debris (special-interest)
import russianASATDebrisTLE from "../data/russianASATDebrisTLE";
import indianASATDebrisTLE from "../data/indianASATDebrisTLE";
import chineseASATDebrisTLE from "../data/chineseASATDebrisTLE";
import iridium33DebrisTLE from "../data/iridium33DebrisTLE";
import cosmos2251DebrisTLE from "../data/cosmos2251DebrisTLE";

// weather and earth resources satellites
import weatherTLE from "../data/weatherTLE";
import noaaTLE from "../data/noaaTLE";
import goesTLE from "../data/goesTLE";
import earthResourcesTLE from "../data/earthResourcesTLE";
import searchRescueTLE from "../data/searchRescueTLE";
import disasterMonitoringTLE from "../data/disasterMonitoringTLE";
import trackingTLE from "../data/trackingTLE";
import argosTLE from "../data/argosTLE";
import planetTLE from "../data/planetTLE";
import spireTLE from "../data/spireTLE";

// communications satellites
import activeGeosynchronousTLE from "../data/activeGeosynchronousTLE";
import amateurRadioTLE from "../data/amateurRadioTLE";
import experimentalCommTLE from "../data/experimentalCommTLE";
import geoProtectedZoneTLE from "../data/geoProtectedZoneTLE";
import geoProtectedZonePlusTLE from "../data/geoProtectedZonePlusTLE";
import globalstarTLE from "../data/globalstarTLE";
import gorizontTLE from "../data/gorizontTLE";
import intelsatTLE from "../data/intelsatTLE";
import iridiumNextTLE from "../data/iridiumNextTLE";
import iridiumTLE from "../data/iridiumTLE";
import molniyaTLE from "../data/molniyaTLE";
import onewebTLE from "../data/onewebTLE";
import orbcommTLE from "../data/orbcommTLE";
import otherCommTLE from "../data/otherCommTLE";
import radugaTLE from "../data/radugaTLE";
import satnogsTLE from "../data/satnogsTLE";
import sesTLE from "../data/sesTLE";
import swarmTLE from "../data/swarmTLE";

// starlink (communications)
import starlinkTLE from "../data/starlinkTLE";

// navigation satellites
import gnssTLE from "../data/gnssTLE";
import gpsOperationalTLE from "../data/gpsOperationalTLE";
import glonassOperationalTLE from "../data/glonassOperationalTLE";
import galileoTLE from "../data/galileoTLE";
import beidouTLE from "../data/beidouTLE";
import satelliteBasedAugmentationSystemTLE from "../data/satelliteBasedAugmentationSystemTLE";
import navyNavigationSatelliteSystemTLE from "../data/navyNavigationSatelliteSystemTLE";
import russianLeoNavigationTLE from "../data/russianLeoNavigationTLE";

// scientific satellites
import educationTLE from "../data/educationTLE";
import engineeringTLE from "../data/engineeringTLE";
import geodeticTLE from "../data/geodeticTLE";
import spaceEarthScienceTLE from "../data/spaceEarthScienceTLE";

// miscellaneous satellites
import miscellaneousMilitaryTLE from "../data/miscellaneousMilitaryTLE";
import radarCalibrationTLE from "../data/radarCalibrationTLE";
import otherSatellitesTLE from "../data/otherSatellitesTLE";
import cubeSatsTLE from "../data/cubeSatsTLE";

// https://cesium.com/learn/cesiumjs/ref-doc/Color.html
const debrisColor = CesiumColor.LIGHTSLATEGRAY;
const specialInterestColor = CesiumColor.YELLOWGREEN;
const weatherEarthColor = CesiumColor.TURQUOISE;
const communicationsColor = CesiumColor.AQUA;
const navigationColor = CesiumColor.CHARTREUSE;
const scientificColor = CesiumColor.MINTCREAM;
const miscellaneousColor = CesiumColor.OLDLACE;
const starlinkColor = CesiumColor.YELLOW;

const debris = {
    color: debrisColor,
    data: [
        ...russianASATDebrisTLE,
        ...indianASATDebrisTLE,
        ...chineseASATDebrisTLE,
        ...iridium33DebrisTLE,
        ...cosmos2251DebrisTLE
    ]
};

const specialInterest = {
    color: specialInterestColor,
    data: [
        ...spaceStationsTLE,
        ...brightestTLE,
        ...activeTLE,
        ...analystTLEa
    ]
};

const weatherEarth = {
    color: weatherEarthColor,
    data: [
        ...weatherTLE,
        ...noaaTLE,
        ...goesTLE,
        ...earthResourcesTLE,
        ...searchRescueTLE,
        ...disasterMonitoringTLE,
        ...trackingTLE,
        ...argosTLE,
        ...planetTLE,
        ...spireTLE
    ]
};

const communications = {
    color: communicationsColor,
    data: [
        ...activeGeosynchronousTLE,
        ...amateurRadioTLE,
        ...experimentalCommTLE,
        ...geoProtectedZoneTLE,
        ...geoProtectedZonePlusTLE,
        ...globalstarTLE,
        ...gorizontTLE,
        ...intelsatTLE,
        ...iridiumNextTLE,
        ...iridiumTLE,
        ...molniyaTLE,
        ...onewebTLE,
        ...orbcommTLE,
        ...otherCommTLE,
        ...radugaTLE,
        ...satnogsTLE,
        ...sesTLE,
        ...swarmTLE
    ]
};

const starlink = {
    color: starlinkColor,
    data: [
        ...starlinkTLE
    ]
};

const navigation = {
    color: navigationColor,
    data: [
        ...gnssTLE,
        ...gpsOperationalTLE,
        ...glonassOperationalTLE,
        ...galileoTLE,
        ...beidouTLE,
        ...satelliteBasedAugmentationSystemTLE,
        ...navyNavigationSatelliteSystemTLE,
        ...russianLeoNavigationTLE
    ]
};

const scientific = {
    color: scientificColor,
    data: [
        ...educationTLE,
        ...engineeringTLE,
        ...geodeticTLE,
        ...spaceEarthScienceTLE
    ]
};

const miscellaneous = {
    color: miscellaneousColor,
    data: [
        ...miscellaneousMilitaryTLE,
        ...radarCalibrationTLE,
        ...otherSatellitesTLE,
        ...cubeSatsTLE
    ]
};

const combinedTLE = [
    debris,
    specialInterest,
    weatherEarth,
    communications,
    navigation,
    scientific,
    miscellaneous,
    starlink
];

export { combinedTLE };