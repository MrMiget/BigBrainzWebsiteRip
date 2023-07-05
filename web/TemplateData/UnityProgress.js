Object.extend = function(destination, source) {
    for (var property in source) {
        if (source.hasOwnProperty(property)) {
            destination[property] = source[property];
        }
    }
    return destination;
};

var printStackTrace = function () {
    var e = new Error('dummy');
    var stack = e.stack;
    console.log(stack);
}
var guid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}
var _clearCache = function(urls) {
    if (urls.length < 1) {
        location.reload(true);
    }
    var url = urls.pop();
    if (url === undefined) {
        _clearCache(urls);
    }
    var r = new XMLHttpRequest()
    r.open("GET", url, true)
    r.setRequestHeader("Pragma", "no-cache")
    r.setRequestHeader("Expires", -1)
    r.setRequestHeader("Pragma", "no-cache")
    r.onreadystatechange = function () {
        if (r.readyState != 4) {
            return;
        }
        _clearCache(urls);
    };
    r.send();
}
var clearCache = function() {
    var urls = [Module.dataUrl,Module.codeUrl,Module.memUrl, 'index.html'];
    _clearCache(urls);
}
var getSiteCode = function(gameObjectName, callback) {
    console.log('Getting site code');
	if (QueryString.sitecode !== undefined) {
		SendMessage(gameObjectName, callback, QueryString.sitecode);	
	}        
	else if (QueryString.sc !== undefined) {
		SendMessage(gameObjectName, callback, QueryString.sc);	
	}   
	else if (QueryString.site_code !== undefined) {
		SendMessage(gameObjectName, callback, QueryString.site_code);	
	} else {
		SendMessage(gameObjectName, callback, '');
	}    
}
var getQueryValueFromKey = function(gameObjectName, callback, key) {
    console.log('Retrieving ' + key + ' from query string');
    if (QueryString[key] === undefined) {
        SendMessage(gameObjectName, callback, '');
    } else {
        SendMessage(gameObjectName, callback, QueryString[key]);
    }
}
var openUrlInNewWindow = function(link)
{
	var url = Pointer_stringify(link);
	document.onmouseup = function()
	{
		window.open(url);
		document.onmouseup = null;
	}
}
var showRecacheMessage = function () {
    document.getElementsByClassName('slider')[0].style.display = 'none';
    document.getElementById('cache-message').style.display = 'inline';
}
var getHREF = function() {
    return location.href;
}
var parseFinish = function () {
    var duration = ((new Date()).getTime() - window.unityProgress.startParseTime) / 1000;
    logMe('Info', '[BBParse][AssetTag:JSCore, Measurement:' + duration + ']', {AssetTag:'JSCore', Measurement: duration});
}
function UnityProgress (dom) {
    this.speedMbps = 0;
    this.loggedSpeed = false;
    this.startTime = (new Date()).getTime();
    this.startParseTime = -1;
	this.progress = 0.0;
	this.message = "";
	this.dom = dom;
    this.state = 'downloading';
    this.stopUpdating = false;
    this.duration = 0;
    this.update_count = 0;
    this.updateBytes = [];

    var parent = dom.parentNode;

	var background = document.createElement("div");
	background.style.background = "#ffffff";
	background.style.position = "absolute";
	parent.appendChild(background);
	this.background = background;

    var logoImageColor = document.createElement("img");
    logoImageColor.src = "imgs/scratch_loading.png";
    logoImageColor.style.position = "absolute";
	logoImageColor.style.clip = 'rect(0px 128px 256px 0px)';
    logoImageColor.className = 'center';
    parent.appendChild(logoImageColor);
    this.logoImageColor = logoImageColor;

	var logoImageGray = document.createElement("img");
	logoImageGray.src = "imgs/scratch_loading.png";
	logoImageGray.style.position = "absolute";
    logoImageGray.style.clip = 'rect(0px 128px 256px 0px)';
    logoImageGray.className = 'center gray';
	parent.appendChild(logoImageGray);
	this.logoImageGray = logoImageGray;

	var messageArea = document.createElement("p");
	messageArea.style.position = "absolute";
	parent.appendChild(messageArea);
	this.messageArea = messageArea;

    var loadingImage = document.createElement("img");
    loadingImage.src = "imgs/LoadingCircle.png";
    loadingImage.style.width = '32px';
    loadingImage.style.height = '32px';
    loadingImage.style.opacity = '0.5';
    loadingImage.className = "rotating";
    loadingImage.style.position = "absolute";
    parent.appendChild(loadingImage);
    this.loadingImage = loadingImage;

	this.parent = parent;

    this.gauge;

    this.setupGauge = function() {
        this.gauge = new Gauge({
            renderTo: 'gauge-speed2',
            width: 150,
            height: 150,
            glow: true,
            units: 'mbps',
            title: false,
            minValue: 0,
            maxValue: 30,
            majorTicks: ['0', '5', '10', '15', '20', '25', '30'],
            minorTicks: 2,
            strokeTicks: true,
            highlights: [{from: 0, to: 1, color: 'rgba(200, 50, 50, .75)'}, {from: 1, to: 5, color: 'rgba(255, 255, 20, .75)'}, {from: 5, to: 30, color: 'rgba(0, 255, 20, .75)'}],
            colors: {
                plate: '#fff',
                majorTicks: '#000',
                minorTicks: '#222',
                title: '#fff',
                units: '#000',
                numbers: '#000',
                needle: {
                    start: 'rgba(200, 50, 50, .75)',
                    end: 'rgba(200, 50, 50, .75)',
                    circle: {
                        outerStart: 'rgba(200, 200, 200, 1)',
                        outerEnd: 'rgba(200, 200, 200, 1)'
                    },
                    shadowUp: true,
                    shadowDown: false
                },
                circle: {
                    shadow: false,
                        outerStart: '#fff',
                        outerEnd: '#fff',
                        middleStart: '#fff',
                        middleEnd: '#fff',
                        innerStart: '#fff',
                        innerEnd: '#fff'
                },
                valueBox: {
                    rectStart: '#222',
                    rectEnd: '#333',
                    background: '#babab2',
                    shadow: 'rgba(0, 0, 0, 1)'
                }
            },
            valueBox: {
                visible: true
            },
            valueText: {
                visible: true
            },
            needle: {
                type: 'arrow',
                width: 2,
                end: 72,
                circle: {
                    size: 7,
                    inner: false,
                    outer: true
                }
            },
            animation: {
                delay: 10,
                duration: 1000,
                fn: 'linear'
            },
            updateValueOnAnimation: true
        });
        this.gauge.draw();
    }

	this.SetProgress = function (progress) {
        if (this.state == 'preparing') {
            this.Update();
            return;
        }
		if (this.progress < progress) {
            this.progress = progress;
            this.state = 'downloading';
        } else {
            this.state = 'loading';
        }
        if (this.progress === 1) {
            if (this.startParseTime == -1) {
                this.startParseTime = (new Date()).getTime();
            }
            this.duration = ((new Date()).getTime() - this.startTime) / 1000;
            this.state = 'loading';
        }
		this.Update();
	}

	this.SetMessage = function (message) {
        if (message.startsWith('Preparing') && ! this.loggedSpeed ) {
            this.loggedSpeed = true;
            logMe('Info', '[BBDownload][AssetTag:JSCore, NetInMBPS:' + this.speedMbps + ', Measurement:' + this.duration + ']', {AssetTag:'JSCore', NetInMBPS: this.speedMbps, Measurement: this.duration});
        }
        if (message.startsWith('Preparing')) {
            this.state = 'preparing';
        }
        if (!this.stopUpdating) {
            this.showResults(message);
        }
		this.message = message;
		this.background.style.display = "inline";
		this.logoImageGray.style.display = "inline";
		this.logoImageColor.style.display = "inline";
        this.messageArea.style.display = "inline";
		this.Update();
	}

	this.Clear = function() {
		this.background.style.display = "none";
		this.logoImageGray.style.display = "none";
        this.logoImageColor.style.display = "none";
        this.messageArea.style.display = "none";
        this.loadingImage.style.display = "none";
        document.getElementById('gauge-wrapper').style.display = 'none';
        this.stopUpdating = true;
	}

	this.Update = function() {
        this.background.style.top = this.dom.offsetTop + 'px';
        this.background.style.left = this.dom.offsetLeft + 'px';
        this.background.style.width = this.dom.offsetWidth + 'px';
        this.background.style.height = this.dom.offsetHeight + 'px';

        var logoImg = new Image();
        if (this.state === 'preparing') {
            this.background.style.display = "none";
            this.logoImageGray.style.display = "none";
            this.logoImageColor.style.display = "none";
            this.messageArea.style.display = "none";
            this.loadingImage.style.display = "none";
            this.messageArea.style.display = "inline";
            this.messageArea.innerHTML = this.message
        }
        if (this.state === 'downloading') {
            logoImg.src = this.logoImageGray.src;
            this.logoImageGray.style.width = logoImg.width+'px';
            this.logoImageGray.style.height = logoImg.height+'px';
            var completed = Math.ceil(this.progress * 256)
            var percent = 256 - completed;
            this.logoImageGray.style.clip = 'rect(0px 128px ' + percent + 'px 0px)';

            var logoImgColor = new Image();
            logoImgColor.src = this.logoImageColor.src;
            this.logoImageColor.style.width = logoImgColor.width+'px';
            this.logoImageColor.style.height = logoImgColor.height+'px';
            this.logoImageColor.style.clip = 'rect(' + percent + 'px 128px 256px 0px)';

            this.messageArea.style.top = this.logoImageColor.offsetTop + this.logoImageColor.height + 'px';
            this.messageArea.style.left = 0;
            this.messageArea.style.width = '100%';
            this.messageArea.style.textAlign = 'center';
            if (this.message.startsWith('Downloading')) {
                var re = /\(([0-9]+)\/([0-9]+)\)/;
                var match = re.exec(this.message);
                if (match !== null) {
                    var dl = match[1];
                    var total = match[2];
                    this.messageArea.innerHTML = 'Downloading data... (' + Math.round(dl / 10000) / 100 + '/' + Math.round(total / 10000) / 100 + ')';
                }
            } else {
                this.messageArea.innerHTML = this.message
            }

            this.loadingImage.style.display = "none";

            document.getElementById('gauge-wrapper').style.display = 'inline';
        }
        if (this.state === 'loading') {
            this.background.style.display = "none";
            this.logoImageGray.style.display = "none";
            this.logoImageColor.style.display = "none";

            logoImg.src = this.loadingImage.src;
            this.loadingImage.style.display = "inline";
            this.loadingImage.style.top = this.dom.offsetTop + (this.dom.offsetHeight * 0.5 - 32 * 0.5) + 'px';
            this.loadingImage.style.left = this.dom.offsetLeft + (this.dom.offsetWidth * 0.5 - 32 * 0.5) + 'px';
            this.messageArea.style.top = parseInt(this.loadingImage.style.top.slice(0, -2)) + 32 + 'px';
            this.messageArea.innerHTML = 'Loading...';
            document.getElementById('gauge-wrapper').style.display = 'none';
        }
	}
    this.showResults = function(message) {
        var bitsLoaded = parseInt(message.split('/')[0].split('(')[1]) * 8;
        var lastBitsLoaded = 0;
        var lastTimestamp = this.startTime;
        if (this.update_count % 5 - 1 > -1) {
            lastBitsLoaded = this.updateBytes[this.update_count % 5 - 1].bitsDownloaded;
            lastTimestamp = this.updateBytes[this.update_count % 5 - 1].timestamp;
        }
        this.updateBytes[this.update_count % 5] = {}
        this.updateBytes[this.update_count % 5].bitsDownloaded = bitsLoaded;
        this.updateBytes[this.update_count % 5].timestamp = (new Date()).getTime();

        var downloadedBits = this.updateBytes[this.update_count % 5].bitsDownloaded - lastBitsLoaded;
        var downloadDuration = (this.updateBytes[this.update_count % 5].timestamp - lastTimestamp) / 1000;

        var speedBps = (downloadedBits / downloadDuration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        this.speedMbps = (speedKbps / 1024).toFixed(2);
        this.updateBytes[this.update_count % 5].mbps = parseFloat(this.speedMbps)
        if(this.update_count >= 5) {
            var sum = 0;
            for(var i = 0; i < 5; i++) {
                if (this.updateBytes[i].mbps === undefined) {
                    continue;
                }
                sum += this.updateBytes[i].mbps;
            }
            this.speedMbps = sum / 5;
            if (this.speedMbps === Infinity) {
                this.speedMbps = 30;
            }
        }
        document.getElementsByClassName('hider')[0].style.width = Math.min(100, Math.max(0, 100 - this.speedMbps * 100 / 30)) + '%';
        document.getElementById('mbps').innerHTML = parseFloat(this.speedMbps).toFixed(2) + ' Mbps';
        if (document.getElementById('mbps').innerHTML.indexOf('NaN') > -1 || parseFloat(this.speedMbps).toFixed(2) < 0) {
            document.getElementById('mbps').innerHTML = '';
        }
        this.update_count += 1;
    }
    window.sessionID = guid();
	this.Update ();
    window.unityProgress = this;
    slideShow();
}