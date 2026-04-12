import puppeteer from 'puppeteer';

async function test() {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER:', msg.type(), msg.text());
  });
  
  page.on('pageerror', err => {
    console.log('ERROR:', err.message);
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  
  // Wait for news to load
  await page.waitForSelector('[class*="border-2"]', { timeout: 10000 });
  
  // Click first news item to select it
  await page.click('[class*="border-2"]:first-child');
  await page.waitForTimeout(500);
  
  // Check if there's an uploaded file input (just for testing)
  console.log('Page loaded, checking...');
  
  // Get page title
  const title = await page.title();
  console.log('Page title:', title);
  
  await browser.close();
  console.log('Test complete');
}

test().catch(console.error);