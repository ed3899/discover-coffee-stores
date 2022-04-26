//% libs
import type {NextPage} from "next";
import Head from "next/head";
import {fetchCoffeeStores} from "../lib/coffee-stores";
//types
import {InferGetStaticPropsType} from "next";

//% components

// native
import Image from "next/image";

//
import Banner from "../components/banner";
import Card from "../components/card";

//% styles
import styles from "../styles/Home.module.css";

//% data

export const getStaticProps = async () => {
  const data = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: data,
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

        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(coffeeStore => {
                return (
                  <Card
                    name={coffeeStore.name}
                    imgUrl={
                      (coffeeStore as any).imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.fsq_id}`}
                    className={styles.card}
                    key={coffeeStore.fsq_id}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
