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

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    // find record
    const findCoffeeStoreRecords = await table
      .select({
        filterByFormula: `id="0"`,
      })
      .firstPage();

    console.group("createCoffeeStoreApi");
    console.log({findCoffeeStoreRecords});

    if (findCoffeeStoreRecords.length !== 0) {
      res.json(findCoffeeStoreRecords);
    } else {
      // create record
      res.json({message: "create record"});
    }
  }
};

export default createCoffeeStore;
