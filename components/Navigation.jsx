import { useState, memo } from "react";
import ObjectFiltering from "./ObjectFiltering";
import styles from "styles/navigation.module.css";
import About from "components/About";

const Navigation = ({
    objectCategories,
    changeCategoryVisibility,
    handleNavToggle,
    handleAboutToggle
}) => {
    const [navVisible, setNavVisible] = useState(false);
    const [aboutVisible, setAboutVisible] = useState(false);

    const toggleNav = () => {
        const newVal = !navVisible;
        setNavVisible(newVal);
        handleNavToggle(newVal);
    };

    const toggleAboutPage = () => {
        const newVal = !aboutVisible;
        setAboutVisible(newVal);
        handleAboutToggle(newVal);
    };

    return (
        <>
            {
                navVisible ?
                (
                    <div
                        className={`
                            ${styles["navigation"]}
                            ${aboutVisible ? styles["about-open"] : ""}
                        `}
                    >
                        {
                            aboutVisible ?
                            (
                                <>
                                    <button
                                        onClick={toggleAboutPage}
                                        className={styles["about-page-toggle"]}
                                    >
                                        Go back
                                    </button>
                                    <About/>
                                </>
                            ) :
                            (
                                <>
                                    <button
                                        onClick={toggleNav}
                                        className={`
                                            ${styles["nav-toggle"]}
                                            ${navVisible ? styles["nav-open"]: ""}
                                        `}
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
                                        changeCategoryVisibility={changeCategoryVisibility}
                                    />
                                </>
                            )
                        }
                    </div>
                ) :
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
