var elems = document.querySelectorAll(".navWrapper");
[].forEach.call(elems, function(el) {
	el.classList.remove("mb-4");
});
var searchQuery;
function executeSearch() {
	var query = $('#searchField').val();
	query = encodeURIComponent(query);
	window.location.href = "?content=search&query=" + query;
}
function animateSearch() {
	if(searchQuery.length) {
		var nextLetter = searchQuery.shift();
		$('#searchField').val($('#searchField').val() + nextLetter);
			setTimeout(animateSearch, 150);				
		} else {
			setTimeout(executeSearch, 150);
		}
}

$(document).ready(function(){
	$('#searchField').keypress(function(e){
		if(e.which==13 && $('#searchField').val().length >2) {
			executeSearch ($('#searchField').val());
		}
	});
	$('.searchLink').click(function(){
		searchQuery = $(this).find('i').text().split('');
		$('#searchField').val('');
		animateSearch();
	});
});