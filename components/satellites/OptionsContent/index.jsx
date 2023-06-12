// utils
import { memo } from "react";

// components and styles
import ObjectFiltering from "@/components/satellites/ObjectFiltering";
import About from "@/components/satellites/About";
import styles from "@/styles/shared/CesiumOptions.module.scss";

const OptionsContent = ({
  isAboutVisible,
  toggleOptions,
  toggleAboutPage,
  objectCategories,
  toggleCategoryVisibility,
}) => {
  return (
    <div
      className={`
        ${styles["navigation"]}
        ${isAboutVisible ? styles["about-open"] : ""}
      `}
    >
      {
        isAboutVisible ?
          <>
            <button
              onClick={toggleAboutPage}
              className={`
                ${styles["about-page-toggle"]}
                ${isAboutVisible ? styles["added-margin-left"] : ""}
              `}
            >
              Go back
            </button>
            <About/>
          </>
          :
          <>
            <button
              onClick={toggleOptions}
              className={`${styles["nav-toggle"]} ${styles["nav-open"]}`}
            >
              Close options
            </button>
            <button
              onClick={toggleAboutPage}
              className={styles["about-page-toggle"]}
            >
              Learn about this project
            </button>
            <ObjectFiltering
              objectCategories={objectCategories}
              toggleCategoryVisibility={toggleCategoryVisibility}
            />
          </>
      }
    </div>
  );
};

export default memo(OptionsContent);
