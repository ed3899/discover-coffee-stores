//% libs
import {useRouter} from "next/router";
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

  if (router.isFallback) {
    return <div>Loading</div>;
  } else if (coffeeStore) {
    const {address, name, neighbourhood} = coffeeStore;
    return (
      <div>
        <Head>
          <title>{name}</title>
        </Head>
        <Link href="/">
          <a>Back to home</a>
        </Link>
        <p>{address}</p>
        <p>{name}</p>
        <p>{neighbourhood}</p>
      </div>
    );
  } else {
    return <div>No content</div>;
  }
};

export default CoffeeStore;
