import { useEffect, useState } from "react";
import styles from "styles/object-filtering.module.css";

const ObjectFiltering = ({ objectCategories, changeCategoryVisibility }) => {
    const [categories, setCategories] = useState([]);

    const handleCategoryChange = (name) => {
        changeCategoryVisibility(name);
    };

    const renderCategories = () => {
        return categories.map((category) => 
            <li key={category.name} className={styles["list-item"]}>
                <input
                    type="checkbox"
                    id={category.name}
                    checked={category.visible}
                    onChange={() => handleCategoryChange(category.name)}
                />
                <label htmlFor={category.name}>
                    {category.name}
                </label>
            </li>
        );
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
