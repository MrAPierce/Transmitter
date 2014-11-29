
var ws = null;
var transmitter = null;
var bufferedAmount = 72;
var dataRate = 20;
var data = null;



self.addEventListener('message', function (e) {

    switch (e.data.cmd) {

        case "setupSocket":
            data = new Uint16Array(16);
            SetupWebSocket(e.data.url)
            break;
        case "bufferAmount":
            bufferedAmount = e.data.amount;
            postMessage({ type: "lgs", data: [{ type: "log", message: "WS Buffered Amount updated to: " + e.data.amount }] });
            break;
        case "dataRate":
            dataRate = e.data.rate;
            StopTrans();
            StartTrans();
            postMessage({ type: "lgs",data: [{ type: "log",  message: "Data rate updated to: " + e.data.rate  }] });
            break;
        case "startTrans":
            StartTrans();
            break;
        case "stopTrans":
            StopTrans();
            break;

        case "serverRequest":
            SendServerRequest({ type: 'sr', cmd: e.data.request });
            break;

        case "inputChange":
            data[e.data.input.channel] = e.data.input.value;
            break;

        case "unload":
            ws.close();
              
            break;
        default:
            postMessage({type:"lgs",data: [{ type: "log", message: "Unknown transmitter Command: " + e.data.cmd }] });
    }

});


function SetupWebSocket(url) {
    try
    {
        ws = new WebSocket(url);
        ws.onmessage = function (e) {
            postMessage(e.data);
        }

        ws.onclose = function (e) {
            if (transmitter != null) {
                StopTrans();
            }
        }

        ws.onerror = function (e) {
            postMessage({ type: "lgs", data: [{ type: "error", message: "Websocket error" }] });
        }


    }
    catch (e) {
        postMessage({ type: "lgs", data: [{ type: "log", message: "Error creating websocket: " + e.message }] });
    }

}

function StartTrans() {
    if (ws != null) {
        if (ws.readyState == 0) {
            
            transmitter = setInterval(function () {
                if (ws.bufferedAmount < bufferedAmount && data != null) {
                    ws.send(data, { binary: true, mask: true });
                }
            }, dataRate);
        }
        else
        {
            postMessage({ type: "lgs", data: [{ type: "log",  message: "Invaild websocket ready state: " + ws.readyState }] });
        }
    }
    else {
        postMessage({ type: "lgs", data: [{ type: "log",  message: "Socket Object is null, please check connecion to node server" }] });
    }

}

function StopTrans() {
    transmitter.clearInterval();
}

function SendServerRequest(data) {
    
    if (ws.readyState == 0) {
        ws.send(data);
    }
}
