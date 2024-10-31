import { useEffect, useState } from "react";
import { request } from "../api/api";
import { Index } from "../types";

const useIndicesData = () => {
  const [indicesData, setIndicesData] = useState<Index[]>([]);

  const fetchIndicesData = () => {
    request("http://localhost:4000/indicesData")
      .then((response) => {
        setIndicesData(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  useEffect(() => {
    fetchIndicesData();
    setInterval(() => {
      fetchIndicesData();
    }, 60000)
  }, []);

  return { indicesData };
};

export default useIndicesData;
