var express = require('express');

var app = express();

app.use('/', express.static('./apps/'));

app.listen(8081, function () {
	console.log('Phaser is running at port 8081...');
});