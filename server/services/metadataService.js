const fetch = require('node-fetch');
const cheerio = require('cheerio');

exports.extractMetadata = async (url) => {
  let title = url; // Default to URL
  let description = '';

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error fetching URL. Status=${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Try Open Graph tags
    title = $('meta[property="og:title"]').attr('content');
    description = $('meta[property="og:description"]').attr('content');

    // Fallback to standard tags
    if (!title) {
      title = $('title').text();
    }
    if (!description) {
      description = $('meta[name="description"]').attr('content');
    }
    
    // Final fallback
    if (!title) {
      title = url;
    }

  } catch (err) {
    console.error(`Could not scrape metadata from URL ${url}: ${err.message}`);
    // On error, title is already set to the URL
  }

  return { title, description };
};