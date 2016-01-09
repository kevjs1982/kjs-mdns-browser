chrome.mdns.onServiceList.addListener(handleHTTP, {serviceType: "_http._tcp.local"});
chrome.mdns.onServiceList.addListener(handleChromecast, {serviceType: "_googlecast._tcp.local"});
chrome.mdns.onServiceList.addListener(handleKodi, {serviceType: "_xbmc-jsonrpc-h._tcp.local"});
chrome.mdns.onServiceList.addListener(handleSamba, {serviceType: "_smb._tcp.local"});

var knownHTTP = new Array;
var knownHTTPS = 0;
var sortTimeout = null;
function handleHTTP(https)
{
	for(idx in https)
	{

		var html = "";	//console.log(https[idx])
		var  path = "";
		var user = "";
		var pass = "";
		var userpass = "";
		if (typeof(https[idx].serviceData)!='undefined')
		{
			for(idx2 in https[idx].serviceData)
			{
				var bits = https[idx].serviceData[idx2].split("=");
				if (bits[0] == 'path')
				{
					path = bits[1];
				}
				if (bits[0] == 'u')
				{
					user = bits[1];
				}
				if (bits[0] == 'p')
				{
					pass = bits[1];
				}
			}
		}
		//console.log(typeof(knownHTTP[https[idx].serviceHostPort+path]));
		if (user != "" && pass != "")
		{
			userpass = user + ":" + pass + "@";
		}
		if (typeof(knownHTTP[https[idx].serviceHostPort+path])=='undefined')
		{
			knownHTTP[https[idx].serviceHostPort+path] = true;
			var cnt = knownHTTPS++;
			//console.log(cnt);
			 html += '<div class="websnippet" data-url="'+userpass+https[idx].serviceHostPort+path+'" id="http_' + cnt + '">'
			 html += '<h1><img src="blank.png" id="http_' + cnt + '_img"><span class="title">' + https[idx].serviceName.replace("._http._tcp.local","") + '</span></h1>';
				html += '<span class="url">'+https[idx].serviceHostPort+path+'</span>'
				html += '<br><span class="desc"></span>';
				html += "</div>"
			
			
			document.getElementById('http').innerHTML += html;
			fetchOpenGraph("http_" + cnt,https[idx].serviceHostPort,path);

		}
	}
	//document.getElementById('http').innerHTML += html;
}
function handleChromecast(chromecasts)
{
	var html = "";
	for(idx in chromecasts)
	{
		//console.log(chromecasts[idx])
		html += '<a href="http://'+chromecasts[idx].serviceHostPort+'" target="_blank">'+chromecasts[idx].serviceName+'</a><br>';
	}
	document.getElementById('chromecasts').innerHTML = html;
}

function fetchOpenGraph(id,url,path)
{
	clearTimeout(sortTimeout);
	$.ajax({
		url: "http://"+url+path
	}).error(function(xhr,e1,e2){
		console.log(url + " :E: " + e1 + " >> " + e2);
	}).done(function(reply) {
		//console.log(url + " :S:" + reply);
		
		parser=new DOMParser();
        xmlDoc=parser.parseFromString(reply.trim().replace("<!doctype html>",""),"text/xml");
		
		var title = "";
		var description = "";
		var icon = "";
		//console.log(":::" + xmlDoc.querySelector("title").nodeValue);
		if (xmlDoc.querySelector("title")!=null)
		{
			title = xmlDoc.querySelector("title").innerHTML;
		}
		else if (xmlDoc.querySelector("meta[property='og:title']")!=null)
		{
			title = xmlDoc.querySelector("meta[property='og:title']").getAttribute('content');
		}

		if (xmlDoc.querySelector("meta[property='og:description']")!=null)
		{
			description = xmlDoc.querySelector("meta[property='og:description']").getAttribute('content');
		}
		else if (xmlDoc.querySelector("meta[name='description']")!=null)
		{
			description = xmlDoc.querySelector("meta[name='description']").getAttribute('content');
		}

		if (xmlDoc.querySelector("link[rel='shortcut icon']")!=null)
		{
			icon = xmlDoc.querySelector("link[rel='shortcut icon']").getAttribute('href');
		}
		else if (xmlDoc.querySelector("link[rel='icon']")!=null)
		{
			icon = xmlDoc.querySelector("link[rel='icon']").getAttribute('href');
		}
		else if (xmlDoc.querySelector("link[rel='apple-touch-icon-precomposed']")!=null)
		{
			icon = xmlDoc.querySelector("link[rel='apple-touch-icon-precomposed']").getAttribute('href');
		}
		else if (xmlDoc.querySelector("link[rel='apple-touch-icon']")!=null)
		{
			icon = xmlDoc.querySelector("link[rel='apple-touch-icon']").getAttribute('href');
		}
		else if (xmlDoc.querySelector("meta[property='og:image']")!=null)
		{
			icon = xmlDoc.querySelector("meta[property='og:image']").getAttribute('content');
		}
		else
		{
			icon = "/favicon.ico";
		}
		
		if (icon.substring(0,7) == 'http://' || icon.substring(0,8) == 'https://')
		{
			
		}
		else if(icon.substring(0,1) == "/")
		{
		
			icon = "http://" + url + icon 
		}
		else
		{
		
			icon = "http://" + url + "/" + icon 
		}
		
		if (title != "")
		{
			$("#" + id + " h1 span.title").html(title);			
		}
		
		
		$("#" + id + " span.desc").html(description);
		//console.log(icon);
		getImage(icon,id+"_img");
		//$("#" + id + " img").attr('src',icon);
		
		sortTimeout = setTimeout(function(){sortPages();},2000);
	});


	
}

function sortPages()
{
	var $divs = $(".websnippet");
	var alphabeticallyOrderedDivs = $divs.sort(function (a, b) 
	{
		var ma = $(a).find("span.title").text().toLowerCase().trim();
		var mb = $(b).find("span.title").text().toLowerCase().trim();
		if(ma > mb)
		{
			return 1;
		}
		else if(ma < mb)
		{
			return -1;
		}
		else
		{
			return 0;
		}

	
	
	});
	$("#http").html(alphabeticallyOrderedDivs);

}

function handleKodi(chromecasts)
{
	var html = "";
	for(idx in chromecasts)
	{
		//console.log(chromecasts[idx])
		html += '<a href="http://'+chromecasts[idx].serviceHostPort+'" target="_blank">'+chromecasts[idx].serviceName+'</a><br>';
	}
	document.getElementById('kodi').innerHTML = html;
}
function handleSamba(sambas)
{
	//console.log("S");
	//console.log(sambas);
	var html = "";
	for(idx in sambas)
	{
		//console.log(sambas[idx])
		html += '<a href="http://'+sambas[idx].serviceHostPort+'" target="_blank">'+sambas[idx].serviceName+'</a><br>';
	}
	document.getElementById('smb').innerHTML = html;
}

function getImage(url,id)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'blob';
	var idd = id;
	xhr.onload = function(e) 
	{
		document.getElementById(idd).src = window.URL.createObjectURL(this.response);
		$("#"+idd).attr('data-icon',url);
	};
	xhr.send();
	return true;
}


 
document.addEventListener('DOMContentLoaded', function() {
	chrome.mdns.forceDiscovery(function() {})
	setTimeout(function(){chrome.mdns.forceDiscovery(function() {})},4000);
	setInterval(function(){chrome.mdns.forceDiscovery(function() {})},30000);

	$( document ).on( "click", ".websnippet",function() 
	{
		var newURL ="http://" +  this.getAttribute('data-url');
		window.open(newURL);
	});


});

