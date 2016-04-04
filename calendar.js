//Um eine Liste der Events anzuzeigen
//	Dieses Skript Tag:
//	<script src="https://apis.google.com/js/client.js?onload=initCalendar" type="text/javascript"></script>
// 	auf Seite einbinden wo Events angezeigt werden sollen.
//	Einbinden mit Jimdo HTML Element
//	Das eingebundene Skript Tag wird das unten stehende Skript benutzen.
//Events und Bilder:
//	Man kann Bilder einbinden.
//	Dafür in Jimdo unter [Design]-> [Eigenes Layout] -> [HTML] 
//	ganz unten im <div id="db"> im <div id="images"> ein <img name="[DER NAME MIT DEM DU DAS BILD REFERENZIEREN WIRST]" src="[DER DATEI NAME]"
//	hinzufügen
//	zB.: <div id="db" style="display:none;">
//		...
//		<div id="images">
//			...
//			<img name="meinBild" src="dateiname.png"/>
//
//	Die Bilddatei dateiname.png muss dann noch unter [Design]->  [Eigenes Layout] -> [Datein] hochgeladen werden.
//	Jetzt kann man mit folgender syntax im Google Calendar dieses Bild referenzieren:
//		In der Beschreibung des Events {"img":"meinBild"} einfügen. Egal wo im Text. 
//		Sollten wir später weitere Dinge brauchen, können wir sie ebenfalls so in die Beschreibung aufnehmen:
//		Dann schreibt man in die Beschreibung z.B.: {"img": "meinBild", "mitAnmeldebutton": "Nein!Bloßnicht"}

var categories = [];
var category = undefined;
var noCategory = true;

function setCategories() {
    var categorieDivs = $(".event-category");
    categorieDivs.each(function(){
       noCategory = false;
       categories[categories.length] = this.id;
       
    });
     

}

var initCalendar = function() { 
        setCategories();
        gapi.client.setApiKey(API_KEY);
        gapi.client.load('calendar', 'v3').then(makeRequest);
      };
var makeRequest = function() {
	var mintime = (new Date()).toISOString()
	mintime = mintime.substring(0,mintime.lastIndexOf("."))+"Z"
        var request = gapi.client.calendar.events.list({
          'calendarId': '76p5tpb8hh1307cblvncf2s9o8@group.calendar.google.com'
        });
        request.then(function(response) {
          appendResults(response.result);
        }, function(reason) {
          console.log('Error: ' + reason.result.error.message);
        });
      };
var appendResults = function(events){

	for(var key in events.items) {
		var event = events.items[key];
		appendResult(event);
		
	}
};

function isInFuture(event)
    {
        if(event["start"] && event["start"]["dateTime"])
        {
	
        	var now = (new Date()).getTime();
        	var eventStart = (new Date(event["start"]["dateTime"])).getTime();
		return now < eventStart;
        }
        return false;
    }

var appendResult = function(event)
    {
         if(isInFuture(event))
         {
                var eventStr = "<div class=\"calendarEvent\"><div class=\"text\">"
                var start = (event["start"]? event["start"]["dateTime"] : "");
		var end = (event["end"]? event["end"]["dateTime"] : "")
		var timeStr = getNiceTime(start,end) + "<br/>";
		var nameStr = "<h4 class=\"name\">" + event["summary"] + "</h4>";
                var registerButton = "<button class=\"eventRegister\" onclick=\"registerForEvent(\'"+event["summary"]+"\',\'"+start+"\',\'"+end+"\')\" >Kurs anfragen</button>"
		var descriptionStr = (event["description"] ?  getContent(event["description"],registerButton ) : "");	
		eventStr += nameStr + timeStr + (descriptionStr ? descriptionStr : registerButton +"</div>" )  +"</div>"
                if(category && categories.indexOf(category) != -1)
                {
                   $("#"+category).append(eventStr);
                } else if (noCategory){
		   $("#calendarDetails").append(eventStr);
                }
               
        }
    }

var registerForEvent = function(name,start,end) {
	sessionStorage.setItem("werkRegisterName", name);
	sessionStorage.setItem("werkRegisterStart", start);
	sessionStorage.setItem("werkRegisterEnd", end);
	window.location.href = "/kursanmeldung";
}
var getContent = function(contentStr, regButton) {
  if(contentStr) {	
	var text;
	var json;
	var image = "";
	if(contentStr.indexOf("{") != -1 && contentStr.lastIndexOf("}") != -1 
	   && contentStr.indexOf("{") < contentStr.lastIndexOf("}")){
		var jsonStr = contentStr.substring(contentStr.indexOf("{"), contentStr.lastIndexOf("}") +1 ); //+1 because from Index is inclusive while to Index is exclusive
		try{
			json = $.parseJSON(jsonStr)		
		} catch(error) {
			console.log(error)
		}	
		text = 	contentStr.substring(0,contentStr.indexOf("{")) + contentStr.substring(contentStr.lastIndexOf("}")).replace("}","");
	} else {
		text = contentStr;
	}
	if(json && json["img"]) {
		var imageSrc = $("#images img[name="+json["img"]+"]").attr("src");
		image = "<img src=\""+imageSrc+"\"/>";
	}
	if(json) {
           
           category = json["category"].trim();
        } else {
           
           category = undefined;
        }
         
	return "<div class=\"img\">" + image + "</div>" + text + "</div>"+regButton+"<div class=\"clear\"/>";
  }
  return "";
	
}
function getNiceTime(startStr, endStr){
  if(startStr && endStr){
        var start = new Date(startStr);
        var end = new Date(endStr);	
	var startDay = start.toLocaleDateString()
	var startClock = start.getHours() + ":" + (start.getMinutes() < 10  ? start.getMinutes() + "0" : start.getMinutes())
	var endDay = end.toLocaleDateString()
	var endClock = end.getHours() + ":" + (end.getMinutes() < 10  ? end.getMinutes() + "0" : end.getMinutes())
	var timeStr = "<span class=\"day gruen\">" + startDay +"</span>";
	timeStr += (startDay != endDay ? "<span class=\"day gruen\"> bis zum " + endDay +" jeweils</span>" : "");
	timeStr += "<span class=\"day gruen\"> von " + startClock +" bis "+ endClock +" Uhr</span>";
	return timeStr;
  }
  return "";
}

$(document).ready(function(){
	if (window.location.href.indexOf("kursanmeldung") != -1) {
		var name = sessionStorage.getItem("werkRegisterName");
		var start = sessionStorage.getItem("werkRegisterStart");
		var end = sessionStorage.getItem("werkRegisterEnd");
		if(name.length > 0 && start){
                         var sDate = new Date(start);
                         var sNice = sDate.getHours() + ":" + (sDate.getMinutes() < 10  ? sDate.getMinutes() + "0" : sDate.getMinutes());
                         var eDate = end ? new Date(end) : "";
                         var eNice = eDate ? eDate.getHours() + ":" + (eDate.getMinutes() < 10 ? eDate.getMinutes() + "0" : eDate.getMinutes()) : "";
			 var eventIdentifier = name  + " Am " + sDate.toLocaleDateString() + " Von " + sNice + (eNice ? " Bis " + eNice : "") 
			$("form input").first().val(eventIdentifier);
		} else {
			console.log("Error: SessionData not found")
		}

	}
});
