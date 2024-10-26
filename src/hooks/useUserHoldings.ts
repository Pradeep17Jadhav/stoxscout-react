import { useEffect, useState } from "react";
import { transformTypes } from "../helpers/price";
import { getUserHoldings } from "../api/userHoldings";

const useUserHoldings = () => {
  const [userHoldings, setUserHoldings] = useState<any>();

  useEffect(() => {
    getUserHoldings().then((response) => {
      const transformed = transformTypes(response);
      setUserHoldings(transformed.holdings);
    });
  }, []);

  return { userHoldings };
};

export default useUserHoldings;
