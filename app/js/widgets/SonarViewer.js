var SonarViewer = function(conf) {
    this.levels = conf.levels;
    this.nbViolationsUrl = conf.nbViolationsUrl;
    this.diffViolationsUrl = conf.diffViolationsUrl;
    this.defaultDiffCssClass = conf.defaultDiffCssClass;
    this.defaultNbViolationCssClass = conf.defaultNbViolationCssClass;
};

SonarViewer.prototype.nbViolationsCallback = function(responseText,level) {
    var obj = JSON.parse(responseText);
    document.getElementById(level).innerHTML = obj.length;

    if (level == "critical" && obj.length>98) {
        document.getElementById("criticalline").className = this.defaultNbViolationCssClass + " blink";
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
},12*60*1000);