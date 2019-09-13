console.log("Hi");
const Compressor = require('./compressor.js');
const PieData = require('./pieData');
const SmartBlock = require('./smartBlock');

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

///trying to compress using bytes
let data1 = new PieData(block1);
let data2 = new PieData(block2);
data1.showCompleteEnumData(14);
data2.showCompleteEnumData(14);

let compressor = new Compressor(data1, data2);
compressor.fillSmartBlocks();