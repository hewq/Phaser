let express = require('express');

let app = express();

app.use('/', express.static('./apps/'));
app.use('/demo', express.static('./demo/'));
app.use('/public', express.static('./public/'));

function getIPAddress() {
    let interfaces = require('os').networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

const LOCAL_IP = getIPAddress();

app.listen(8088, function() {
    console.log(`http://${LOCAL_IP}:8088`);
});