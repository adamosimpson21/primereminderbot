module.exports = class Queue {
  constructor(...elements) {
    // Initializing the queue with given arguments
    this.elements = [...elements];
  }
  // Proxying the push/shift methods
  push(...args) {
    return this.elements.push(...args);
  }
  shift() {
    return this.elements.shift();
  }
  // Add some length utility methods
  get length() {
    return this.elements.length;
  }
  set length(length) {
    return this.elements.length = length;
  }
}