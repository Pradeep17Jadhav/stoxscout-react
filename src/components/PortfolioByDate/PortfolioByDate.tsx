import { getPnL } from "../../helpers/price";
import { useEffect, useState } from "react";
import { DateWiseStockInformation, Order } from "../../types/transaction";
import { dateWiseStockInfoGeneratorAll } from "../../helpers/portfolioByDateUtils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";

import "./styles.css";
import { sort, sortHoldingsByDate } from "../../helpers/sort";
import useMarketData from "../../hooks/useMarketData";
import useUserHoldings from "../../hooks/useUserHoldings";
import useQueryParams from "../../hooks/useQueryParams";

export const PortfolioByDate = () => {
  const [dateWiseStocksInfo, setDateWiseStocksInfo] =
    useState<DateWiseStockInformation>([]);

  const { marketData } = useMarketData();
  const { userHoldings } = useUserHoldings();
  useQueryParams(userHoldings);

  useEffect(() => {
    if (!userHoldings || !marketData || !marketData.length) return;

    const dateWiseStockInfo = dateWiseStockInfoGeneratorAll(
      userHoldings,
      marketData
    );
    const sortedDateWiseStockInfo = sortHoldingsByDate(dateWiseStockInfo);
    setDateWiseStocksInfo(sortedDateWiseStockInfo);
    // setHoldingInfo(getPnL(dateWiseStockInfo));
  }, [userHoldings, marketData]);

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
