export const fetchPrices = () => {
  const data: any = {};
  //https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=HDFCBANK.BO&apikey=ZT190HZDN99BS851
};

// const createNewObject = (data: any) => {
//   const result: any = {};
//   ["symbol", "open", "price", "change"].forEach((key) => {
//     const matchingKey = Object.keys(data).find((k) =>
//       k.toLowerCase().includes(key.toLowerCase())
//     );
//     if (matchingKey) {
//       result[key] = data[matchingKey];
//     } else {
//       console.error(`Key '${key}' not found in the API response.`);
//     }
//   });
//   return result;
// };
