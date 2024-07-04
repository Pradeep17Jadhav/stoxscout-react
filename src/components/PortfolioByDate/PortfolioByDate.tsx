import { getPnL, transformTypes } from "../../helpers/price";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  DateWiseStockInformation,
  HoldingInfo,
  Order,
} from "../../types/transaction";
import { removeQueryParamsFromURL } from "../../helpers/utils";
import { dateWiseStockInfoGeneratorAll } from "./portfolioByDateUtils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";
import stocks from "../../data/pradeepjadhav/holdings.json";
import "./styles.css";
import { sort, sortHoldingsByDate } from "../../helpers/sort";

export const PortfolioByDate = () => {
  const location = useLocation();
  const stocksData = transformTypes(stocks);
  const [dateWiseStocksInfo, setDateWiseStocksInfo] =
    useState<DateWiseStockInformation>([]);
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
        const dateWiseStockInfo = dateWiseStockInfoGeneratorAll(
          stocksData.holdings,
          marketData
        );
        const sortedDateWiseStockInfo = sortHoldingsByDate(dateWiseStockInfo);
        setDateWiseStocksInfo(sortedDateWiseStockInfo);
        // setHoldingInfo(getPnL(dateWiseStockInfo));
      }
    };
    parseQueryParams();
    removeQueryParamsFromURL();
  }, [location.search]);

  const onSort = (column: string, order: Order, date?: string) => {
    let index = -1;
    if (!date) {
      return;
    }
    const stocksInfoForDate = dateWiseStocksInfo.find((stockInfoForDate, i) => {
      if (stockInfoForDate.date === date) {
        index = i;
        return true;
      }
      return false;
    });
    if (!stocksInfoForDate || index === -1) {
      return;
    }
    const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, order);
    setDateWiseStocksInfo(
      (dateWiseStockInformation: DateWiseStockInformation) => {
        const dateWiseStockInformationCopy = JSON.parse(
          JSON.stringify(dateWiseStockInformation)
        );
        dateWiseStockInformationCopy[index].stocksInfo = sortedStocksInfo;
        return dateWiseStockInformationCopy;
      }
    );
  };

  return (
    <>
      {dateWiseStocksInfo.map((dateWiseStocksInfoItem) => (
        <div key={`${dateWiseStocksInfoItem.date}`}>
          <div className="datePurchased">{dateWiseStocksInfoItem.date}</div>
          <div>
            <div>
              <HoldingTable
                stocksInfo={dateWiseStocksInfoItem.stocksInfo}
                onSort={onSort}
                date={dateWiseStocksInfoItem.date}
              />
            </div>
            <HoldingInformation
              holdingInfo={getPnL(dateWiseStocksInfoItem.stocksInfo)}
            />
          </div>
        </div>
      ))}
    </>
  );
};
