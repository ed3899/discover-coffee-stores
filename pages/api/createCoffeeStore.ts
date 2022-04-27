// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
// external
import Airtable from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(
  process.env.AIRTABLE_BASE_KEY!
);

const table = base("coffee-stores");

const createCoffeeStore = (req: NextApiRequest, res: NextApiResponse) => {
  res.json({message: "Hi There"});
};

export default createCoffeeStore;
