import puppeteer from 'puppeteer';
import fs from 'fs';

async function getTimeInfo() {
  const browser = await puppeteer.launch(); // Launch Puppeteer
  const page = await browser.newPage(); // Open a new page

  try {
    await page.goto('https://fischipedia.org/wiki/Fisch_Wiki');
    await page.waitForSelector('.countdown.countdown-seasons');

    const interval = setInterval(async () => {  
        try {
            const seasons = await page.$$eval('.season-cell', (elements) => 
                elements.map((element) => {
                const isCurrent = element.classList.contains('current-season');
                const seasonName = element.className
                .split(' ')
                .find((cls) => cls.startsWith('season-') && cls !== 'season-cell')
                ?.replace('season-', '');
                const title = element.querySelector('.season-cd-content')?.getAttribute('title');
                const countdown = element.querySelector('.season-cd-content')?.textContent.trim();
          
                return {
                  seasonName: seasonName?.charAt(0).toUpperCase() + seasonName?.slice(1),
                  isCurrent,
                  title: title || null,
                  countdown: countdown || null
                };
            })
        );
              fs.writeFileSync('./data/seasoninfo.json',JSON.stringify(seasons, null, 2), 'utf-8');
        } catch (error) {
            console.error('We found the error', error);
            clearInterval(interval);
        }
    },5000);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getTimeInfo();