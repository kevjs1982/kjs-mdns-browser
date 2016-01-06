// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
 var LogobrandToolbar_domain = "www.highway42.com"
var menu_id = "UNSET";

//chrome.mdns.onServiceList.addListener(handleMDNS);
//chrome.mdns.onServiceList.addListener(handleMDSN, {serviceType: "_smb._tcp.local"});

//chrome.mdns.onServiceList.addListener(handleMDSN, {serviceType: "_http._tcp.local"});


chrome.mdns.onServiceList.addListener(handleHTTP, {serviceType: "_http._tcp.local"});
chrome.mdns.onServiceList.addListener(handleChromecast, {serviceType: "_googlecast._tcp.local"});
chrome.mdns.onServiceList.addListener(handleKodi, {serviceType: "_xbmc-jsonrpc-h._tcp.local"});
chrome.mdns.onServiceList.addListener(handleSamba, {serviceType: "_smb._tcp.local"});


function handleHTTP(https)
{
	var html = "";
	for(idx in https)
	{
		console.log(https[idx])
		var  path = "";
		if (typeof(https[idx].serviceData)!='undefined')
		{
			for(idx2 in https[idx].serviceData)
			{
				var bits = https[idx].serviceData[idx2].split("=");
				if (bits[0] == 'path')
				{
					path = bits[1];
				}
			}
		}
		html += '<a href="http://'+https[idx].serviceHostPort+path+'" target="_blank">'+https[idx].serviceName+'</a><br>';
	}
	document.getElementById('http').innerHTML = html;
}
function handleChromecast(chromecasts)
{
	var html = "";
	for(idx in chromecasts)
	{
		console.log(chromecasts[idx])
		html += '<a href="http://'+chromecasts[idx].serviceHostPort+'" target="_blank">'+chromecasts[idx].serviceName+'</a><br>';
	}
	document.getElementById('chromecasts').innerHTML = html;
}
function handleKodi(chromecasts)
{
	var html = "";
	for(idx in chromecasts)
	{
		console.log(chromecasts[idx])
		html += '<a href="http://'+chromecasts[idx].serviceHostPort+'" target="_blank">'+chromecasts[idx].serviceName+'</a><br>';
	}
	document.getElementById('kodi').innerHTML = html;
}
function handleSamba(sambas)
{
	console.log("S");
	console.log(sambas);
	var html = "";
	for(idx in sambas)
	{
		console.log(sambas[idx])
		html += '<a href="http://'+sambas[idx].serviceHostPort+'" target="_blank">'+sambas[idx].serviceName+'</a><br>';
	}
	document.getElementById('smb').innerHTML = html;
}


 
document.addEventListener('DOMContentLoaded', function() {
	console.log("mdns discover");
	chrome.mdns.forceDiscovery(function() {})
	console.log("mdns discovered");
});
