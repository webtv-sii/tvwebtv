
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

Xhr.prototype.sendXhr = function(url, callback, errorCallback, callbackParams) {
    var xhr = this.getXMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(xhr.responseText,callbackParams);
        } else {
            errorCallback && errorCallback(xhr.status,xhr.responseText);
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
};


var nbViolations = {
    "BLOCKER" : 0,
    "CRITICAL" : 0,
    "MAJOR" : 0,
    "MINOR" : 0,
    "INFO" : 0
};

var cb = function(text, type) {
    type = type.toLowerCase();
    var obj = JSON.parse(text);
    console.log(obj.length);
    nbViolations[type] = obj.length;
    document.getElementById(type).innerHTML = nbViolations[type];
};


var cbDiff = function (text,type) {
    type = type.toLowerCase();
    var obj = JSON.parse(text)[0];
    var diff = obj.cells[0].v[0] - obj.cells[obj.cells.length-1].v[0];
    var color = "red";
    if (diff>0) {
        diff = "+"+diff;
        color = "green";
    }
    document.getElementById(type+"diff").innerHTML = diff;
    document.getElementById("criticaldiff").className = document.getElementById("criticaldiff").className + " " + color;
};


var urlBlocker =    "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities=BLOCKER&format=json";
var urlCritical =   "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities=CRITICAL&format=json";
var urlMajor =      "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities=MAJOR&format=json";
var urlMinor =      "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities=MINOR&format=json";
var urlInfo =       "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities=INFO&format=json";


var urlCriticalDiff = "http://10.194.63.32/sonar/api/timemachine?resource=com.orange.wptv:client:js&metrics=critical_violations&fromDateTime=2013-11-11T00:00:00+0100";

var xhrSender = new Xhr();
xhrSender.sendXhr(urlBlocker,cb,null,"BLOCKER");
xhrSender.sendXhr(urlCritical,cb,null,"CRITICAL");

xhrSender.sendXhr(urlCriticalDiff, cbDiff, null, "CRITICAL");

xhrSender.sendXhr(urlMajor,cb,null,"MAJOR");
xhrSender.sendXhr(urlMinor,cb,null,"MINOR");
xhrSender.sendXhr(urlInfo,cb,null,"INFO");

console.error(nbViolations);

