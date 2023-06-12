// utils
import { useState, useCallback } from "react";
import Head from "next/head";

// components and styles
import Layout from "@/components/shared/Layout";
import CesiumView from "@/components/satellites/CesiumView";
import PageLoader from "@/components/shared/PageLoader";

export const getStaticProps = async () => {
  // Get satellite launches from the last 30 days
  const promise = new Promise((resolve) => {
    fetch("https://celestrak.org/NORAD/elements/gp.php?GROUP=last-30-days&FORMAT=3le")
      .then((data) => data.text())
      .then((data) => resolve(data.split("\n")))
      .catch((err) => {
        console.error(err);
        resolve(null);
      });
  });

  const recentLaunches = await promise;

  return {
    props: {
      recentLaunches,
      token: process.env.CESIUM_TOKEN
    },
    revalidate: 3 * 60 * 60, // 3 hours in seconds
  };
};

const Satellites = ({ recentLaunches, token }) => {
  const [isLoading, setIsLoading] = useState(true);

  const setLoadingStatus = useCallback((status) => {
    setIsLoading(status);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Satellites tracker</title>
      </Head>

      <PageLoader
        isActive={isLoading}
        text="Loading..."
      />

      <CesiumView
        token={token}
        recentLaunches={recentLaunches}
        setLoadingStatus={setLoadingStatus}
      />
    </Layout>
  );
};

export default Satellites;
