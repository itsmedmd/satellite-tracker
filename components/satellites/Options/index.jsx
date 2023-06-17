// utils
import { useState, memo } from "react";

// components and styles
import styles from "@/styles/shared/CesiumOptions.module.scss";
import OptionsContent from "@/components/satellites/OptionsContent";
import Search from "@/components/satellites/Search";

const Options = ({
  objectCategories,
  entities,
  toggleCategoryVisibility,
  handleOptionsToggle,
  handleAboutToggle,
  selectEntity,
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    handleOptionsToggle(!searchVisible);
  };

  const toggleOptions = () => {
    setOptionsVisible(!optionsVisible);
    handleOptionsToggle(!optionsVisible);
  };

  const toggleAboutPage = () => {
    setAboutVisible(!aboutVisible);
    handleAboutToggle(!aboutVisible);
  };

  const handleEntitySelect = (id) => {
    selectEntity(id);
    toggleSearch(!searchVisible);
  };

  return (
    optionsVisible
      ?
      <OptionsContent
        isAboutVisible={aboutVisible}
        toggleOptions={toggleOptions}
        toggleAboutPage={toggleAboutPage}
        objectCategories={objectCategories}
        toggleCategoryVisibility={toggleCategoryVisibility}
      />
      : searchVisible
        ?
        <Search
          toggleSearch={toggleSearch}
          entities={entities}
          selectEntity={handleEntitySelect}
        />
        :
        <div className={styles["nav-buttons"]}>
          <button
            onClick={toggleOptions}
            className={styles["nav-toggle"]}
          >
            Options
          </button>
          <button
            onClick={toggleSearch}
            className={styles["nav-toggle"]}
          >
            Search
          </button>
        </div>
  );
};

export default memo(Options);
