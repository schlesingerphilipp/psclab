
$(document).ready(function(){
	$("#cc-checkout-submit-0").click(function(){
		
		
		//var transactionId = Math.floor((Math.random() * 1000000000) + 1); 
		var counter = 1;
		var cookieString ="werkTransAction={"
		$("tr.cc-checkout-product").each(function(){
			var name = $(this).find(".cc-checkout-desc strong").html()
			var articleid = "No Article Id found";
			var price= "No each Price found";
			for(var product in parsed) {
				if(parsed[product]["Bezeichnung"] == name) 
				{
					
					if(parsed[product]["Artikel-Nr."].length > 0){
						articleid = parsed[product]["Artikel-Nr."];
					}
					if(parsed[product]["Preis2"].length > 0){
						price = parsed[product]["Preis2"];
					
				}
				}
			}
			var itemStr = "{"
			+ "\"article-id\" :"+  articleid + ","
			+ "\"name\" :\""+  name +"\","
			+ "\"amount\" :"+  $(this).find("input").val()+","
			+ "\"price-each\" :"+ price+","
			+ "\"total-price\" :\""+  $(this).find(".product-entry-total").html() +"\""
			+"}";			
			cookieString += "\"werkkisteItem"+counter+"\":"+ itemStr + ",";
			counter++;
		});
		var shipping = $("td.cc-checkout-number.cc-checkout-shippingcosts span").html();
		var tax = $(".including-tax").html();
		var total = $("td.cc-checkout-number.cc-checkout-total span").html();
		var overviewStr = ""
					+"{ \"total\" :\""+ total+"\","
					+"\"tax\" :\""+  tax+"\","
					+"\"shipping\" :\""+ shipping + "\""
					+"}"
		cookieString +=  "\"werkkisteOverview\""+":"+ overviewStr +"}";		
		document.cookie = cookieString;
		
		
	});
});
