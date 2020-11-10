const puppeteer = require('puppeteer');
let wordArrayList;

( async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: false,
  });

  const page = await browser.newPage();

  await page.goto('https://10fastfingers.com/typing-test/turkish', { waitUntil: 'load' });
  await page.waitForSelector('#row1 span');

  const wordList = await page.evaluate(() => {
    const wordSelector = document.querySelectorAll('#row1 span');
    const wordArray = Array.from(wordSelector);

    wordArrayList = wordArray.map(word => {
      return $(word).text();
    })
    return wordArrayList;
  });

  for(let word of wordList){
    await page.type('#inputfield', word);
    await page.keyboard.press('Space');
  }

  await page.waitForSelector('#auswertung-result', { visible: true, timeout: 50000})
  await page.screenshot({ path: 'score.png' })
  
  // await browser.close()
})();