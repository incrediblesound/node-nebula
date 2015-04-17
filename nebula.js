var http = require('http');
var request_options = {
    host: '127.0.0.1',
    port: 1984,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
};

var nebula = {};

nebula.open = function(options, cb){
	cb = cb || function(){};
	var data = JSON.stringify(options);
	request_options.path = '/init';
	request_options.headers['Content-Length'] = Buffer.byteLength(data);
	var request = http.request(request_options, function(){
		cb();
	});
	request.write(data);
	request.end();
};

nebula.save = function(query, cb){
	cb = cb || function(){};
	var data = JSON.stringify(query);
	request_options.path = '/save';
	request_options.headers['Content-Length'] = Buffer.byteLength(data);
	var request = http.request(request_options, function(){
		cb();
	})
	request.write(data);
	request.end();
}

nebula.saveAll = function(query){
	var data = JSON.stringify(query);
	request_options.path = '/saveall';
	request_options.headers['Content-Length'] = Buffer.byteLength(data);
	var request = http.request(request_options)
	request.write(data);
	request.end();
}

nebula.query = function(query, cb){
	var data = JSON.stringify(query);
	request_options.path = '/query';
	request_options.headers['Content-Length'] = Buffer.byteLength(data);
	var request = http.request(request_options, function(res){
		retrieveData(res, function(data){
			data = parseNebulaResult(data)
			cb(data);
		})
	})
	request.write(data);
	request.end();
}

nebula.close = function(){
	request_options.path = '/close';
	request_options.headers['Content-Length'] = 16;
	var request = http.request(request_options);
	request.write('{"close":"true"}');
	request.end();
}

module.exports = nebula;

function retrieveData(res, cb){
	res.on('data', function(chunk) {
        chunk = chunk.toString();
        chunk = JSON.parse(chunk);
        cb(chunk);
    });
}

function parseNebulaResult(data){
	if(!Array.isArray(data)){
		return data;
	}
	var result = {};
	forEach(data, function(item, idx){
		if(!Array.isArray(item)){
			result.simpleStates = result.simpleStates || [];
			result.simpleStates.push(item);
		} else {
			if(result[item[0]] === undefined){
				result[item[0]] = [];
			}
			result[item[0]] = result[item[0]].concat(item[1]);
		}
	})
	return result;
}

function forEach(arr, fn){
	for(var i = 0, l = arr.length; i < l; i++){
		fn(arr[i], i);
	}
}
