# Web image getter

A Node.js script that downloads images from URLs listed in a CSV file using Playwright and Chrome's remote debugging capabilities. The script takes screenshots of web pages and saves them to a local directory.

## Features

- Downloads images from URLs in a CSV file
- Uses Chrome's remote debugging for reliable page rendering
- Saves full-page screenshots
- Supports image cropping with customizable dimensions
- Automatic result directory creation
- Simple configuration via CSV file

## Prerequisites

- Node.js (v14 or higher)
- Google Chrome browser
- Yarn package manager

## Installation

- Clone the repository:

```bash
git clone [<repository-url>](https://github.com/phubadeepjs/web-image-getter.git)
cd web-image-getter
```

- Install dependencies:

```bash
yarn install
```

## Configuration

- Start Chrome with remote debugging enabled:

```bash
# On macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="/tmp/chrome-debug"
```

- Prepare your URLs:

- Edit `urls.csv` file
- Add Name and URL per line
- No headers needed
- Example:

```text
Page1,https://example.com/image1.jpg
Page2,https://example.com/image2.png
```

Configure cropping (optional):

- The script supports automatic cropping of images
- Cropping is performed after the screenshot is taken
- Default crop dimensions can be configured in the script
- Each image can be cropped to maintain aspect ratio

## Usage

1. Ensure Chrome is running with remote debugging enabled (see Configuration section)

2. Run the script:

```bash
yarn start
```

The script will:

1. Read URLs from `urls.csv`
2. Connect to your existing Chrome instance
3. Visit each URL
4. Take a full-page screenshot
5. Apply cropping if configured
6. Save the processed image to the `result` folder
7. Name files sequentially as `Page1.png`, `Page2.png`, etc.

## Output

- Screenshots are saved in the `result/` directory
- Each image is saved as a full-page screenshot
- Images are automatically cropped if cropping is enabled
- Files are named sequentially: `Page1.png`, `Page2.png`, etc.

## Troubleshooting

1. If Chrome fails to start with remote debugging:

   - Ensure no other Chrome instance is using port 9222
   - Try closing all Chrome instances and restart
   - Check if the `/tmp/chrome-debug` directory exists and is writable

2. If screenshots fail:

   - Verify URLs in `urls.csv` are accessible
   - Check Chrome's console for any errors
   - Ensure Chrome is running with remote debugging enabled
