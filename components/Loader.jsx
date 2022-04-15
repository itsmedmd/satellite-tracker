import styles from "styles/loader.module.css";

const Loader = () => {
    return (
        <div className={styles["loader"]}>
          <div className={styles["circle"]}></div>
          <p className={styles["text"]}>Loading 3D assets</p>
        </div>
    );
};

export default Loader;
