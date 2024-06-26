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
import { HoldingInfo, StockInformation } from "../../types/transaction";
import { removeQueryParamsFromURL } from "../../helpers/utils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";

type Props = {
  stocks?: any;
};

export const Portfolio = ({}: Props) => {
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
    const parseQueryParams = () => {
      const searchParams = new URLSearchParams(location.search);
      const dataString = searchParams.get("data");
      let decodedData = "";
      if (dataString) {
        try {
          decodedData = decodeURIComponent(dataString);
          localStorage.setItem("lastFetched", decodedData);
        } catch (error) {
          console.error("Error parsing data:", error);
        }
      } else {
        try {
          const data = localStorage.getItem("lastFetched");
          if (data) {
            decodedData = data;
          }
        } catch (error) {
          console.error("Error fetching localstorage data:", error);
        }
      }
      if (!!decodedData) {
        removeQueryParamsFromURL();
        const marketData = JSON.parse(decodedData);
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
  }, [location.search]);

  const onSort = (column: string) =>
    setStocksInfo(sort(stocksInfo, column, "asc"));

  return (
    <>
      <div className="portfolio">
        <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
      </div>
      <HoldingInformation holdingInfo={holdingInfo} />
    </>
  );
};
