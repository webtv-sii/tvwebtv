
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
        } else if (errorCallback) {
            errorCallback(xhr.status,xhr.responseText);
        }
    };

    xhr.open("GET", url, true);
    xhr.send(null);
};




var SonarViewer = function() {
    this.levels = ["blocker", "critical", "major", "minor", "info"];
    this.nbViolationsUrl = "http://10.194.63.32/sonar/api/violations?resource=com.orange.wptv:client:js&depth=-1&priorities={$level}&format=json";
    this.diffViolationsUrl = "http://10.194.63.32/sonar/api/timemachine?resource=com.orange.wptv:client:js&metrics={$level}_violations&fromDateTime={$date}";
    this.defaultDiffCssClass = "diff";
    this.defaultNbViolationCssClass = "numbers";
};

SonarViewer.prototype.nbViolationsCallback = function(responseText,level) {
    var obj = JSON.parse(responseText);
    document.getElementById(level).innerHTML = obj.length;

    if (level == "critical" && obj.length>98) {
        document.getElementById("criticalline").className = "item blink";
    }
};

SonarViewer.prototype.diffViolationsCallback = function(text,level) {
    var obj = JSON.parse(text)[0];
    var diff =0;
    var color = "green";

    if (obj.cells.length>0) {
        diff = obj.cells[obj.cells.length-1].v[0] - obj.cells[0].v[0];
        
        if (diff>0) {
            diff = "+"+diff;
            color = "red";
        }
    }
    document.getElementById(level+"diff").innerHTML = diff;
    document.getElementById(level+"diff").className = this.defaultDiffCssClass + " " + color;
};

SonarViewer.prototype.refresh = function() {
    console.log("SonarViewer::refresh");
    var xhrSender = new Xhr();

    for (var idx in this.levels) {
        var level = this.levels[idx];
        var violationUrl = this.nbViolationsUrl.replace("{$level}",level.toUpperCase());
        xhrSender.sendXhr(violationUrl,this.nbViolationsCallback.bind(this),null,level);
        var diffUrl = this.diffViolationsUrl.replace("{$level}",level);
        
        var myDate=new Date();
        myDate.setDate(myDate.getDate()-30);

        diffUrl = diffUrl.replace("{$date}",myDate.toISOString());
        xhrSender.sendXhr(diffUrl,this.diffViolationsCallback.bind(this),null,level);
    }
};



var sn = new SonarViewer();
sn.refresh();
setInterval(function (){
    sn.refresh();
},5000);