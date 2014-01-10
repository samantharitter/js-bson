var BSON = require('../lib/bson/bson.js').BSON;
var fs = require('fs');

// a large string, size is closest multiple of 100 to number given.
var longAString = function(size) {
    s = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    for (var i = 0; i < (Math.floor(size/100)); i++) {
	s += s;
    }
    return s;
};

// create and return a large object of size between min and max
// or, if not specified, between 12 - 16 MB
// min and max are expected to be integers representing KB  
var largeObject = function(min, max) {
    var obj = {};
    var base = min != null ? Math.floor(min/10) : 1200;
    var diff = (max != null && max > (10*base)) ? (Math.floor(max/10) - base) : 400;

    var reps = Math.floor(Math.random()*200);
    if (Math.random() < .4) reps = Math.floor(reps/6);
    for (var i = 0; i < reps; i++) {
	obj[i] = longAString(Math.floor(Math.random()*diff) + base);
    }
    return obj;
};

// generate a large object
var generateLarge = function() { 
    var found = false;
    for (var i = 0; i < 1000; i++) {
	if (!found) {
	    var o = largeObject();
	    var size = BSON.calculateObjectSize(o);
	    if (size > 10000000) {
		found = true;
		console.log(size);
		fs.writeFile('largeobj.json', JSON.stringify(o), function(err) {
		    if (err != null) console.log("error writing to file");
		});
	    }
	}
    }
    if (!found) console.log("no object large enough");
};

// generate and return an array of n randomly sized objects
var fillArray = function(n) {
    var objects = [];
    for (var i = 0; i < n; i++) {
	var o = largeObject(1, 11000);
	console.log(BSON.calculateObjectSize(o));
	objects.push(o);
    }
    fs.writeFile('randomarray.json', JSON.stringify(objects), function(err) {
	if (err != null) console.log("Error writing to file: " + err);
    });
}

//generateLarge();
fillArray(400);

