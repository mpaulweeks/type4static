
var _repo = Module('repo');
var _tool = Module('tool');

/**
*	Wizards
*/
function getWizardsCardName(cardName){
	return cardName.replace(/&#8217;/g,"").replace(/\/g,"").replace(/\’/g,"").replace(/\'/g,"").replace(/,/g," ").replace(/-/g," ").replace(/\s+/g," ").replace(/ /g,"_");
}
function getWizardsHtml(cardName){
	return "<img src=\""+getWizardsSrc(cardName)+"\" onerror=\"this.onerror=null;this.onmouseout=null;this.onmouseover=null;this.src='mtg_card_back.jpg';\"/>";
}

function getWizardsSrc(cardName){
    var mid = _repo.get_multiverse_id_by_name(cardName);
	return _tool.get_img_url(mid);
}

function getWizardsOnError(e){
	return function(e) {
		this.onerror=null;
		this.onmouseout=null;
		this.onmouseover=null;
		this.src="https://sites.google.com/site/themunsonsapps/mtg/mtg_card_back.jpg";
	};
}
