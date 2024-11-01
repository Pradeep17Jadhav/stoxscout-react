import { useEffect, useState } from "react";
import { transformTypes } from "../helpers/price";
import { getUserHoldings } from "../api/userHoldings";
import { Holdings } from "../types/transaction";
import { PortfolioAction } from "../context/portfolioReducer";
import { useAuth } from "./useAuth";

const useUserHoldings = (dispatch: React.Dispatch<PortfolioAction>) => {
  const [userHoldings, setUserHoldings] = useState<Holdings>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchUserHoldings = async () => {
      if (!isAuthenticated) return;
      try {
        const response = await getUserHoldings();
        const transformed = transformTypes(response);
        setUserHoldings(transformed.holdings);
        dispatch({ type: 'UPDATE_USER_HOLDINGS', payload: transformed.holdings });
      } catch (error) {
        console.error('Error fetching user holdings:', error);
      }
    };
    fetchUserHoldings();
  }, [isAuthenticated]);

  return { userHoldings };
};

export default useUserHoldings;