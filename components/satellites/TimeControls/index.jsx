import { useState } from "react";
import styles from "./index.module.scss";

const TimeControls = ({
  handleMultiplierChange,
  isNavOpen,
  isAboutOpen
}) => {
  const [inputMultiplier, setInputMultiplier] = useState(0);
  const [exponentialMultiplier, setExponentialMultiplier] = useState(0);
  const range = 100;

  const handleTimeChange = (e) => {
    setInputMultiplier(e.target.value);

    let expMultiplier = 0;
    if (Math.abs(e.target.value) < 2) {
      // set time as stopped
      expMultiplier = 0;
    } else {
      // calculate exponentially rising multiplier
      expMultiplier = Math.round(Math.exp((Math.log(range*100)/range) * Math.abs(e.target.value)));
      if (e.target.value < 0) {
        expMultiplier = expMultiplier * -1;
      }
    }

    setExponentialMultiplier(expMultiplier);
    handleMultiplierChange(expMultiplier);
  };

  const stopTime = () => {
    setInputMultiplier(0);
    setExponentialMultiplier(0);
    handleMultiplierChange(0);
  };

  return (
    <div
      className={`
        ${styles["time-controls"]}
        ${isNavOpen ? styles["nav-open"] : ""}
        ${isAboutOpen ? styles["about-open"] : ""}
      `}
    >
      <p className={styles["time-text"]}>
        Time flow multiplier:
        <span className={styles["bold"]}>
          {
            exponentialMultiplier === 0 ?
              " 0x (Stopped)" :
              ` ${exponentialMultiplier}x`
          }
        </span>
        {
          exponentialMultiplier !== 0 &&
          <button
            className={styles["stop-time"]}
            onClick={stopTime}
          >
            Stop
          </button>
        }
      </p>
      <input
        type="range"
        className={styles["time-range"]}
        min={-range}
        max={range}
        value={inputMultiplier}
        onChange={handleTimeChange}
      />
    </div>
  );
};

export default TimeControls;
