module.exports = {
    extends: 'lighthouse:default',
    settings: {
        emulatedFormFactor: 'none',
        screenEmulation: {
            width: 1350,
            height: 940,
            deviceScaleFactor: 1,
        },
        onlyCategories: ['accessibility', 'performance'],
        skipCategories: ['seo', 'pwa'],
        skipAudits: ['color-contrast', 'document-title'],
        maxWaitForLoad: 30000,
        throttling: {
            rttMs: 40,
            throughputKbps: 10240,
            cpuSlowdownMultiplier: 1,
        },
        output: ['html', 'json'],
        maxScreenshotWidth: 1200,
    },
};
