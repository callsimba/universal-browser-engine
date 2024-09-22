const { Builder } = require('selenium-webdriver');

(async function crossBrowserTest() {
  let driver = await new Builder().forBrowser('firefox').build();
  try {
    await driver.get('http://example.com');
    const title = await driver.getTitle();
    console.log('Title is:', title);
  } finally {
    await driver.quit();
  }
})();
