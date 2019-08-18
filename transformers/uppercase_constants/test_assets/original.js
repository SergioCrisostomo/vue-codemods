const myRepeatedString = 'Some string';
let dynamicString = 'Dynamic string';
function foo() {
  return myRepeatedString + '!' + 'Some string';
}

function bar() {
  let myRepeatedString = 'Some other string';
  return myRepeatedString + '...';
}

const myUniqueString = 'I only show up once...';

console.log(foo('Some string'), bar(), dynamicString, myRepeatedString);
