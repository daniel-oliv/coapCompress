console.log("Hi");
const Compressor = require('./compressor.js');
const PieData = require('./pieData');
const SmartBlock = require('./smartBlock');
const lzwEnc = require('./lzw_encoder.js');

// const addon = require('./build/Release/addon');

// //const runAddon = () => addon.helloWorld();
// const addonnGetBlocks = (block1, block2) => addon.getBlocks(block1, block2);

// //runAddon();
// addonnGetBlocks(
//     '00000001000614dda98326e300000800450000646ae040004011f6770a0062bd0a00627416441633005053084402000503020101b272644d0165703d7465737465646576696365086c743d383536373103623d55ff3c2f333331332f303e2c3c2f32363234322f303e2c3c2f32363234352f303e',
//     '00000001000614dda98326e30800080045000064130e400040114e4a0a0062bd0a00627416441633005053084402000503020101b272644d0165703d7465737465646576696365086c743d383536373103623d55ff3c2f333331332f303e2c3c2f32363234322f303e2c3c2f32363234352f303e'
//     );
    
 const block1 = Buffer.from("00000001000614dda98326e300000800450000646ae040004011f6770a0062bd0a00627416441633005053084402000503020101b272644d0165703d7465737465646576696365086c743d383536373103623d55ff3c2f333331332f303e2c3c2f32363234322f303e2c3c2f32363234352f303e", "hex");
 const block2 = Buffer.from("00000001000614dda98326e30800080045000064130e400040114e4a0a0062bd0a00627416441633005053084402000503020101b272644d0165703d7465737465646576696365086c743d383536373103623d55ff3c2f333331332f303e2c3c2f32363234322f303e2c3c2f32363234352f303e", "hex");

// //+ testing the concat and slice buffer, and if the includes works for
//  var block4 = new Buffer(block1.slice(1,1+1));
// var newPhrase;
//  console.log("vf", block1[0]);
//  console.log("vf", block4);
//  console.log("vf", block1.slice(6,6+1));

//  for (let index = 1; index < block1.length; index++) {
//     block4.writeInt8(block1[index]);
//  }
//  const block3 = Buffer.from("00000001000614dda98326e30800080045000064130e400040114e4a0a0062bd0a00627416441633005053084402000503020101b272644d0165703d7465737465646576696365086c743d383536373103623d55ff3c2f333331332f303e2c3c2f32363234322f303e2c3c2f32363234352f303e", "hex");

//  var arrayBuf = [];
// arrayBuf = push(block1);
// arrayBuf = push(block2);

// console.log(arrayBuf.includes(block3));

//+ lzw teste
let strCoded = lzwEnc.lzw_encode(block1.toString('hex'));
const bufDec =  Buffer.from(strDecoded, 'hex');
let strDecoded = lzwEnc.lzw_decode(strCoded);
const buffer5 = Buffer.from(strDecoded, 'hex');
console.log(buffer5);

 console.log("strCoded ",  strCoded);
 console.log("strDecoded ",  strDecoded);
console.log("buffer5 ",  buffer5.toString('hex'));

// const block1 = Buffer.from("33311133331143", "hex");
// const block2 = Buffer.from("33322233332234", "hex");

// const block1 = Buffer.from("33311133331143", "ascii");
// const block2 = Buffer.from("33322233332234", "ascii");
// const block1 = Buffer.from("133311133331143", "ascii");
// const block2 = Buffer.from("233322233332234", "ascii");
// const block1 = Buffer.from("13338811133331143", "ascii");
// const block2 = Buffer.from("233322233332234", "ascii");


///trying to compress using bytes
let data1 = new PieData(block1);
let data2 = new PieData(block2);
//data1.showCompleteEnumData(14);
//data2.showCompleteEnumData(14);

let compressor = new Compressor(data1, data2);
compressor.fillSmartBlocks();
//console.log(compressor.compress(data1));

//compressor.showSBs();

/////////////////////////////////// TinyCbor
// var CBOR = require('tinycbor');
 
// var obj = {"a" : 1, "b" : 2, "c" : [1, 2, 3]};
// var input = CBOR.encode(obj);
// var output = CBOR.decode(obj);

// console.log("input", input);
// console.log("input", input.length)

// console.log("lala");