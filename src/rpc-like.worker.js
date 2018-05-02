
// maybe makes it a little more interesting
const msgProcessor = (firstWord, args) => ( (args && args.length > 0) ? firstWord += " " + args.join(" ") : firstWord )

const errorMsg = origin => `Some error from '${origin}', unsure how to catch error properly :(`

const sayHello = args => {
  if ( Math.random() < 1/3 ) throw errorMsg('hello')
  self.postMessage({message: msgProcessor("Hello", args)});
};

const sayMeh = args => {
  if ( Math.random() < 1/3 ) throw errorMsg('meh')
  self.postMessage({message: msgProcessor("Meh", args)});
};

self.addEventListener('error', event => { throw event.data.message });

self.addEventListener('message', event => {
  const {method, args} = event.data;
  switch (method){
    case 'hello':
      return sayHello(args);
    case 'meh':
    default:
      sayMeh(args);
  }
});
