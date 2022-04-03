import ObjectFiltering from "./ObjectFiltering";
import styles from "styles/navigation.module.css";

const Navigation = () => {
    const openAboutPage = () => {
        console.log("opening about page");
    };

    return (
        <div className={styles["navigation"]}>
            <button onClick={openAboutPage}>About</button>
            <ObjectFiltering/>
        </div>
    );
};

export default Navigation;
