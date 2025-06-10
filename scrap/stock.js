import puppeteer from "puppeteer";
import fs from "fs";

// Predefined lists (same as before)
const gearItems = ["Watering Can", "Trowel", "Basic Sprinkler", "Advanced Sprinkler", "Godly Sprinkler", "Lightning Rod", "Master Sprinkler"];
const eggItems = ["Common Egg", "Uncommon Egg", "Rare Egg", "Legendary Egg", "Bug Egg"];
const seedItems = [
  "Carrot", "Strawberry", "Blueberry", "Orange Tulip", "Tomato", "Corn", "Daffodil",
  "Watermelon", "Pumpkin", "Apple", "Bamboo", "Coconut", "Cactus", "Dragonfruit",
  "Grape", "Mushroom", "Pepper"
];

// Helper function to deduplicate items
const deduplicateItems = (existingItems, newItems) => {
  const seen = new Set(existingItems.map(item => `${item.name}|${item.imgSrc}|${item.size}`));
  const uniqueNewItems = newItems.filter(item => {
    const key = `${item.name}|${item.imgSrc}|${item.size}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return [...existingItems, ...uniqueNewItems];
};

// Sort items based on predefined order
const sortItemsByPredefinedOrder = (items, orderList) => {
  const orderMap = new Map(orderList.map((item, index) => [item.toUpperCase(), index]));
  return items.sort((a, b) => {
    const baseNameA = a.name.split(" x")[0].toUpperCase();
    const baseNameB = b.name.split(" x")[0].toUpperCase();
    const indexA = orderMap.has(baseNameA) ? orderMap.get(baseNameA) : Infinity;
    const indexB = orderMap.has(baseNameB) ? orderMap.get(baseNameB) : Infinity;
    return indexA - indexB;
  });
};

// Function to scrape stock
async function scrapeStock(page) {
  const stockData = {
    gearStock: [],
    eggStock: [],
    seedStock: [],
  };

  await page.goto("https://www.vulcanvalues.com/grow-a-garden/stock", { waitUntil: "networkidle2" });

  const stocks = await page.$$eval(
    '.grid.grid-cols-1.md\\:grid-cols-3.gap-6.px-6.text-left.max-w-screen-lg.mx-auto',
    (elements) => {
      return elements.map((div) => {
        const heading = div.querySelector("h2")?.innerText.trim() || "";
        const description = div.querySelector("p")?.innerText.trim() || "";
        const items = Array.from(div.querySelectorAll("ul li")).map((li) => {
          const imgSrc = li.querySelector("img")?.getAttribute("src") || "";
          const spans = li.querySelectorAll("span");
          const name = spans[0]?.innerText.trim() || "";
          const size = spans[1]?.innerText.trim() || "";
          return { imgSrc, name, size };
        });
        return { heading, description, items };
      });
    }
  );

  stocks.forEach((stock) => {
    stock.items.forEach((item) => {
      const baseName = item.name.split(" x")[0].toUpperCase();

      if (eggItems.some(egg => baseName === egg.toUpperCase())) {
        stockData.eggStock = deduplicateItems(stockData.eggStock, [item]);
      } else if (seedItems.some(seed => baseName === seed.toUpperCase())) {
        stockData.seedStock = deduplicateItems(stockData.seedStock, [item]);
      } else if (gearItems.some(gear => baseName === gear.toUpperCase())) {
        stockData.gearStock = deduplicateItems(stockData.gearStock, [item]);
      }
    });
  });

  stockData.gearStock = sortItemsByPredefinedOrder(stockData.gearStock, gearItems);
  stockData.eggStock = sortItemsByPredefinedOrder(stockData.eggStock, eggItems);
  stockData.seedStock = sortItemsByPredefinedOrder(stockData.seedStock, seedItems);

  console.log("Scraped data at", new Date().toLocaleTimeString());
  fs.writeFileSync("stocks.json", JSON.stringify(stockData, null, 2));
}

export async function startStockLoop() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const interval = 20000; 

  const runScraping = async () => {
    try {
      await scrapeStock(page);
    } catch (e) {
      console.error("Error during scraping:", e);
    }
  };

  await runScraping();
  setInterval(runScraping, interval);
}

process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await browser.close();
  process.exit(0);
});
