//% libs
// native
import {useRouter} from "next/router";
import {useContext, useEffect, useState} from "react";

// external
import cls from "classnames";
import useSWR from "swr";

// local
import {CoffeeStoreT, fetchCoffeeStores} from "../../lib/coffee-stores";
import {isEmpty, fetcher} from "../../utils";

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
import {StoreContext} from "../../store/store-context";

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
      coffeeStore: findCoffeeStoreById ?? {}, // Changed from using ternary
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

  const id = router.query.id as string;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: {coffeeStores},
  } = useContext(StoreContext);

  console.log(initialProps.coffeeStore);

  /**
   * @abstract Creates a new coffee stores or returns one if it already exists.
   * @async
   * @description Uses "/api/createCoffeeStore"
   * @param coffeeStore
   */
  const handleCreateCoffeeStore = async (
    coffeeStore: CoffeeStoreT & {imgUrl: string}
  ) => {
    try {
      const {
        fsq_id,
        name,
        imgUrl,
        location: {neighborhood, formatted_address},
      } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fsq_id,
          name,
          vote: 0,
          imgUrl,
          neighborhood: neighborhood || "",
          address: formatted_address || "",
        }),
      });

      const dbCoffeeStore = await response.json();

      // console.log({dbCoffeeStore});
    } catch (error) {
      console.error("Error creating coffee store", error);
    }
  };

  useEffect(() => {
    console.group("useEffect");
    console.log("useEffect");

    if (isEmpty(initialProps.coffeeStore)) {
      console.log(initialProps.coffeeStore);
      console.log("First if");
      console.log(`Coffee stores from context ${coffeeStores}`);
      if (coffeeStores.length > 0) {
        console.log("Second if");
        const coffeeStoreFromContext = coffeeStores.find(
          coffeeStore => coffeeStore.fsq_id === id
        );

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      //! Safeguard against an undefined value

      if (initialProps.coffeeStore) {
        handleCreateCoffeeStore(
          initialProps.coffeeStore as CoffeeStoreT & {imgUrl: string}
        );
      }
    }
    console.groupEnd();
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);

  // const {
  //   name = "",
  //   imgUrl = "",
  //   location: {neighborhood = "", formatted_address = ""},
  // } = coffeeStore as CoffeeStoreT & {
  //   imgUrl: string;
  // };

  const [votingCount, setVotingCount] = useState(0);

  //! Change type

  const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      console.log("data from swr", data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].vote);
    }
  }, [data]);

  if (router.isFallback) {
    return <div>Loading</div>;
  }

  //handlers
  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
      console.error("Error upvoting the coffee store", error);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  //! Conditional rendering based on two components
  return (
    //! This is bad practice, ideally for conditional rendering an additional component should be created. But, for the sake of finishing this course it does the job
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
              {(coffeeStore as any).address ||
                ((coffeeStore as any).location &&
                  (coffeeStore as CoffeeStoreT).location.formatted_address)}
            </p>
          </div>

          {((coffeeStore as any) ||
            (coffeeStore as CoffeeStoreT).location.neighborhood) && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width={50} height={50} />
              <p className={styles.text}>
                {((coffeeStore as any).location &&
                  (coffeeStore as any).location.neighborhood) ||
                  (coffeeStore as any).neighbourhood}
              </p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={50} height={50} />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
