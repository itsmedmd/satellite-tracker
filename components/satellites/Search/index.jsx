// utils
import { memo, useState, useCallback, useEffect } from "react";
import { debounce } from "debounce";
import { useDispatch, useSelector } from "react-redux";
import { setSearchFilterValue, setShowingSearchItemsCount } from "@/store/reducers/satellitesSlice";
const getUTCDate = require("@/utils/shared/getUTCDate");

// components and styles
import sharedStyles from "@/styles/shared/CesiumOptions.module.scss";
import styles from "./index.module.scss";

const Search = ({ entities, toggleSearch, selectEntity }) => {
  const itemsChangeCount = 30;
  const dispatch = useDispatch();
  const searchFilterValue = useSelector((state) => state.satellites.searchFilterValue);
  const showingSearchItemsCount = useSelector((state) => state.satellites.showingSearchItemsCount);
  const [inputSearchValue, setInputSearchValue] = useState("");

  useEffect(() => {
    setInputSearchValue(searchFilterValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // only set on initialization

  // Debounce search filtering
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearchChange = useCallback(
    debounce((value) => dispatch(setSearchFilterValue(value)), 300),
    [dispatch]
  );
  
  const handleInputChange = (e) => {
    setInputSearchValue(e.target.value); // this value is used only for input
    handleSearchChange(e.target.value.trim().toLowerCase());
  };

  const increaseShowingCount = () => {
    dispatch(setShowingSearchItemsCount(showingSearchItemsCount + itemsChangeCount));
  };

  const decreaseShowingCount = () => {
    const newCount = showingSearchItemsCount - itemsChangeCount;

    // Do not allow to set a very low amount
    if (newCount > 20) {
      dispatch(setShowingSearchItemsCount(newCount));
    }
  };

  const renderItems = () => {
    let items = entities;

    if (searchFilterValue) {
      items = entities.filter((item) =>
        item.name.includes(searchFilterValue)
        || item.categoryName.includes(searchFilterValue)
        || item.satnum.includes(searchFilterValue)
      );
    }

    return items
      .sort((a, b) => b.epochDate - a.epochDate)
      .slice(0, showingSearchItemsCount)
      .map((entity) => (
        entity
          ?
          <div key={entity.id}>
            <span>{entity.name}</span>
            <span>{entity.satnum}</span>
            <span>{entity.categoryName}</span>
            <span>{getUTCDate(entity.epochDate)}</span>
            <span>
              <button
                disabled={!entity.visible}
                onClick={() => selectEntity(entity.id)}
                className={!entity.visible ? styles["disabled-button"] : ""}
                title={entity.visible ? "Start tracking entity" : "Satellite category is hidden"}
              >
                Select
              </button>
            </span>
          </div>
          :
          null
      ));
  };

  return (
    <div
      className={`
        ${sharedStyles["navigation"]}
        ${sharedStyles["search"]}
      `}
    >
      <button
        onClick={toggleSearch}
        className={`
          ${sharedStyles["nav-toggle"]}
          ${sharedStyles["nav-open"]}
          ${sharedStyles["nav-sticky"]}
        `}
      >
        Close search
      </button>
      <div className={styles["search-container"]}>
        <input
          type="text"
          value={inputSearchValue}
          onChange={handleInputChange}
          placeholder="Search satellite name, category name, satnum"
          className={`
            ${sharedStyles["nav-toggle"]}
            ${sharedStyles["nav-open"]}
            ${sharedStyles["nav-sticky"]}
            ${sharedStyles["search-input"]}
          `}
        />
        <button
          onClick={increaseShowingCount}
          title="Show more items"
        >
          +
        </button>
        <button
          onClick={decreaseShowingCount}
          title="Show less items"
        >
          -
        </button>
      </div>
      <div className={styles["search-results-container"]}>
        <div className={styles["head"]}>
          <div>
            <span>Name</span>
            <span>Satnum</span>
            <span>Category</span>
            <span>Data measurement time {"(UTC)"}</span>
            <span>Action</span>
          </div>
        </div>
        <div className={styles["body"]}>
          { renderItems() }
        </div>
      </div>
    </div>
  );
};

export default memo(Search);
