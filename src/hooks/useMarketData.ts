import { useEffect, useState } from "react";
import { request } from "../api/api";

const useMarketData = () => {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    request("http://localhost:4000/marketData")
      .then((response) => {
        setMarketData(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return { marketData };
};

export default useMarketData;
