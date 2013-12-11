function init() {

	var cb = function(responseJSON) {
		window.webtv = {conf: JSON.parse(responseJSON)};
		initButtons(window.webtv.conf.buttons);

        // SonarViewer initialization
        var sn = new SonarViewer(window.webtv.conf.SonarViewer);
        // first call
        sn.refresh();
        // every 5s refresh it !
        setInterval(function (){
            sn.refresh();
        },5000);
	};

	var xhrSender = new Xhr();
	xhrSender.sendXhr("conf/init.json",cb);



 };

function initButtons(/*Array*/ buttonList) {
	var insertionNode = document.getElementById("eventContainer");
	for (var i = 0; i < buttonList.length ; i++) {
		var button = document.createElement('button');
		button.innerHTML = buttonList[i].displayName;
		button.setAttribute('type', 'button');
		button.setAttribute('name', buttonList[i].name);
		button.setAttribute('value', buttonList[i].url);
		button.setAttribute('class', 'css3button');

		button.addEventListener ('click', function (scope,method) {
			return function() {
       			method.apply(scope);
    		}
		}(button, this.loadIframe), false);

		/*button.setAttribute('onclick', function(scope, method) {
			return function() {
       			method.apply(scope);
    		}
		}(this, this.loadIframe));*/
		

		insertionNode.appendChild(button);
	};
};

function loadIframe() {
	document.getElementById("webtv_iframe").src = this.value;
};

var Xhr = function() {};
Xhr.prototype.getXMLHttpRequest = function() {
     var xhr = null;
    
    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch(e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }
    
    return xhr;
};

Xhr.prototype.sendXhr = function(url, callback,/*Optional*/ errorCallback, /*Optional*/callbackParams) {
    var xhr = this.getXMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseText,callbackParams ||{});
        } else {
            errorCallback && errorCallback(xhr.status,xhr.responseText);
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
};