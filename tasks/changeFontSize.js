const { remote } = require('webdriverio');

const UDID = process.argv[2];

const args = process.argv.slice(3);
const capabilities = {
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:udid': UDID,
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
};
const wdOpts = {
  hostname: process.env.APPIUM_HOST || 'localhost',
  port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
  logLevel: 'info',
  capabilities,
};

async function changeFont(fontValue) {
  const driver = await remote(wdOpts);
  try {
    // Available Font values: 0.0 1.0 2.0 3.0 4.0 5.0 6.0
    fontValue = Number(fontValue);
        
    const displayItem = await driver.$('//*[@text="Display"]');
    await displayItem.click();
    const fontItem = await driver.$('//*[@text="Font and screen zoom"]');
    await fontItem.click();
    const fontSeekBar = await driver.$(
      '//*[@resource-id="com.android.settings:id/seekBarForFontSize"]');
    // If the seek bar already set to desired value, then nothing to do
    // WARN: Do not set the same value twice or it will get error
    const currentFont = await fontSeekBar.getText();
    if (Number(currentFont) !== fontValue) {
      await fontSeekBar.setValue(fontValue);
      const applyButton = await driver.$(
        '//*[@resource-id="com.android.settings:id/menu_done"]')
      await applyButton.click();
    }
    
  } finally {
    await driver.pause(1000);
    await driver.deleteSession();
  }
}

changeFont(args).catch(console.error);