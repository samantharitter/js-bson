// var BSON = require('../../lib/mongodb').BSONNative.BSON,
//   ObjectID = require('../../lib/mongodb').BSONNative.ObjectID,
//   Code = require('../../lib/mongodb').BSONNative.Code,
//   Long = require('../../lib/mongodb').BSONNative.Long,
//   Binary = require('../../lib/mongodb').BSONNative.Binary,
//   debug = require('util').debug,
//   inspect = require('util').inspect,
// 
//   Long = require('../../lib/mongodb').Long,
//   ObjectID = require('../../lib/mongodb').ObjectID,
//   Binary = require('../../lib/mongodb').Binary,
//   Code = require('../../lib/mongodb').Code,  
//   DBRef = require('../../lib/mongodb').DBRef,  
//   Symbol = require('../../lib/mongodb').Symbol,  
//   Double = require('../../lib/mongodb').Double,  
//   MaxKey = require('../../lib/mongodb').MaxKey,  
//   MinKey = require('../../lib/mongodb').MinKey,  
//   Timestamp = require('../../lib/mongodb').Timestamp;
  

// var BSON = require('../../lib/mongodb').BSONPure.BSON,
//   ObjectID = require('../../lib/mongodb').BSONPure.ObjectID,
//   Code = require('../../lib/mongodb').BSONPure.Code,
//   Long = require('../../lib/mongodb').BSONPure.Long,
//   Binary = require('../../lib/mongodb').BSONPure.Binary;

var NEW_BSON = require('../lib/bson/bson.js').BSON,
        OLD_BSON = require('../lib/bson/oldbson.js').BSON,
	Long = require('../lib/bson').Long,
	ObjectID = require('../lib/bson').ObjectID,
	Binary = require('../lib/bson').Binary,
	Code = require('../lib/bson').Code,  
	DBRef = require('../lib/bson').DBRef,  
	Symbol = require('../lib/bson').Symbol,  
	Double = require('../lib/bson').Double,  
	MaxKey = require('../lib/bson').MaxKey,  
	MinKey = require('../lib/bson').MinKey,  
	Timestamp = require('../lib/bson').Timestamp;

// console.dir(require('../lib/bson'))
var COUNT = 100;

var object = {
  string: "Strings are great",
  decimal: 3.14159265,
  bool: true,
  integer: 5,
  date: new Date(),
  double: new Double(1.4),
  id: new ObjectID(),
  min: new MinKey(),
  max: new MaxKey(),
  symbol: new Symbol('hello'),
  long: Long.fromNumber(100),
  bin: new Binary(new Buffer(100)),
  
  subObject: {
    moreText: "Bacon ipsum dolor sit amet cow pork belly rump ribeye pastrami andouille. Tail hamburger pork belly, drumstick flank salami t-bone sirloin pork chop ribeye ham chuck pork loin shankle. Ham fatback pork swine, sirloin shankle short loin andouille shank sausage meatloaf drumstick. Pig chicken cow bresaola, pork loin jerky meatball tenderloin brisket strip steak jowl spare ribs. Biltong sirloin pork belly boudin, bacon pastrami rump chicken. Jowl rump fatback, biltong bacon t-bone turkey. Turkey pork loin boudin, tenderloin jerky beef ribs pastrami spare ribs biltong pork chop beef.",
    longKeylongKeylongKeylongKeylongKeylongKey: "Pork belly boudin shoulder ribeye pork chop brisket biltong short ribs. Salami beef pork belly, t-bone sirloin meatloaf tail jowl spare ribs. Sirloin biltong bresaola cow turkey. Biltong fatback meatball, bresaola tail shankle turkey pancetta ham ribeye flank bacon jerky pork chop. Boudin sirloin shoulder, salami swine flank jerky t-bone pork chop pork beef tongue. Bresaola ribeye jerky andouille. Ribeye ground round sausage biltong beef ribs chuck, shank hamburger chicken short ribs spare ribs tenderloin meatloaf pork loin."
  },
  
  subArray: [1,2,3,4,5,6,7,8,9,10],
  anotherString: "another string",
  code: new Code("function() {}", {i:1})
};

// --------------------
// TEST 1
// timed serialization
var serializeObjects = function(bson, numberOfObjects, print) {
    var s = new Date().getTime();
    for(var i = 0; i < numberOfObjects; i++) {
	var objectBSON = bson.serialize(object, null, true)  
    }
    if (print) {
	var e = new Date().getTime();
	console.log("----------------------");
	console.log("serializing " + numberOfObjects + " times");
	console.log("====================== " + (e - s) + " total :: " + ((e - s)/numberOfObjects) + " avg");
    }
};

