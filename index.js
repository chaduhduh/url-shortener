define(["jquery"], function($) {
	var UrlShortener = function(args) {
		var self = this;
		self._gapiKey = (args.key !== undefined) ? args.key : false;
		self._apiUrl = (args.apiUrl !== undefined) ? args.apiUrl : "https://www.googleapis.com/urlshortener/v1/url";
		self._contentType = (args.contentType !== undefined) ? args.contentType : "application/json; charset=utf-8";

		return self;
	}

	UrlShortener.prototype.getApiKey = function() {
		return this._gapiKey;
	};

	UrlShortener.prototype.setApiKey = function(key) {
		UrlShortener._gapiKey = key || UrlShortener._gapiKey || false;
	};

	UrlShortener.prototype.getApiUrl = function() {
		return this._apiUrl;
	};

	UrlShortener.prototype.getAuthedUrl = function() {
		return this._apiUrl + "?key=" + this.getApiKey();
	};

	UrlShortener.prototype.getContentType = function() {
		return self._contentType;
	};

	UrlShortener.prototype.hasLocalStorage = function() {
		if (typeof localStorage !== 'undefined') {
		    return true;
		} else {
		    return false;
		}
	}

	UrlShortener.prototype.checkLocalStorage = function(needle) {
		if (this.hasLocalStorage()) {
		    var urls = JSON.parse(localStorage.getItem('gapi_blog_urls'));
		    if (!urls || urls.length <= 0) return false;
		    var url = urls.filter(function(url){ return url.longUrl === needle })[0];
		    if (!url) return false;
		    return url.shortUrl;
		} else {
		    return false;
		}
	}

	UrlShortener.prototype.storeUrl = function(args) {
		var shortUrl = args.shortUrl;
		var longUrl = args.longUrl;
		if (this.hasLocalStorage()) {
			if(!this.checkLocalStorage()) {
				var urls = JSON.parse(localStorage.getItem('gapi_blog_urls'));
				if(!urls) urls = [];
				var newUrl = {
					shortUrl: shortUrl,
					longUrl: longUrl
				}
				urls.push(newUrl);
				localStorage.setItem('gapi_blog_urls', JSON.stringify(urls));
			}
		}
	}

	UrlShortener.prototype.deleteLocalStorage = function() {
		if (this.hasLocalStorage()) {
			localStorage.removeItem('gapi_blog_urls');
		}
	}

	UrlShortener.prototype.getShortUrl = function(args){
		var self = this;
		var getShortUrl = jQuery.Deferred();
		var urlToAdd = args.url;
		if (!args.url) getShortUrl.reject("URL not provided");
		var data = {longUrl: urlToAdd};
		var status = "starting";

		var url = this.checkLocalStorage(urlToAdd);
		if (url){
			getShortUrl.resolve(url);
		}

		if (!url){
			var request = $.ajax({
	            url: self.getAuthedUrl(),
	            type: 'POST',
	            dataType: "json",
	            processData: false,
	            contentType: "application/json; charset=utf-8",
	            data: JSON.stringify(data)
			});

			request.done(function(resp){
				if(resp.id)
					self.storeUrl({shortUrl: resp.id, longUrl: resp.longUrl});
					getShortUrl.resolve(resp.id);
				if(!resp.id)
					getShortUrl.reject("Invalid Response");
			});

			request.fail(function(data){
				getShortUrl.reject("GAPI Error");
			});
		}

		return getShortUrl.promise( status );
	}

	UrlShortener.prototype.getLongUrl = function(args){
		var getLongUrl = jQuery.Deferred();
		if (!args.url) getShortUrl.reject("URL not provided");
		var data = {shortUrl: args.url};
		var status = "starting";

		var request = $.ajax({
            url: this.getAuthedUrl(),
            type: 'GET',
            data: data
		});

		request.done(function(resp){
			if(resp.longUrl)
				getLongUrl.resolve(resp.longUrl);
			if(!resp.longUrl)
				getLongUrl.reject("Invalid Response");
		});

		request.fail(function(data){
			getLongUrl.reject("GAPI Error");
		});

		return getLongUrl.promise( status );
	}

	return UrlShortener;
});
