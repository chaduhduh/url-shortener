# url-shortener
Uses googles API to shorten URLs, Caches requests when possible using local storage.

# Usage

<pre>
<code>
// initialize with your API key

var shortener = new UrlShortener({
  key: 'YOUR_API_KEY'
});


// generate a short URL

shortener.getShortUrl("https://github.com/chaduhduh/").done(function(shortUrl){
  console.log(shortUrl);
});


// get original URL from an existing short URL

var shortUrl = "http://goo.gl/fbsS";
shortener.getLongUrl(shortUrl).done(function(longUrl){
  console.log(longUrl);
});
</code>
</pre>
