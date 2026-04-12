import puppeteer from 'puppeteer';

async function checkConsole() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle2', timeout: 15000 });
  
  // Wait for content
  await page.waitForTimeout(3000);
  
  // Check if generate button exists and is disabled
  const buttons = await page.$$('button');
  console.log('Total buttons found:', buttons.length);
  
  await browser.close();
}

checkConsole().catch(e => {
  console.log('Error:', e.message);
  process.exit(1);
});