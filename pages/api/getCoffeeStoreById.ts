// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//% libs
// native
import type {NextApiRequest, NextApiResponse} from "next";

const getCoffeeStoreById = (req: NextApiRequest, res: NextApiResponse) => {
  const {id} = req.query;

  try {
    if (id) {
      res.json({message: `id is created ${id}`});
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
