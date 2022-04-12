import { Suspense, lazy } from 'react';
import Head from 'next/head';
import Layout from "components/Layout";
import CesiumView from "components/CesiumView";

export const getStaticProps = async () => {
  const token = process.env.CESIUM_TOKEN;
  return {
    props: {
      token
    },
  }
};

const Home = ({token}) => {
  return (
    <Layout>
      <Head>
        <title>Deimantas Butėnas - Satellite Tracker</title>
      </Head>
      <CesiumView token={token}/>
    </Layout>
  )
};

export default Home;
