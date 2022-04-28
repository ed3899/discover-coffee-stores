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
  ...record.fields,
});
export const getMinifiedRecords = (records: Records<AirtableData>) => {
  return records.map(getMinifiedRecord) as AirtableData[];
};

export default table;