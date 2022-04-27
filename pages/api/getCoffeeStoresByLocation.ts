// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
// local
import {fetchCoffeeStores} from "../../lib/coffee-stores";

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

type Data = (CoffeeStoreT & {imgUrl: string})[] | unknown;

const getCoffeeStoresByLocation = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const {_latLong, _limit} = req.query;

  // Safeguards for both const are needed, we'll go with the asumption that they're both always a string
  const latLong = (_latLong as string)
    .trim()
    .split("")
    .filter(l => l !== " ")
    .join("");

  const limit = Number(_limit as string);

  try {
    const response = await fetchCoffeeStores(latLong, limit);

    res.status(200);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({
      message: "Oh no! Something went wrong",
      error,
    });
  }
};

export default getCoffeeStoresByLocation;
