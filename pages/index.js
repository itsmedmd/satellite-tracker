import { useState } from 'react';
import Head from 'next/head';

import Layout from "components/Layout";
import CesiumView from "components/CesiumView";
import Loader from "components/Loader";

export const getStaticProps = async () => {
  const token = process.env.CESIUM_TOKEN;
  return {
    props: {
      token
    },
  }
};

const Home = ({token}) => {
  const [isLoading, setIsLoading] = useState(true);

  const setLoadingStatus = (val) => {
    setIsLoading(val);
  };

  return (
    <Layout>
      <Head>
        <title>Deimantas Butėnas - Satellite Tracker</title>
      </Head>
      {isLoading && <Loader/>}
      <CesiumView token={token} setLoadingStatus={setLoadingStatus}/>
    </Layout>
  )
};

export default Home;
