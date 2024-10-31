import { useContext, useEffect, useState } from "react";
import { stockInfoGeneratorAll, getPnL } from "../../helpers/price";
import { sort } from "../../helpers/sort";
import {
  HoldingSummary,
  Order,
  StockInformation,
} from "../../types/transaction";
import { PortfolioContext } from "../../context/PortfolioContext";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";
import useMarketData from "../../hooks/useMarketData";
import useUserHoldings from "../../hooks/useUserHoldings";

import "./styles.css";

export const Portfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('PortfolioProvider is not initialized');
  }
  const { holdingSummary, stocksInfo, setStocksInfo } = context;

  const onSort = (column: string, order: Order) =>
    setStocksInfo(sort(stocksInfo, column, order));

  return (
    <>
      <HoldingTable stocksInfo={stocksInfo} onSort={onSort} />
      <HoldingInformation holdingInfo={holdingSummary} />
    </>
  );
};
