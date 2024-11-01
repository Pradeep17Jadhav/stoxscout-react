import { useEffect, useState } from "react";
import { authRequest } from "../api/api";
import { MarketData } from "../types/marketData";
import { PortfolioAction } from "../context/portfolioReducer";
import { useAuth } from "./useAuth";

const useMarketData = (dispatch: React.Dispatch<PortfolioAction>) => {
	const [marketData, setMarketData] = useState<MarketData>([]);
	const { isAuthenticated } = useAuth();

	const fetchMarketData = () => {
		if (!isAuthenticated) return;

		authRequest("http://localhost:4000/api/marketData")
			.then((response) => {
				dispatch({ type: 'UPDATE_MARKET_DATA', payload: response });
				setMarketData(response);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		fetchMarketData();
		const intervalId = setInterval(() => {
			fetchMarketData();
		}, 20000);
		return () => clearInterval(intervalId);
	}, [isAuthenticated]);

	return { marketData };
};

export default useMarketData;
