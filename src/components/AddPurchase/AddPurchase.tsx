import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import "./styles.css";
import useUserHoldings from "../../hooks/useUserHoldings";

export const AddPurchase = () => {
  const [symbol, setSymbol] = useState("");
  const [dateAdded, setDateAdded] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [exchange, setExchange] = useState("NSE");
  const { userHoldings } = useUserHoldings();
  const [stockInfo, setStockInfo] = useState<any>(userHoldings);

  const isValidForm = useMemo(() => {
    return (
      symbol !== "" &&
      dateAdded !== "" &&
      quantity !== "" &&
      avgPrice !== "" &&
      exchange !== ""
    );
  }, [symbol, dateAdded, quantity, avgPrice, exchange]);

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
      console.log("New:", [...stockInfo, newStockInfo]);
    }

    console.log(symbolUpperCase + " added");
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
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="IRCTC"
        />
        <TextField
          label="Date Added"
          variant="outlined"
          type="text"
          value={dateAdded}
          placeholder="2024-10-25"
          onChange={(e) => setDateAdded(e.target.value)}
        />
        <TextField
          label="Quantity"
          variant="outlined"
          type="number"
          value={quantity}
          placeholder="5"
          onChange={(e) => setQuantity(e.target.value)}
        />
        <TextField
          label="Average Price"
          variant="outlined"
          type="number"
          value={avgPrice}
          placeholder="1234.55"
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
        <Button type="submit" variant="contained" disabled={!isValidForm}>
          Add Purchase
        </Button>
      </div>
    </form>
  );
};
