inz = chrome.i18n.getMessage;

var accounts = [];
var timer = 0;

function updateCodes(){
	for (i in accounts) {
		$('.account[data-id=' + i + '] .code span').html(generateAuthCode(accounts[i].secret))
			.attr('data-clipboard-text', generateAuthCode(accounts[i].secret));
	}
}
timer = setInterval(updateCodes, 1000);

function updateAccounts(){
	chrome.storage.local.set({accounts: JSON.stringify(accounts)}, function(){
		chrome.runtime.sendMessage({ "action" : "update"});
		showMain();
	})
}

function showScreen(screen){
	$('body').attr('screen', screen)
}

function showMain(){
	$('.help-block').hide();
	chrome.storage.local.get(['accounts'], function(data){
		if (!data.accounts) data.accounts = JSON.stringify([]);
		accounts = JSON.parse(data.accounts);

		if (!accounts.length) {
			clearInterval(timer);
			showScreen('no-account');
		} else {
			$('.account').remove();
			for (i in accounts) {
				var html = '<div class="account" data-id="' + i + '"><div class="title">' +
				accounts[i].title + '</div><div class="edit-btn"></div><div class="code"><span></span></div></div>'
				if (i == 0) $('.steamguard').prepend(html);
				else $('.list-accounts').append(html);
			}
			var html = '<div class="account add-account-btn">' + inz('addAccount') + '</div>'
			$('.steamguard').append(html);
			$('.add-account-btn').click(function(){
				$('.add-account input').val('')
				showScreen('add-account');
			})
			$('.account .title, .edit-btn').click(function(){
				var id = $(this).parent().attr('data-id');
				$('#id').val(id);
				$('#title').val(accounts[id].title);
				$('#secret').val(accounts[id].secret);
				$('#css').text('body[screen="add-account"] .add-account {height: 211px;}');
				showScreen('add-account');
			})
			var btns = document.querySelectorAll('.account .code span');
		    var clipboard = new Clipboard(btns);
		    var h = 150 + (accounts.length) * 50;
			$('#css').text('body[screen="steamguard"] .steamguard {height: ' + (h > 550 ? 550 : h) + 'px;}')
			updateCodes();
			showScreen('steamguard')
		}
	})
}

$(document).ready(function(){
	$('[i18n]').each(function(){
		$(this).html(inz($(this).attr('i18n')));
	})
	$('.no-account').click(function(){
		$('.add-account input').val('')
		$('#css').text('');
		showScreen('add-account');
	})
	$('.cancel-account').click(function(){
		showMain();
	})
	$('.save-account').click(function(){
		var title = $('#title').val();
		if (!title.trim().length) title = inz('noname')
		var secret = $('#secret').val();
		var id = $('#id').val();
		if (!id.length) {accounts.push({title: title, secret: secret});}
		else {
			accounts[id].title = title;
			accounts[id].secret = secret;
		}
		updateAccounts();
	})
	$('.delete-account-btn').click(function(){
		var id = $('#id').val();
		accounts.splice(id, 1);
		updateAccounts();
	})
	$('.promote-account-btn').click(function(){
		var id = $('#id').val();
		var a = accounts.splice(id, 1);
		accounts = a.concat(accounts);
		updateAccounts();
	})
	$('.help-btn').click(function(){
		var h = $(this).siblings('.help-block').outerHeight(true);
		h = ($(this).siblings('.help-block').css('display') === 'none' ? h : -h);
		$(this).siblings('.help-block').slideToggle(200, 'linear');
		$('#css').text('body[screen="add-account"] .add-account {height:'+($('.add-account').outerHeight() + h)+'px;}');
	})
	showMain();
})