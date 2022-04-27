//% libs
import {useRouter} from "next/router";
import cls from "classnames";
import {fetchCoffeeStores} from "../../lib/coffee-stores";
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

//% styles
import styles from "../../styles/coffee-store.module.css";

//% data

export const getStaticProps = async ({params}: GetStaticPropsContext) => {
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoreById = coffeeStores.find(
    coffeeStore => coffeeStore.fsq_id === params!.id
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
> = props => {
  const router = useRouter();

  //handlers
  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };

  if (router.isFallback) {
    return <div>Loading</div>;
  } else if (props.coffeeStore) {
    console.log(props.coffeeStore);

    return (
      <div className={styles.layout}>
        <Head>
          <title>{(props.coffeeStore as any).name}</title>
        </Head>

        <div className={styles.backToHomeLink}>
          <Link href="/">
            <a> ⟸ Back to home</a>
          </Link>
        </div>

        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{(props.coffeeStore as any).name}</h1>
            </div>

            <Image
              src={
                (props.coffeeStore as any).imgUrl ||
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              width={600}
              height={360}
              className={styles.storeImg}
              alt={(props.coffeeStore as any).name}
            />
          </div>

          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={50} height={50} />
              <p className={styles.text}>
                {(props.coffeeStore as any).formatted_address}
              </p>
            </div>

            {(props.coffeeStore as any).neighborhood && (
              <div className={styles.iconWrapper}>
                <Image src="/static/icons/places.svg" width={50} height={50} />
                <p className={styles.text}>
                  {(props.coffeeStore as any).neighborhood[0]}
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
    );
  } else {
    return <div>No content</div>;
  }
};

export default CoffeeStore;
