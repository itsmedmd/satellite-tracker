import styles from "styles/loader.module.css";

const Loader = () => {
    return (
        <div className={styles["loader"]}>
          <div className={styles["loader-content"]}>
            <div className={styles["circle"]}>
              <div className={styles["half-circle"]}></div>
            </div>
            <div className={styles["object"]}></div>
          </div>
          <p className={styles["text"]}>Loading 3D assets</p>
        </div>
    );
};

export default Loader;
