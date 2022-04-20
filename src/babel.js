async function start() {
  return await Promise.resolve("Async is working");
}
start().then(console.log);

const unused = 22;

class Util {
  static id = Date.now();
}
console.log("Util.id = ", Util.id);
console.log(unused);

import("lodash").then(({ default: _ }) => { console.log("Lodash\t", _.random(0, 27, true)); });