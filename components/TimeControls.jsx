import { useEffect, useState } from "react";

import styles from "styles/time-controls.module.css";

const TimeControls = ({clockTime, handleMultiplierChange}) => {
    const [timeMultiplier, setTimeMultiplier] = useState(1);
    const [currentTime, setCurrentTime] = useState(null);

    const handleTimeChange = (e) => {
        // calculate exponentially rising multiplier
        let multiplier = Math.round(Math.exp((Math.log(10000)/100) * Math.abs(e.target.value)));
        if (e.target.value < 0) {
            multiplier = multiplier * -1;
        }
        setTimeMultiplier(multiplier);
        handleMultiplierChange(multiplier);
    };

    useEffect(() => {
        setCurrentTime(clockTime.toLocaleString("lt-LT"));
    }, [clockTime]);

    return (
        <div className={styles["time-controls"]}>
            <div className={styles["time-text-container"]}>
                <p className={styles["time-text"]}>
                    {
                        currentTime === "Invalid Date" ?
                        (new Date()).toLocaleString("lt-LT") :
                        currentTime
                    }
                </p>
                <p className={styles["time-text"]}>
                    Time flow multiplier:
                    <span className={styles["time-text-bold"]}> { timeMultiplier }x</span>
                </p>
            </div>
            <input
                type="range"
                className={styles["time-range"]}
                min="-100"
                max="100"
                onChange={handleTimeChange}
            />
        </div>
    );
};

export default TimeControls;
