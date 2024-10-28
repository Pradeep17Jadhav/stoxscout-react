import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Portfolio } from "./components/Portfolio/Portfolio";
import { AddPurchase } from "./components/AddPurchase/AddPurchase";
import { ThemeProvider, createTheme } from "@mui/material";
import { PortfolioByDate } from "./components/PortfolioByDate/PortfolioByDate";
import { PortfolioByYear } from "./components/PortFolioByYear/PortfolioByYear";
import { HeatMap } from "./components/Heatmap/Heatmap";
import { HeatMapPNL } from "./components/HeatmapPNL/HeatmapPNL";

import "./App.css";

const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Arial",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/addPurchase" element={<AddPurchase />} />
          <Route path="/" element={<Portfolio />}></Route>
          <Route path="/portfolioByDate" element={<PortfolioByDate />}></Route>
          <Route path="/portfolioByYear" element={<PortfolioByYear />}></Route>
          <Route path="/heatmap" element={<HeatMap />}></Route>
          <Route path="/heatmapPNL" element={<HeatMapPNL />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
