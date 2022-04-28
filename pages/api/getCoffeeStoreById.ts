// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
import table, {getMinifiedRecords} from "../../lib/airtable";
// types
import type {NextApiRequest, NextApiResponse} from "next";

const getCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const {id} = req.query;

  try {
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
        res.json({message: `Id could not be found`});
      }
    } else {
      res.status(400);
      res.json({message: "Id is missing"});
    }
  } catch (error) {
    res.status(500);
    res.json({message: "Something went wrong", error});
  }
};

export default getCoffeeStoreById;
