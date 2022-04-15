import { useEffect, useState } from "react";

import styles from "styles/time-controls.module.css";

const TimeControls = ({
    clockDate,
    handleMultiplierChange,
    isNavOpen,
    isAboutOpen
}) => {
    const [timeMultiplier, setTimeMultiplier] = useState(0);
    const [currentDate, setCurrentDate] = useState(null);

    const handleTimeChange = (e) => {
        let multiplier = 0;
        if (Math.abs(e.target.value) < 2) {
            // set time as stopped
            multiplier = 0;
        } else {
            // calculate exponentially rising multiplier
            multiplier = Math.round(Math.exp((Math.log(10000)/100) * Math.abs(e.target.value)));
            if (e.target.value < 0) {
                multiplier = multiplier * -1;
            }
        }

        setTimeMultiplier(multiplier);
        handleMultiplierChange(multiplier);
    };

    useEffect(() => {
        setCurrentDate(clockDate.toLocaleString("lt-LT"));
    }, [clockDate]);

    return (
        <div
            className={`
                ${styles["time-controls"]}
                ${isNavOpen ? styles["nav-open"] : ""}
                ${isAboutOpen ? styles["about-open"] : ""}
            `}
        >
            <div className={styles["time-text-container"]}>
                <p className={styles["time-text"]}>
                    {
                        currentDate === "Invalid Date" ?
                        (new Date()).toLocaleString("lt-LT") :
                        currentDate
                    }
                </p>
                <p className={styles["time-text"]}>
                    Time flow multiplier:
                    <span className={styles["time-text-bold"]}>
                        {
                            timeMultiplier === 0 ?
                            " 0x (Stopped)" :
                            ` ${timeMultiplier}x`
                        }
                    </span>
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
