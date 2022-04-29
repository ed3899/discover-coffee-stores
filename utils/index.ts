import {Fetcher} from "swr";
export const isEmpty = (obj: object) => {
  return obj && Object.keys(obj).length === 0;
};

export const fetcher: Fetcher<any> = (...args: any[]) => {
  const [input, init] = args;
  return fetch(input, init).then(res => res.json());
};
