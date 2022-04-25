//% libs
import type {NextPage} from "next";
import Head from "next/head";
//types
import {GetStaticProps, InferGetStaticPropsType} from "next";

//% components

// native
import Image from "next/image";

//
import Banner from "../components/banner";
import Card from "../components/card";

//% styles
import styles from "../styles/Home.module.css";

//% data
import coffeeStores from "../data/coffee-stores.json";

export const getStaticProps = async () => {
  return {
    props: {
      coffeeStores,
    },
  };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  coffeeStores,
}) => {
  const handleOnBannerBtnClick = () => {
    console.log("Wuju");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick}
        />

        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </div>

        <div className={styles.cardLayout}>
          {coffeeStores.map(coffeeStore => {
            return (
              <Card
                name={coffeeStore.name}
                imgUrl={coffeeStore.imgUrl}
                href={`/coffee-store/${coffeeStore.id}`}
                className={styles.card}
                key={coffeeStore.id}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Home;
