


var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    os = require("os")


port = process.argv[2] || 9999;

var WebSocketServer = require('ws').Server;
var pwm = null, adc = null, pwmErrorCount = 0, adcErrorCount = 0;
var pwmError = null, adcError = null;

var logs = [];

try {
    var PwmDriver = require("adafruit-i2c-pwm-driver");
    pwm = new PwmDriver(0x40);
    pwm.setPWMFreq(50);
}
catch (err) {
    pwmError = { type: "error", message: "Cannot connect to PWM driver, please check connection" };
}

try {
    var mcp3008 = require('mcp3008.js');
    adc = new mcp3008();
}
catch (err) {
    adcError = { type: "error", message: "Cannot connect to MCP3008 driver, please check connection" };
}

var app = http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname
      , filename = path.join(process.cwd() + '/app', uri);

    var contentTypesByExtension = {
        '.html': "text/html",
        '.css': "text/css",
        '.js': "text/javascript"
    };

    fs.exists(filename, function (exists) {
        if (!exists) {
            response.writeHead(404, { "Content-Type": "text/plain" });
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.write(err + "\n");
                response.end();
                return;
            }

            var headers = {};
            var contentType = contentTypesByExtension[path.extname(filename)];
            if (contentType) headers["Content-Type"] = contentType;
            response.writeHead(200, headers);
            response.write(file, "binary");
            response.end();
        });
    });
}).listen(parseInt(port, 10));


var wss = new WebSocketServer({ server: app });
wss.on('connection', function (ws) {
   
    if (pwmError != null) {
        logs.push(pwmError);
    }

    if (adcError != null) {
        logs.push(adcError);
    }


    ws.on('message', function (message) {

        if (message instanceof Buffer) {
                for (var i = 0; i < 16; i++) {
                    var value = message.readUInt16LE(i * 2);
                    if (value != 0) {
                        try {

                            pwm.setPWM(i, 0, value);
                            pwmErrorCount = 0;
                        }
                        catch (e) {
                            
                            if ((pwmErrorCount % 1000 == 0)) {
                                logs.push({ type: "error", message: "Cannot connect to PWM driver, please check connection" });
                                BroadcastLogs();
                                pwmErrorCount = 0;
                            }
                            pwmErrorCount++;
                        }
                    }
                }
 
        }
        else if (message.type == "sr") {

                if (message.cmd.type == "adcStart") {
                    try {
                        adc.poll(message.cmd.data.ch, message.cmd.data.int, function (value) {
                            
                            ws.send({ type: 'sdr', dt: 'adc', idx: message.cmd.data.ch, result: [value] });

                        });
                    }
                    catch (e) {

                        logs.push({ type: "log", message: "Could not start adc polling on channel: " + message.cmd.data.ch + ', Please Check ADC status' });
                    }

                }
                else if (message.cmd.type == "adcStop") {
                    try {
                        adc.stop(message.cmd.data.ch);
                    }
                    catch (e) {
                        logs.push({ type: "log", message: "Could not stop adc polling" });
                    }
                }
            
        }

    });


    setInterval(function () {
        if (ws.readyState == 1) {
            ws.send(JSON.stringify({ "type": "os", "data": { "freeMem": os.freemem(), "totalMem": os.totalmem(), "cpuLoad": os.loadavg() } }));

            if (logs.length > 0) {

                BroadcastLogs();
            }


        }
    }, 1000);




    ws.on('close', function () {
        shutdown();
        console.log('socet closed');
    })
});

function BroadcastLogs() {
    broadcast(JSON.stringify({ "type": "lgs", "data": logs }));
    logs = [];
}

function broadcast(data) {
    for (var i in wss.clients)
        wss.clients[i].send(data);
};




function shutdown() {
    if (pwm != null) {
        pwm.stop();
    }
    if (adc != null) {
        adc.close();
    }
}

process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    shutdown();
    return process.exit();
});


console.log("Running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");