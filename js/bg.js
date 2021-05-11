var accounts = [];

function loadAccounts(){
	chrome.storage.local.get(['accounts'], function(data){
		if (!data.accounts) data.accounts = JSON.stringify([]);
		accounts = JSON.parse(data.accounts);
	})
}
loadAccounts();

function getAccount(login) {
	for (i in accounts) {
		if (accounts[i].title.trim().toLowerCase() == login.trim().toLowerCase()) return accounts[i];
	}
	return false;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == 'code') {
		account = getAccount(request.login);
		if (account) sendResponse({'code' : generateAuthCode(account.secret)})
		else sendResponse({'code' : ''})
	}
	if (request.action == 'check') {
		account = getAccount(request.login);
		if (account) sendResponse({'check' : true})
		else sendResponse({'check' : false})
	}
	if (request.action == 'update') {loadAccounts();}
});