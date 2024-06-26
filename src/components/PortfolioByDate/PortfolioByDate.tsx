import { getPnL, transformTypes } from "../../helpers/price";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateWiseStockInformation, HoldingInfo } from "../../types/transaction";
import { removeQueryParamsFromURL } from "../../helpers/utils";
import { dateWiseStockInfoGeneratorAll } from "./portfolioByDateUtils";
import { HoldingTable } from "../HoldingTable/HoldingTable";
import { HoldingInformation } from "../HoldingInformation/HoldingInformation";
import stocks from "../../data/pradeepjadhav/holdings.json";
import "./styles.css";

type Props = {
  stocks?: any;
};

export const PortfolioByDate = ({}: Props) => {
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
        setDateWiseStocksInfo(dateWiseStockInfo);
        // setHoldingInfo(getPnL(dateWiseStockInfo));
      }
    };
    parseQueryParams();
    removeQueryParamsFromURL();
  }, [location.search]);

  //   const onSort = (column: string) =>
  //     setDateWiseStocksInfo(sort(dateWiseStocksInfo, column, "asc"));

  return (
    <>
      {dateWiseStocksInfo.map((dateWiseStocksInfoItem) => (
        <>
          <div className="datePurchased">{dateWiseStocksInfoItem.date}</div>
          <div>
            <div>
              <HoldingTable
                stocksInfo={dateWiseStocksInfoItem.stocksInfo}
                onSort={() => {}}
              />
            </div>
            <HoldingInformation
              holdingInfo={getPnL(dateWiseStocksInfoItem.stocksInfo)}
            />
          </div>
        </>
      ))}
    </>
  );
};
