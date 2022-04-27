//% libs
// native
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";

// external
import cls from "classnames";

// local
import {CoffeeStoreT, fetchCoffeeStores} from "../../lib/coffee-stores";
import {isEmpty} from "../../utils";

//types
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPage,
} from "next";

//% components
// native
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

// context
import {StoreContext} from "../_app";

//% styles
import styles from "../../styles/coffee-store.module.css";

//% data

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find(
    coffeeStore => coffeeStore.fsq_id === params!.id //dynamic id
  );

  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map(coffeeStore => {
    return {
      params: {
        id: coffeeStore.fsq_id,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<
  InferGetStaticPropsType<typeof getStaticProps>
> = initialProps => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  const id = router.query.id as string;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const {
    state: {coffeeStores},
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find(
          coffeeStore => coffeeStore.fsq_id === id
        );

        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [id]);

  //handlers
  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };

  return (
    (coffeeStore as any).location && (
      <div className={styles.layout}>
        <Head>
          <title>{(coffeeStore as CoffeeStoreT).name}</title>
        </Head>

        <div className={styles.backToHomeLink}>
          <Link href="/">
            <a> ⟸ Back to home</a>
          </Link>
        </div>

        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>
                {(coffeeStore as CoffeeStoreT).name}
              </h1>
            </div>

            <Image
              src={
                (coffeeStore as CoffeeStoreT & {imgUrl: string}).imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={(coffeeStore as CoffeeStoreT).name}
            />
          </div>

          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={50} height={50} />
              <p className={styles.text}>
                {(coffeeStore as CoffeeStoreT).location.formatted_address}
              </p>
            </div>

            {(coffeeStore as CoffeeStoreT).location.neighborhood && (
              <div className={styles.iconWrapper}>
                <Image src="/static/icons/places.svg" width={50} height={50} />
                <p className={styles.text}>
                  {(coffeeStore as CoffeeStoreT).location.neighborhood![0]}
                </p>
              </div>
            )}

            <div className={styles.iconWrapper}>
              <Image src="/static/icons/star.svg" width={50} height={50} />
              <p className={styles.text}>1</p>
            </div>

            <button
              className={styles.upvoteButton}
              onClick={handleUpvoteButton}>
              Up vote!
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CoffeeStore;
