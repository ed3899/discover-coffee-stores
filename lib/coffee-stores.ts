const getUrlForCoffeeStores = (
  query: string,
  categories: number,
  nearByLocation: string,
  limit: number
) =>
  `https://api.foursquare.com/v3/places/search?query=${query}&categories=${categories.toString()}&near=${encodeURIComponent(
    nearByLocation
  )}&limit=${limit.toString()}`;

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

  //lacks mapping data
  console.log(data);

  return data;
};
