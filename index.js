import { startStockLoop } from "./scrap/stock.js";

// List of functions for getting data from the web
if (!startStockLoop) {
  throw new Error('One or more functions are not defined');
} else {
  startStockLoop();
};