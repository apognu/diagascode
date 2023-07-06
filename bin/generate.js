#!/usr/bin/env node

const { spawn } = require("child_process");
const waitPort = require("wait-port");
const puppeteer = require("puppeteer");

const PORT = 12345;

(async () => {
  const server = spawn("npm", ["exec", "vite", "--", "--port", PORT]);

  waitPort({ host: "127.0.0.1", port: PORT }).then(async (open) => {
    if (open) {
      const browser = await puppeteer.launch({
        headless: "new",
        defaultViewport: { width: 1024, height: 768, deviceScaleFactor: 2 },
        args: ["--disable-web-security"],
      });

      const page = await browser.newPage();

      await page.goto(`http://127.0.0.1:${PORT}`);

      const content = await page.$("body");

      const rect = await page.evaluate(() => {
        const element = document.getElementById("dac-area");
        const { x, y, width, height } = element.getBoundingClientRect();

        return { x, y, width, height };
      });

      await content.screenshot({ path: "output.png", clip: rect });
      await browser.close();

      await server.kill();
    }
  });
})();
