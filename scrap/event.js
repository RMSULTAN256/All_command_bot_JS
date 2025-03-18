import puppeteer from 'puppeteer';
import fs from 'fs';

export async function getTimeInfo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    await page.goto('https://fischipedia.org/wiki/Fisch_Wiki');
    await page.waitForSelector('.heading');
    console.log('Scraper initialized...');

    const events = await page.$$eval('.countdown-container', (containers) =>
      containers
        .map((container) => {
          const title = container.querySelector('.countdown-header')?.textContent.trim() || null;
          const countdown = container.querySelector('.countdown-normal')?.textContent.trim() || null;
          const hr = container.querySelector('hr');
          let status = null;

          if (hr) {
            let sibling = hr.nextSibling;
            while (sibling && (sibling.nodeType !== Node.TEXT_NODE || !sibling.textContent.trim())) {
                sibling = sibling.nextSibling;
            }
            status = sibling ? sibling.textContent.trim() : null;
          }

          if (title && countdown && status !== null) {
            return {
              Event: title,
              Countdown: status.replace(':', "") + countdown,
            };
          }
          return null;
        })
        .filter((event) => event !== null)
    );

    const event_current = await page.$$eval('.countdown-container', (containers) => 
      containers
        .map((container) => {
          const title = container.querySelector('.countdown-header a')?.getAttribute('title') || null;
          const countdown = container.querySelector('.countdown-normal')?.textContent.trim() || null;

          if (title && countdown) {
            return {
              Event: title,
              Countdown: countdown,
            };
          }
          return null;
        }).filter((event_current) => event_current !== null)
      );
    
    const all_event = [...events, ...event_current];

    console.log(all_event);
    fs.writeFileSync('./data/eventMeg.json', JSON.stringify(all_event, null, 2), 'utf-8');
    console.log('Data saved successfully.');
    await browser.close();
  } catch (error) {
    console.error('Error scraping data:', error.message);
    await browser.close();
  }
}

getTimeInfo();
