import { useEffect, useState } from "react";
import { authRequest } from "../api/api";
import { Index } from "../types/indices";
import { PortfolioAction } from "../context/portfolioReducer";
import { useAuth } from "./useAuth";

const useIndicesData = (dispatch: React.Dispatch<PortfolioAction>) => {
  const [indicesData, setIndicesData] = useState<Index[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchIndicesData = () => {
    if (!isAuthenticated) return;

    authRequest("http://localhost:4000/api/indices")
      .then((response) => {
        setIndicesData(response);
        dispatch({ type: 'UPDATE_INDICES_DATA', payload: response });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchIndicesData();
    const intervalId = setInterval(() => {
      fetchIndicesData();
    }, 20000)
    return () => clearInterval(intervalId);
  }, [isAuthenticated]);

  return { indicesData };
};

export default useIndicesData;
