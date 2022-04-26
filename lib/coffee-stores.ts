//% libs
import {createApi} from "unsplash-js";

// unsplash
const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY!,
});

const getUrlForCoffeeStores = (
  query: string,
  categories: number,
  nearByLocation: string,
  limit: number
) =>
  `https://api.foursquare.com/v3/places/search?query=${query}&categories=${categories.toString()}&near=${encodeURIComponent(
    nearByLocation
  )}&limit=${limit.toString()}`;

const getListOfCoffeeStoresPhotos = async () => {
  const {response} = await unsplashApi.search
    .getPhotos({
      query: "coffee shop",
      perPage: 10,
    })
    .catch(err => {
      throw new Error(`err fetching photos from unsplash ${err}`);
    });

  const unsplashResults = response?.results.map(result => result.urls.small);

  return unsplashResults;
};

type CoffeeStoreT = {
  fsq_id: string;
  categories: [[unknown]];
  chains: [[unknown]];
  distance: number;
  geocodes: {main: [unknown]};
  link: string;
  location: {
    address: string;
    country: string;
    cross_street: string;
    formatted_address: string;
    locality: string;
    postcode: string;
    region: string;
    neighborhood?: string[];
  };
  name: string;
  related_places: unknown;
  timezone: string;
};
export const fetchCoffeeStores = async () => {
  // "https://api.foursquare.com/v3/places/search?query=coffee-shop&categories=13035&near=Merida%2CMexico&limit=6"

  const photos = await getListOfCoffeeStoresPhotos();

  const url = getUrlForCoffeeStores("coffee-shop", 13035, "Merida,Mexico", 6);
  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY!,
    },
  };
  const res = await fetch(url, options).catch(err => {
    throw new Error(`fetching res error ${err}`);
  });

  const resToJson = await (res as Response).json().catch(err => {
    throw new Error(`resToJson Error ${err}`);
  });

  const data = resToJson.results as CoffeeStoreT[];

  //   //lacks mapping data
  //   console.log(data);

  const coffeeStores = data.map((coffeeStore, idx) => {
    return {
      ...coffeeStore,
      imgUrl:
        (photos && photos[idx]) ??
        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80",
    };
  });

  return coffeeStores;
};
