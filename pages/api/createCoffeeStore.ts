// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
// external
import Airtable from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(
  process.env.AIRTABLE_BASE_KEY!
);

type AirtableData = {
  vote: number;
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  imgUrl: string;
};

const table = base<AirtableData>("coffee-stores");

type Data = AirtableData[] | any;

const createCoffeeStore = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  if (req.method === "POST") {
    const {id, neighbourhood, address, name, imgUrl, vote} =
      req.body as AirtableData;
    try {
      // find record

      if (id) {
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`,
          })
          .firstPage();

        console.group("createCoffeeStoreApi");
        console.log({findCoffeeStoreRecords});

        if (findCoffeeStoreRecords.length !== 0) {
          const records = findCoffeeStoreRecords.map(record => {
            return {
              ...record.fields,
            };
          }) as AirtableData[];

          res.json(records);
        } else {
          // create record

          if (name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  vote,
                  imgUrl,
                },
              },
            ]);

            const records = createRecord.map(record => {
              return {
                ...record.fields,
              };
            }) as AirtableData[];

            console.groupEnd();

            res.json({records});
          } else {
            res.status(400);
            res.json({message: "Name is missing"});
          }
        }
      } else {
        res.status(400);
        res.json({message: "Id missing"});
      }
    } catch (error) {
      console.error(`Error creating or finding store ${error}`);
      res.status(500);
      res.json({message: `Error creating or finding store ${error}`});
    }
  }
};

export default createCoffeeStore;