// Number of objects
var numberOfObjects = 1000;
var oldbson = new OLD_BSON([Long, ObjectID, Binary, Code, DBRef, Symbol, Double, Timestamp, MaxKey, MinKey]);
var newbson = new NEW_BSON([Long, ObjectID, Binary, Code, DBRef, Symbol, Double, Timestamp, MaxKey, MinKey]);

// load in array of large objects
var randomLargeObjects = require('./randomarray.json');

// load in the large object
var largeObj = require('./11mb.json');

// --------------------
// TEST 2
// timed deserialization
var deserializeObjects = function(bson, numberOfObjects, print) {
    
    var objectBSON = bson.serialize(object, null, true);
    var s = new Date().getTime();
    for(var i = 0; i < numberOfObjects; i++) {
	bson.deserialize(objectBSON);
    }
    if (print) {
	var e = new Date().getTime();
	console.log("----------------------");
	console.log("deserializing " + numberOfObjects + " times");
	console.log("====================== " + (e - s) + " total :: " + ((e - s)/numberOfObjects) + " avg");
    }
};

// --------------------
// TEST 3
// large (12 - 16MB) documents
var handleLargeDocuments = function(bson, numberOfObjects, print) {
    var s = new Date().getTime();
    // would do more rounds, but it just takes so long...
    for (var i = 0; i < numberOfObjects; i++) {
	var serialized = bson.serialize(largeObj, null, true);
	bson.deserialize(serialized);
    }
    if (print) {
	var e = new Date().getTime();
	console.log("----------------------");
	console.log("handling " + numberOfObjects + " large objects");
	console.log("====================== " + (e - s) + " total :: " + ((e - s)/numberOfObjects) + " avg");
    }
};

// --------------------
// TEST 4
// randomly sized objects
var randomlySizedObjects = function(bson, n, print) {
    var s = new Date().getTime();
    // would do more rounds, but it just takes so long...
    for (var i = 0; i < randomLargeObjects.length; i++) {
	var serialized = bson.serialize(randomLargeObjects[i], null, true);
	bson.deserialize(serialized);
    }
    if (print) {
	var e = new Date().getTime();
	console.log("----------------------");
	console.log("handling " + numberOfObjects + " randomly-sized objects");
	console.log("====================== " + (e - s) + " total :: " + ((e - s)/numberOfObjects) + " avg");
    }
}

// --------------------
// PRIME AND RUN
var primeAndRun = function(fn, bson, numberOfObjects) {
    for (var i = 0; i < 5; i++) {
	fn(bson, numberOfObjects, false);
        process.stdout.write(".");
    }
    process.stdout.write("\n");
    fn(bson, numberOfObjects, true);
}

// --------------------
// RUN ALL TESTS
var runAllTests = function(bson, numberOfObjects) {
    primeAndRun(serializeObjects, bson, numberOfObjects);
    primeAndRun(deserializeObjects, bson, numberOfObjects);
    primeAndRun(handleLargeDocuments, bson, 100);
    primeAndRun(randomlySizedObjects, bson, numberOfObjects);
};

// run on OLD BSON first (new buffers each time)
console.log("\nTesting the OLD implementation-->\n");
runAllTests(oldbson, numberOfObjects);

// then on NEW BSON (one master buffer)
console.log("\nTesting the NEW implementation-->\n");
runAllTests(newbson, numberOfObjects);

// // Buffer With copies of the objectBSON
// var data = new Buffer(objectBSON.length * numberOfObjects);
// var index = 0;
// 
// // Copy the buffer 1000 times to create a strea m of objects
// for(var i = 0; i < numberOfObjects; i++) {
//   // Copy data
//   objectBSON.copy(data, index);
//   // Adjust index
//   index = index + objectBSON.length;
// }
// 
// // console.log("-----------------------------------------------------------------------------------")
// // console.dir(objectBSON)
// 
// var x, start, end, j
// var objectBSON, objectJSON
// 
// // Allocate the return array (avoid concatinating everything)
// var results = new Array(numberOfObjects);
// 
// console.log(COUNT + "x (objectBSON = BSON.serialize(object))")
// start = new Date
// 
// // var objects = BSON.deserializeStream(data, 0, numberOfObjects);
// // console.log("----------------------------------------------------------------------------------- 0")
// // var objects = BSON.deserialize(data);
// // console.log("----------------------------------------------------------------------------------- 1")
// // console.dir(objects)
// 
// for (j=COUNT; --j>=0; ) {  
//   var nextIndex = BSON.deserializeStream(data, 0, numberOfObjects, results, 0);
// }
// 
// end = new Date
// var opsprsecond = COUNT / ((end - start)/1000);
// console.log("bson size (bytes): ", objectBSON.length);
// console.log("time = ", end - start, "ms -", COUNT / ((end - start)/1000), " ops/sec");
// console.log("MB/s = " + ((opsprsecond*objectBSON.length)/1024));
// 
// // console.dir(nextIndex)
// // console.dir(results)


