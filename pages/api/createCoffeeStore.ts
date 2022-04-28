// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
// local
import table, {getMinifiedRecords} from "../../lib/airtable";
//types
import type {AirtableData} from "../../lib/airtable";

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

        // console.group("createCoffeeStoreApi");
        // console.log({findCoffeeStoreRecords});

        if (findCoffeeStoreRecords.length !== 0) {
          const records = getMinifiedRecords(findCoffeeStoreRecords);

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

            const records = getMinifiedRecords(createRecord);

            // console.groupEnd();

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
