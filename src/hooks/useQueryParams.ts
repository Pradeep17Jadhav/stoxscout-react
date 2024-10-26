import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getMarketData, setMarketData } from "../api/marketData";

const useQueryParams = (stocksData: any) => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setTimeout(() => {
      const dataString = searchParams.get("data");
      if (!dataString) {
        return;
      }
      removeQueryParamsFromURL();
      try {
        handleExistingMarketData(dataString);
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }, 5000);
  }, [location.search, stocksData]);

  const handleExistingMarketData = async (dataString: string) => {
    const uniqueDataMap = new Map();
    let newFetchedData = decodeURIComponent(dataString);
    let lastFetchedData = await getMarketData();
    const newFetchedParsed = JSON.parse(newFetchedData);
    newFetchedParsed.forEach((item: any) => {
      uniqueDataMap.set(item.symbol, item);
    });
    if (lastFetchedData) {
      lastFetchedData.forEach((item: any) => {
        if (!uniqueDataMap.has(item.symbol)) {
          uniqueDataMap.set(item.symbol, item);
        }
      });
    }
    setMarketData(Array.from(uniqueDataMap.values()));
  };

  const removeQueryParamsFromURL = () => {
    const urlWithoutParams = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, urlWithoutParams);
  };
};

export default useQueryParams;
