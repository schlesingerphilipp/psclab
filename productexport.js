var parseList = function(){
	//var commaToDot = $("#unparsed").html().replace(/,/g,".");
	//var semiToComma = commaToDot.replace(/;/g,",");
	var validCsv = $("#unparsed").html().replace(/["']/g, "");
	var pro = validCsv.split(";");
	var productsProcessing = [];
	var j = 0;
	var i = 0;
	for(var processItem in pro) {
		if(i > 0 && i % 7 == 0) {
			var proItems = pro[processItem].split(" ");
			productsProcessing[j] = proItems[0]
			productsProcessing[j+1] = proItems.slice(1,proItems.length).join(" ");
			j++;j++;
			
		} else {
			productsProcessing[j] = pro[processItem];
			j++;
		}
		i++;
		
	}
	
	var products = {}
	var counter = 0;

	while (productsProcessing.length  > 0)
	{
		var productParts = productsProcessing.slice(0,8);
		var product = {'Bezeichnung':  productParts[0],
			'Variante' :productParts[1],
			'Artikel-Nr.' :productParts[2],
			'Bestellt' :productParts[3],
			'Bestand' :productParts[4],
			'Preis1' :productParts[5],
			'Preis2' :productParts[6],
			'Link' : productParts[7]
		};
		products[counter] = product;
		counter++;
		productsProcessing = productsProcessing.slice(8); //Slice this Line Off	
	}
	return products;
	};


$(document).ready(function(){
		window.parsed = parseList()
	});