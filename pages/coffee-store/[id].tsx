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
  return {
    paths: [{params: {id: "1"}}],
    fallback: false,
  };
};

const CoffeeStore: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  coffeeStore,
}) => {
  const router = useRouter();
  return (
    <div>
      Coffee Store Page {router.query.id}
      <Link href="/">
        <a>Back to home</a>
      </Link>
      <p>{coffeeStore?.address}</p>
      <p>{coffeeStore?.name}</p>
    </div>
  );
};

export default CoffeeStore;
