import Link from "next/link";
import Head from 'next/head';
import Layout from "components/Layout";
import styles from "styles/404.module.css";

const NotFound = () => {
  return (
    <Layout>
      <Head>
        <title>Deimantas Butėnas - Satellite Tracker - Page not found</title>
      </Head>
      
      <div className={styles["not-found"]}>
        <h1 className={styles["not-found__heading"]}>
          This page does not exist.
        </h1>
        <Link href="/">
          <a className={styles["not-found__link"]}>Go to home page</a>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
