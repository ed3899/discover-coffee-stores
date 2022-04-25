//% libs
import {useRouter} from "next/router";
import cls from "classnames";
//types
import {
  GetStaticPaths,
  GetStaticProps,
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
import coffeeStoreData from "../../data/coffee-stores.json";

export const getStaticProps = ({params}: GetStaticPropsContext) => {
  return {
    props: {
      coffeeStore: coffeeStoreData.find(
        coffeeStore => coffeeStore.id.toString() === params!.id
      ),
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = coffeeStoreData.map(coffeeStore => {
    return {
      params: {
        id: coffeeStore.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const CoffeeStore: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  coffeeStore,
}) => {
  const router = useRouter();

  //handlers
  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };

  if (router.isFallback) {
    return <div>Loading</div>;
  } else if (coffeeStore) {
    const {address, name, neighbourhood, imgUrl} = coffeeStore;
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>

        <div className={styles.backToHomeLink}>
          <Link href="/">
            <a>Back to home</a>
          </Link>
        </div>
        
        <div className={styles.container}>
          <div className={styles.col1}>
            <div className={styles.nameWrapper}>
              <h1 className={styles.name}>{name}</h1>
            </div>

            <Image
              src={imgUrl}
              width={600}
              height={360}
              className={styles.storeImg}
              alt={name}
            />
          </div>

          <div className={cls("glass", styles.col2)}>
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width={50} height={50} />
              <p className={styles.text}>{address}</p>
            </div>

            <div className={styles.iconWrapper}>
              <Image src="/static/icons/places.svg" width={50} height={50} />
              <p className={styles.text}>{neighbourhood}</p>
            </div>

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
