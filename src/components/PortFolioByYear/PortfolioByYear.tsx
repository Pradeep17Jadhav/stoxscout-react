import { getPnL, transformTypes } from "../../helpers/price";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Order, YearWiseStockInformation } from "../../types/transaction";
import { removeQueryParamsFromURL } from "../../helpers/utils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";
import stocks from "../../data/pradeepjadhav/holdings.json";
import { sort, sortHoldingsByYear } from "../../helpers/sort";
import { yearWiseStockInfoGeneratorAll } from "../../helpers/portfolioByDateUtils";

import "./styles.css";

export const PortfolioByYear = () => {
  const location = useLocation();
  const stocksData = transformTypes(stocks);
  const [yearWiseStocksInfo, setYearWiseStocksInfo] =
    useState<YearWiseStockInformation>([]);

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
        const yearWiseStockInfo = yearWiseStockInfoGeneratorAll(
          stocksData.holdings,
          marketData
        );
        const sortedYearWiseStockInfo = sortHoldingsByYear(yearWiseStockInfo);
        setYearWiseStocksInfo(sortedYearWiseStockInfo);
      }
    };
    parseQueryParams();
    removeQueryParamsFromURL();
  }, [location.search]);

  const onSort = (column: string, order: Order, year?: string) => {
    let index = -1;
    if (!year) {
      return;
    }
    const stocksInfoForDate = yearWiseStocksInfo.find((stockInfoForDate, i) => {
      if (stockInfoForDate.year === year) {
        index = i;
        return true;
      }
      return false;
    });
    if (!stocksInfoForDate || index === -1) {
      return;
    }
    const sortedStocksInfo = sort(stocksInfoForDate.stocksInfo, column, order);
    setYearWiseStocksInfo(
      (yearWiseStockInformation: YearWiseStockInformation) => {
        const yearWiseStockInformationCopy = JSON.parse(
          JSON.stringify(yearWiseStockInformation)
        );
        yearWiseStockInformationCopy[index].stocksInfo = sortedStocksInfo;
        return yearWiseStockInformationCopy;
      }
    );
  };

  return (
    <>
      {yearWiseStocksInfo.map((yearWiseStocksInfoItem) => (
        <div key={`${yearWiseStocksInfoItem.year}`}>
          <div className="yearPurchased">{yearWiseStocksInfoItem.year}</div>
          <div>
            <div>
              <HoldingTable
                stocksInfo={yearWiseStocksInfoItem.stocksInfo}
                onSort={onSort}
                year={yearWiseStocksInfoItem.year}
              />
            </div>
            <HoldingInformation
              holdingInfo={getPnL(yearWiseStocksInfoItem.stocksInfo)}
            />
          </div>
        </div>
      ))}
    </>
  );
};
