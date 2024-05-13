const { remote } = require('webdriverio');

const UDID = process.argv[2];

const args = process.argv.slice(3);

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:udid': UDID,
    'appium:deviceName': 'ce051605884c7e1603',
};

const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
};

async function check3G() {

    const driver = await remote(wdOpts);
    try {
        driver.performActions(
            [
                {
                    type: 'pointer',
                    id: 'touch',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: 559, y: 9 },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 500 },
                        { type: 'pointerMove', duration: 1000, origin: 'pointer', x: 0, y: 1190 },
                        { type: 'pointerUp', button: 0 }
                    ]
                },
                {
                    type: 'pointer',
                    id: 'touch2',
                    parameters: { pointerType: 'touch' },
                    actions: [
                        { type: 'pointerMove', duration: 0, x: 559, y: 9 },
                        { type: 'pointerDown', button: 0 },
                        { type: 'pause', duration: 500 },
                        { type: 'pointerMove', duration: 1000, origin: 'pointer', x: 0, y: 1190 },
                        { type: 'pointerUp', button: 0 }
                    ]
                }
            ]
        );

        const bluetoothItem = await driver.$('//*[contains(@content-desc, "Bluetooth") and contains(@content-desc, "On.") or contains(@content-desc, "Off.")]');
        const bluetoothMode = await bluetoothItem.getAttribute('content-desc');
        if (bluetoothMode.includes("On")) {
            await bluetoothItem.click();
        }
        await driver.execute('mobile: pressKey', { keycode: 4 });// press Back button in Android
    } finally {
        await driver.pause(1000);
        await driver.deleteSession();
    }
}

check3G().catch(console.error);