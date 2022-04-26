//% libs
import {createApi} from "unsplash-js";

// unsplash
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
});

const getUrlForCoffeeStores = (
  _query: string,
  _latLong: string,
  _categories: number,
  _limit: number
) => {
  //https://api.foursquare.com/v3/places/search?query=coffee-shop&ll=20.400417%2C-89.134857&categories=13035&limit=6

  const cleanedString = _latLong
    .trim()
    .split("")
    .filter(l => l !== " ")
    .join("");

  const latLong = encodeURIComponent(cleanedString);

  return `https://api.foursquare.com/v3/places/search?query=${_query}&ll=${latLong}&categories=${_categories.toString()}&limit=${_limit.toString()}`;
};

const getListOfCoffeeStoresPhotos = async () => {
  const {response} = await unsplashApi.search
    .getPhotos({
      query: "coffee shop",
      perPage: 40,
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
export const fetchCoffeeStores = async (
  _latlong: string = "20.400417,-89.134857",
  _limit: number = 6
) => {
  const photos = await getListOfCoffeeStoresPhotos();

  const url = getUrlForCoffeeStores("coffee-shop", _latlong, 13035, _limit);

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY!,
      "Access-Control-Allow-Origin": "*",
    },
  };
  const res = await fetch(url, options).catch(err => {
    console.log({url, options});
    throw new Error(`fetching res error ${err}`);
  });

  const resToJson = await (res as Response).json().catch(err => {
    throw new Error(`resToJson Error ${err}`);
  });

  const data = resToJson.results as CoffeeStoreT[];

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
