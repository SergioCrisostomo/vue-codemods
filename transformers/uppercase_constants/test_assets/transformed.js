const MY_REPEATED_STRING = 'Some string';
let dynamicString = 'Dynamic string';
function foo() {
  return MY_REPEATED_STRING + '!' + MY_REPEATED_STRING;
}

function bar() {
  let MY_REPEATED_STRING = 'Some other string';
  return MY_REPEATED_STRING + '...';
}

const myUniqueString = 'I only show up once...';

console.log(foo(MY_REPEATED_STRING), bar(), dynamicString, MY_REPEATED_STRING);
