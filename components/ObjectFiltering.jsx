import { useEffect, useState } from "react";
import styles from "styles/object-filtering.module.css";

const ObjectFiltering = ({ objectCategories, changeCategoryVisibility }) => {
    const [categories, setCategories] = useState([]);

    const handleCategoryChange = (name) => {
        changeCategoryVisibility(name);
    };

    const renderCategories = () => {
        return categories.map((cat) => {
            const backgroundColor = `rgba(
                ${cat.color.red * 255},
                ${cat.color.green * 255},
                ${cat.color.blue * 255},
                ${cat.color.alpha}
            )`;
            return (
                <li key={cat.name} className={styles["list-item"]}>
                    <input
                        type="checkbox"
                        id={cat.name}
                        checked={cat.visible}
                        onChange={() => handleCategoryChange(cat.name)}
                    />
                    <div
                        className={styles["circle"]}
                        style={{"backgroundColor": backgroundColor}}
                    ></div>
                    <label htmlFor={cat.name}>
                        {cat.name}
                    </label>
                </li>
            );
        });
    };

    useEffect(() => {
        setCategories(objectCategories);
    }, [objectCategories]);

    return (
        <div className={styles["object-filtering"]}>
            <p className={styles["title"]}>Object visibility:</p>
            <ul className={styles["list"]}>
                { categories.length && renderCategories() }
            </ul>
        </div>
    );
};

export default ObjectFiltering;
