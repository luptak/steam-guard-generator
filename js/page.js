$('#SteamLogin, #imageLogin').click(function(){
	console.log(1)
	if ($('#axSG').length) return;
	chrome.runtime.sendMessage({ "action" : "check", "login" : $('#steamAccountName').val() }, function(resp){
		console.log(resp)
		if (!resp.check) return;
		var box = $('.twofactorauthcode_entry_box');
		console.log(box)
		if (box) {
			box.css('background-image', 'none');
			box.prepend('<div id="axSG"></div>');
			$('#axSG').click(function(){
				chrome.runtime.sendMessage({ "action" : "code", "login" : $('#steamAccountName').val() }, function(resp){
					$('#twofactorcode_entry').val(resp.code);
				});
			})
		}
	})
})