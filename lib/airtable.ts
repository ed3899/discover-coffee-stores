import Airtable, {Record, Records} from "airtable";

const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY}).base(
  process.env.AIRTABLE_BASE_KEY!
);

export type AirtableData = {
  vote: number;
  id: string;
  name: string;
  address: string;
  neighbourhood: string;
  imgUrl: string;
};

const table = base<AirtableData>("coffee-stores");

const getMinifiedRecord = (record: Record<AirtableData>) => ({
  recordId: record.id,
  ...record.fields,
});
export const getMinifiedRecords = (records: Records<AirtableData>) => {
  return records.map(getMinifiedRecord);
};

export const findRecordByFilter = async (id: string) => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export default table;
