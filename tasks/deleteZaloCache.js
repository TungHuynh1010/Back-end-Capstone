const { remote } = require('webdriverio');

const UDID = process.argv[2];

const args = process.argv.slice(3);

const capabilities = {
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:udid': UDID,
    // 'appium:appPackage': 'com.zing.zalo',
    // 'appium:appActivity': '.ui.ZaloLauncherActivity',
    // 'appium:autoGrantPermissions' : true,
    'appium:noReset': true, // if not set, the app will lose all its login data
    'appium:fullReset': false,
};

const wdOpts = {
    hostname: process.env.APPIUM_HOST || 'localhost',
    port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
    logLevel: 'info',
    capabilities,
};

async function deleteZaloCache() {
    const appPackage = 'com.zing.zalo';
    const appActivity = '.ui.ZaloLauncherActivity';
    const driver = await remote(wdOpts);
    try {

        const hasZalo = await driver.isAppInstalled(appPackage);

        if (hasZalo) {
            await driver.startActivity(appPackage, appActivity);
            const profileTab = await driver.$('//*[@resource-id="com.zing.zalo:id/maintab_metab"]');
            await profileTab.click();
            const dataOnDevice = await driver.$('//*[@resource-id="com.zing.zalo:id/recyclerView"]/android.widget.LinearLayout[4]');
            await dataOnDevice.click();
            const clearCacheBtn = await driver.$('//*[@resource-id="com.zing.zalo:id/btn_clean_cache"]');
            await clearCacheBtn.click();
            const clearConfirm = await driver.$('//*[@resource-id="com.zing.zalo:id/btn_positive_modal"]');
            await clearConfirm.click();
        }
        else {
            console.log("Zalo has not been installed!")
        }
        
        // Start navigating in the zalo app

        
        // await driver.executeScript("mobile: pressKey", [{ "keycode": 3 }]);

        // await driver.performActions([
        //     {
        //         type: 'pointer',
        //         id: 'touch',
        //         parameters: { pointerType: 'touch' },
        //         actions: [
        //             { type: 'pointerMove', duration: 0, x: 508, y: 1436 },
        //             { type: 'pointerDown', button: 0 },
        //             { type: 'pause', duration: 300 },
        //             { type: 'pointerMove', duration: 1000, x: 508, y: 29 },
        //             { type: 'pointerUp', button: 0 }
        //         ]
        //     }
        // ])

        // var phoneScreens = await driver.$$(
        //     '//*[contains(@resource-id,"com.sec.android.app.launcher:id/") and contains(@resource-id,"active") or contains(@resource-id, "inactive")]'
        // );

        // for await (const phoneScreen of phoneScreens) {
        //     // Look for the App
        //     await phoneScreen.click();
        //     phoneScreens = await driver.$$(
        //         '//*[contains(@resource-id,"com.sec.android.app.launcher:id/") and contains(@resource-id,"active") or contains(@resource-id, "inactive")]'
        //     );
        //     let application = await driver.$('//*[@content-desc="YouTube"]');

        //     if (await application.isExisting()) {
        //         await application.click();
        //         break;
        //     }
        //     else continue;
        // }
        await driver.pause(3000);
        await driver.terminateApp(appPackage);
    } finally {
        await driver.pause(1000);
        await driver.deleteSession();
    }
}

deleteZaloCache().catch(console.error);