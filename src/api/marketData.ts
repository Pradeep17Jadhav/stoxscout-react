import { HttpMethod, request } from "./api";

export const getMarketData = () =>
  request("http://localhost:4000/marketData").catch(() => null);

export const setMarketData = (newFetchedData: any) =>
  request("http://localhost:4000/marketData", {
    body: newFetchedData,
    method: HttpMethod.POST,
  });
