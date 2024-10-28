import { useEffect, useState } from "react";
import { transformTypes } from "../helpers/price";
import { getUserHoldings } from "../api/userHoldings";

const useUserHoldings = () => {
  const [userHoldings, setUserHoldings] = useState<any>();

  useEffect(() => {
    const fetchUserHoldings = async () => {
      try {
        const response = await getUserHoldings();
        const transformed = transformTypes(response);
        console.log('Fetched holdings:', transformed.holdings);
        setUserHoldings(transformed.holdings);
      } catch (error) {
        console.error('Error fetching user holdings:', error);
      }
    };
    fetchUserHoldings();
  }, []);

  return { userHoldings };
};

export default useUserHoldings;