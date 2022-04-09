import { useState, memo } from "react";
import ObjectFiltering from "./ObjectFiltering";
import styles from "styles/navigation.module.css";

const Navigation = ({ objectCategories, changeCategoryVisibility, handleNavToggle }) => {
    const [navVisible, setNavVisible] = useState(false);

    const toggleNav = () => {
        setNavVisible(!navVisible);
        handleNavToggle(!navVisible);
    };

    const openAboutPage = () => {
        console.log("opening about page");
    };

    return (
        <>
            {
                navVisible ?
                <div className={styles["navigation"]}>
                    <button
                        onClick={toggleNav}
                        className={`${styles["nav-toggle"]} ${navVisible ? styles["nav-open"]: ""}`}
                    >
                        Close options
                    </button>
                    <button
                        onClick={openAboutPage}
                        className={styles["about-page-title"]}
                    >
                        Learn about this project
                    </button>
                    <ObjectFiltering
                        objectCategories={objectCategories}
                        changeCategoryVisibility={changeCategoryVisibility}
                    />
                </div> :
                <button
                    onClick={toggleNav}
                    className={`${styles["nav-toggle"]} ${navVisible ? styles["nav-open"]: ""}`}
                >
                    Options
                </button>
            }
        </>
    );
};

export default memo(Navigation);
