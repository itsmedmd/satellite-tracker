import Loader from "@/components/shared/Loader";
import styles from "./index.module.scss";

const PageLoader = ({ isActive, text }) => {
  return (
    <div
      className={isActive ? styles["page-loader"] : ""}
    >
      <Loader isActive={isActive} />
      {
        text && isActive &&
        <p className={styles["loader-text"]}>
          {text}
        </p>
      }
    </div>
  );
};

export default PageLoader;
