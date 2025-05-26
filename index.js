const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const sharp = require("sharp");

const resultDir = path.join(__dirname, "result");
if (!fs.existsSync(resultDir)) {
  fs.mkdirSync(resultDir);
}

async function downloadImage(page, url, name) {
  try {
    await page.goto(url, { waitUntil: "networkidle" });

    const screenshotPath = path.join(resultDir, `${name}_full.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const croppedPath = path.join(resultDir, `${name}.png`);
    await sharp(screenshotPath).trim().toFile(croppedPath);

    // delete screenshot
    fs.unlinkSync(screenshotPath);

    console.log(
      `Successfully downloaded and cropped image from ${url} to ${croppedPath}`
    );
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error.message);
  }
}

async function connectToBrowser(retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `Attempting to connect to Chrome (attempt ${i + 1}/${retries})...`
      );
      const browser = await chromium.connectOverCDP("http://localhost:9222");
      console.log("Successfully connected to Chrome!");
      return browser;
    } catch (error) {
      if (i === retries - 1) {
        throw new Error(
          `Failed to connect to Chrome after ${retries} attempts. Make sure Chrome is running with --remote-debugging-port=9222`
        );
      }
      console.log(`Connection failed, retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

async function main() {
  try {
    const csvContent = fs.readFileSync("urls.csv", "utf-8");
    const records = parse(csvContent, {
      columns: false,
      skip_empty_lines: true,
    });

    if (records.length === 0) {
      console.error("No URLs found in urls.csv");
      return;
    }

    const browser = await connectToBrowser();
    const context = browser.contexts()[0];
    const pages = context.pages();
    const page = pages.length ? pages[0] : await context.newPage();

    for (let i = 0; i < records.length; i++) {
      const name = records[i][0];
      const url = records[i][1];
      console.log(`Processing URL ${i + 1}/${records.length}: ${url}`);
      await downloadImage(page, url, name);
    }

    await context.close();
    await browser.close();
    console.log("All images have been processed successfully!");
  } catch (error) {
    console.error("Fatal error:", error.message);
    process.exit(1);
  }
}

main().catch(console.error);
