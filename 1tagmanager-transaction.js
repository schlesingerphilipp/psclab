$(document).ready(function(){
  if (window.location.href.indexOf("checkout/do") != -1) {
	var transactionData = getTransactionData();
	var transaction = getTransaction(transactionData)
	dataLayer.push(transaction);
  }
});

	

var getTransactionData = function(){
	var ca = document.cookie.split(';');
	var transActionData = [];
    	for(var i=0; i<ca.length; i++) {
        	var c = ca[i];
		if(c.indexOf("werkTransAction") != -1) {
			var ido = c.indexOf("=")
			var cookie = c.substring(ido+1); 
			var allItems = $.parseJSON(cookie)
			for (var key in allItems) {
				transActionData.push(allItems[key]);
			}		
			break;
		}
    	}
	return transActionData;
};
var getTransactionItems = function(transActionData){
	var items = [];
	for(var key in transActionData) {
		var item = transActionData[key]
		if(item["article-id"]) {
			var tItem = {
       			"sku": ''+item["article-id"],
       			"name": item["name"],
       			"category": "unknown",
      			"price": parseInputString(item["price-each"]),
      			"quantity": parseInputString(item["amount"])
    			};
		items.push(tItem);
		}
	}

	return items;
}

var getTransaction = function(transactionData){
	var tId = Math.floor((Math.random() * 1000000000) + 1); 
	for(var key in transactionData) {
		var item = transactionData[key]
		if(item["total"]) {
			return {
    			'transactionId': ''+tId,
    			'transactionAffiliation': "unknown",
    			'transactionTotal': parseInputString(item["total"]),
    			'transactionTax': parseInputString(item["tax"]),
    			'transactionShipping': parseInputString(item["shipping"]),
    			'transactionProducts': getTransactionItems(transactionData)
			}
    		}
	}
}
var parseInputString = function(str){
	if(typeof str == 'string') {
		//Strip anything from that String that is not a dot or number and replace comma with dot
		var replaced = str.replace(/[^0-9 ^. ^,]/g,"").replace(",",".");
		//Is there Any dot before the first Number? Then delete that dot
		while (replaced.search(/[.]/) != -1 && replaced.search(/[.]/) < replaced.search(/[0-9]/)){
				replaced = replaced.substring(replaced.search(/[.]/)+1)
			}
		return parseFloat(replaced);
	} else {
		return str;
	}
}

