// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
// external
import Airtable, {Record} from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(
  process.env.AIRTABLE_BASE_KEY!
);

const table = base("coffee-stores");

const createCoffeeStore = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    try {
      // find record
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="0"`,
        })
        .firstPage();

      console.group("createCoffeeStoreApi");
      console.log({findCoffeeStoreRecords});

      if (findCoffeeStoreRecords.length !== 0) {
        const records = findCoffeeStoreRecords.map(record => {
          return {
            ...record.fields,
          };
        });
        res.json(records);
      } else {
        // create record
        res.json({message: "create record"});
      }
    } catch (error) {
      console.error(`Error finding  store ${error}`);
      res.status(500);
      res.json({message: `Error finding store ${error}`});
    }
  }
};

export default createCoffeeStore;
