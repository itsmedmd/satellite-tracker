import Link from "next/link";
import Head from "next/head";

import Layout from "@/components/shared/Layout";
import styles from "@/styles/pages/404.module.scss";

const NotFound = () => {
  return (
    <Layout hideOverflow={true}>
      <Head>
        <title>Page not found</title>
      </Head>

      <div className={styles["not-found"]}>
        <h1 className={styles["heading"]}>
          This page does not exist.
        </h1>
        <Link href="/">
          <a className={styles["link"]}>Go to home page</a>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
