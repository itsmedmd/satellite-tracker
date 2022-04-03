import { useState, memo } from "react";
import ObjectFiltering from "./ObjectFiltering";
import styles from "styles/navigation.module.css";

const Navigation = ({ objectCategories, changeCategoryVisibility }) => {
    const [navVisible, setNavVisible] = useState(false);

    const toggleNav = () => {
        setNavVisible(!navVisible);
    };

    const openAboutPage = () => {
        console.log("opening about page");
    };

    return (
        <>
            <div className={styles["nav-toggle"]}>
                <button onClick={toggleNav}>Toggle Navigation</button>
            </div>
            {
                navVisible &&
                <div className={styles["navigation"]}>
                    <button onClick={openAboutPage}>About</button>
                    <ObjectFiltering
                        objectCategories={objectCategories}
                        changeCategoryVisibility={changeCategoryVisibility}
                    />
                </div>
            }
        </>
    );
};

export default memo(Navigation);
