// module.exports = class Queue {
class Queue {
  constructor(...elements) {
    // Initializing the queue with given arguments
    this.elements = [...elements];
  }
  // Proxying the push/shift methods
  push(...args) {
    return this.elements.push(...args);
  }
  shift(...args) {
    return this.elements.shift(...args);
  }
  // Add some length utility methods
  get length() {
    return this.elements.length;
  }
  set length(length) {
    return this.elements.length = length;
  }
}


const messageQueue = new Queue(0,2);
let myFunc = function(num){
  console.log('helpmeImafunction', num)
}
function checkForMessages(){
  // if (messageQueue.length > 0 )
  // console.log(messageQueue.elements);
  console.log(messageQueue.elements.push(myFunc(321)));
  // console.log(messageQueue.elements);
  console.log(messageQueue.elements.shift());
  console.log(messageQueue.elements.shift());
  console.log(messageQueue);
}

module.exports = {checkForMessages}