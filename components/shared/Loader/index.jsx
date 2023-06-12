import { useState, useEffect } from "react";
import styles from "./index.module.scss";

const Loader = ({ isActive }) => {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let timeout;
    if (!isActive) {
      timeout = setTimeout(() => setIsFinished(true), 500);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isActive]);

  return (
    <div
      className={`
        ${styles["loader"]}
        ${!isActive ? styles["invisible"] : ""}
        ${isFinished ? styles["finished"] : ""}
      `}
    >
      <div className={styles["spinner"]}></div>
      <div className={styles["spinner"]}></div>
      <div className={styles["spinner"]}></div>
      <div className={styles["spinner"]}></div>
      <div className={styles["center"]}></div>
    </div>
  );
};

export default Loader;
