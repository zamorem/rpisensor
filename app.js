const Gpio = require('onoff').Gpio;
const detector1 = new Gpio(23, 'in', 'both');
const detector2 = new Gpio(24, 'in', 'both');

const READY = 'ready';
const STANDBY = 'standby';

const LEFT = 'left';
const RIGHT = 'right';

let state = READY;
let firstEventDetector = null;
let firstEventTimeNs = null;

const detected = (detectorName, value) => {
  if(state !== READY || value === 0) {
    return;
  }

  if(firstEventDetector === null) {
    firstEventDetector = detectorName;
    [,firstEventTimeNs] = process.hrtime();
    return;
  }
  if(firstEventDetector !== detectorName) {
    state = STANDBY;
    return evaluate(firstEventDetector, process.hrtime()[1] - firstEventTimeNs);
  }

};

const evaluate = (firstName, deltaNs) => {
  console.log(firstName, deltaNs + ' ns');
  setTimeout(_=> {
    state = READY;
    firstEventDetector = null;
    firstEventTimeNs = null;
    console.log("ready")
  }, 1000 );

};





detector1.watch((err, value) => detected(LEFT, value));
detector2.watch((err, value) => detected(RIGHT, value));

process.on('SIGINT',_ => {
  console.log("over");
  detector1.unexport();
  detector2.unexport();
});
