const Gpio = require('onoff').Gpio;
const detector1 = new Gpio(23, 'in', 'both');
const detector2 = new Gpio(24, 'in', 'both');


console.log("starting");

console.log(detector1.readSync()); 
console.log(detector2.readSync()); 

detector1.watch((err, value) => console.log("detector1", value));
detector2.watch((err, value) => console.log("detector2", value));

process.on('SIGINT',_ => {
  console.log("over");
  detector1.unexport();
  detector2.unexport();
});
