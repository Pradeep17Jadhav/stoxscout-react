import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import stocks from "../../data/pradeepjadhav/holdings.json";
import "./styles.css";

export const AddPurchase = () => {
  const [symbol, setSymbol] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [exchange, setExchange] = useState("NSE");
  const [stockInfo, setStockInfo] = useState<any>(stocks.holdings);

  useEffect(() => {
    console.log(stocks.holdings);
  }, []);

  const isValidForm = () => {
    return (
      symbol !== "" &&
      dateAdded !== "" &&
      quantity !== "" &&
      avgPrice !== "" &&
      exchange !== ""
    );
  };

  const handleAddMore = (event: any) => {
    event.preventDefault();
    const symbolUpperCase = symbol.toUpperCase();
    const dateAddedEpoch = new Date(dateAdded).getTime().toString();
    const avgPriceCleaned = avgPrice.replace(/,/g, "");
    const existingStock = stockInfo.find(
      (stock: any) => stock.symbol === symbolUpperCase
    );

    if (existingStock) {
      const updatedStockInfo: any = stockInfo.map((stock: any) => {
        if (stock.symbol === symbolUpperCase) {
          return {
            ...stock,
            transactions: [
              ...stock.transactions,
              {
                dateAdded: dateAddedEpoch,
                quantity: parseInt(quantity),
                avgPrice: parseFloat(avgPriceCleaned),
                exchange,
              },
            ],
          };
        }
        return stock;
      });
      setStockInfo(updatedStockInfo);
      console.log(updatedStockInfo);
    } else {
      const newStockInfo = {
        symbol: symbolUpperCase,
        transactions: [
          {
            dateAdded: dateAddedEpoch,
            quantity: parseInt(quantity),
            avgPrice: parseFloat(avgPriceCleaned),
          },
        ],
      };
      setStockInfo([...stockInfo, newStockInfo]);
      console.log([...stockInfo, newStockInfo]);
    }

    console.log(symbolUpperCase + " added");
    console.log(stocks.holdings);
    setSymbol("");
    setDateAdded("");
    setQuantity("");
    setAvgPrice("");
  };

  return (
    <form onSubmit={handleAddMore}>
      <div className="addPurchase">
        <TextField
          label="Symbol"
          variant="outlined"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <TextField
          label="Date Added"
          variant="outlined"
          type="text"
          value={dateAdded}
          onChange={(e) => setDateAdded(e.target.value)}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          label="Average Price"
          variant="outlined"
          type="number"
          value={avgPrice}
          onChange={(e) => setAvgPrice(e.target.value)}
        />
        <RadioGroup
          value={exchange}
          onChange={(event: SelectChangeEvent) =>
            setExchange((event.target as HTMLInputElement).value)
          }
        >
          <FormControlLabel value="NSE" control={<Radio />} label="NSE" />
          <FormControlLabel value="BSE" control={<Radio />} label="BSE" />
        </RadioGroup>
        <Button type="submit" variant="contained" disabled={!isValidForm()}>
          Add More
        </Button>
      </div>
    </form>
  );
};
