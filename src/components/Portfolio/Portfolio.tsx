import {
  stockInfoGeneratorAll,
  transformTypes,
  getPnL,
} from "../../helpers/price";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import stocks from "../../data/pradeepjadhav/holdings.json";
import "./styles.css";
import { sort } from "../../helpers/sort";
import { HoldingInfo, Order, StockInformation } from "../../types/transaction";
import { removeQueryParamsFromURL } from "../../helpers/utils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";

export const Portfolio = () => {
  const location = useLocation();
  const stocksData = transformTypes(stocks);
  const [stocksInfo, setStocksInfo] = useState<StockInformation[]>([]);
  const [holdingInfo, setHoldingInfo] = useState<HoldingInfo>({
    totalPnl: "0",
    totalInvestedValue: "0",
    totalCurrentValue: "0",
    totalPnlPercentage: "0",
    totalDayChange: "0",
    totalDayChangePercentage: "0",
  });

  useEffect(() => {
    fetch("http://localhost:4000/holdings")
      .then((response) => response.json())
      .then((responseData) => console.log("API Response:", responseData));
    const parseQueryParams = () => {
      const searchParams = new URLSearchParams(location.search);
      const dataString = searchParams.get("data");
      let newFetchedData = "";
      if (dataString) {
        try {
          newFetchedData = decodeURIComponent(dataString);
          let lastFetchedData = localStorage.getItem("lastFetched");
          let savedMarketData = {};
          if (lastFetchedData) {
            const lastFetchedParsed = JSON.parse(lastFetchedData);
            const newFetchedParsed = JSON.parse(newFetchedData);
            const uniqueDataMap = new Map();
            newFetchedParsed.forEach((item: any) => {
              uniqueDataMap.set(item.symbol, item);
            });
            lastFetchedParsed.forEach((item: any) => {
              if (!uniqueDataMap.has(item.symbol)) {
                uniqueDataMap.set(item.symbol, item);
              }
            });
            savedMarketData = Array.from(uniqueDataMap.values());
            newFetchedData = JSON.stringify(savedMarketData);
          }
          localStorage.setItem("lastFetched", newFetchedData);
        } catch (error) {
          console.error("Error parsing data:", error);
        }
      } else {
        try {
          const data = localStorage.getItem("lastFetched");
          if (data) {
            newFetchedData = data;
          }
        } catch (error) {
          console.error("Error fetching localstorage data:", error);
        }
      }
      if (!!newFetchedData) {
        removeQueryParamsFromURL();
        const marketData = JSON.parse(newFetchedData);
        const stockInfo = stockInfoGeneratorAll(
          stocksData.holdings,
          marketData
        );
        setStocksInfo(stockInfo);
        setHoldingInfo(getPnL(stockInfo));
      }
    };
    parseQueryParams();
    removeQueryParamsFromURL();
  }, []);

  const onSort = (column: string, order: Order) =>
    setStocksInfo(sort(stocksInfo, column, order));

  return (
    <>
      <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
      <HoldingInformation holdingInfo={holdingInfo} />
    </>
  );
};
