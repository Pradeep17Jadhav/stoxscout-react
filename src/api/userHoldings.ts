import { request } from "./api";

export const getUserHoldings = () => request("http://localhost:4000/holdings");
