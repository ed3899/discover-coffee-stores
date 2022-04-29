//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";
import table, {
  findRecordByFilter,
  getMinifiedRecords,
} from "../../lib/airtable";

const favouriteCoffeeStoreById = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === "PUT") {
    try {
      const {id} = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          const record = records[0];

          const calculateVoting = Number(record.vote) + 1;

          //update a record

          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                vote: calculateVoting,
              },
            },
          ]);

          if (updateRecord) {
            const minifiedRecords = getMinifiedRecords(updateRecord);

            res.json(minifiedRecords);
          }
        } else {
          res.json({message: "Coffee store id doesn't exist", id});
        }
      } else {
        res.status(400);
        res.json({message: "Id is missing"});
      }
    } catch (error) {
      res.status(500);
      res.json({message: "Error upvoting our coffee store", error});
    }
  } else {
    res.status(500);
    res.json({message: "Wrong request"});
  }
};

export default favouriteCoffeeStoreById;
