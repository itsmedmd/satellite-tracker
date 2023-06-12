import styles from "./index.module.scss";

const Layout = ({ children }) => {
  return (
    <div className={styles["layout"]}>
      <main className={styles["main"]}>
        { children }
      </main>
    </div>
  );
};

export default Layout;
