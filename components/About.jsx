import styles from "styles/about.module.css";

const About = () => {
    return (
        <div className={styles["about"]}>
            <div className={styles["content"]}>
                <p>
                    This project uses publicly available satellite TLE (Two-Line Element) data sets that are
                    easily accessible and provided by <a href="https://celestrak.com/NORAD/elements/"> CelesTrak</a>.
                </p>
                <p>
                    To make any practical use of the TLE data, the project uses Shashwat Kandadai's JavaScript library called
                    <a href="https://github.com/shashwatak/satellite-js"> satellite.js </a>
                    for satellite position propagation via TLE data sets that
                    contain orbital information about each object.
                </p>
                <p>
                    All objects are then rendered in a 3D geospatial viewer provided by
                    <a href="https://cesium.com"> Cesium</a>. By the nature of the data contained within
                    TLE sets, it is possible to determine the position of each object at any given moment
                    in time, be it the present, the future or the past. The project makes use of this feature
                    with the &quot;time flow multiplier&quot; slider.
                </p>
            </div>
        </div>
    );
};

export default About;
