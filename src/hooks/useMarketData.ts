import { useEffect, useState } from "react";
import { request } from "../api/api";

const useMarketData = () => {
  const [marketData, setMarketData] = useState([]);

  const fetchMarketData = () => {
    request("http://localhost:4000/marketData")
      .then((response) => {
        setMarketData(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    fetchMarketData();
    setInterval(() => {
      fetchMarketData();
    }, 60000)
  }, []);

  return { marketData };
};

export default useMarketData;
