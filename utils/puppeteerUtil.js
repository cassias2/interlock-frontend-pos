const puppeteer = require('puppeteer');
const serialNumbers = require('./serialNumbers');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({ width: 0, height: 0 });
  await page.goto('http://localhost:3001');

  //login
  await page.waitForSelector('input[id=":r0:"]');
  await page.type('input[id=":r0:"]', "91");

  await new Promise(resolve => setTimeout(resolve, 500));

  await page.waitForSelector('input[id=":r1:"]');
  await page.type('input[id=":r1:"]', "123");

  await page.keyboard.press('Enter');

  await new Promise(resolve => setTimeout(resolve, 500));

  //insere lot e part_number
  await page.waitForSelector('input[id=":R98rqkq:"]');
  await page.type('input[id=":R98rqkq:"]', 'OP641-12');
  await page.keyboard.press('Tab');

  await page.waitForSelector('input[id=":R9orqkq:"]');
  await page.type('input[id=":R9orqkq:"]', '12312312321');
  await page.keyboard.press('Tab');

  
  const enterSerialNumbers = async () => {
    let isModalOpen = false;

    for (const serial of serialNumbers) {
      await page.waitForSelector('input[id="interlock"]');
      await page.type('input[id="interlock"]', serial);
      await page.keyboard.press('Tab');
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Serial digitado:', serial);

      // Verifica se o modal está aberto
      isModalOpen = await page.evaluate(() => {
        const modal = document.querySelector('.MuiDialog-root');
        return modal !== null;
      });


      while (isModalOpen) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        isModalOpen = await page.evaluate(() => {
          const modal = document.querySelector('.MuiDialog-root');
          return modal !== null;
        });
      }
    }
  };

  await enterSerialNumbers();

  // await browser.close();
})();
