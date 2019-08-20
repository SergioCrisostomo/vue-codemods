const MY_REPEATED_STRING = 'Some string';
const MY_REPEATED_REGEXP = /foobar/;
let dynamicString = 'Dynamic string';
function foo() {
  const signal = 'Some other string'.match(MY_REPEATED_REGEXP) ? '!' : '-';
  return MY_REPEATED_STRING + signal + MY_REPEATED_STRING;
}

function bar() {
  let MY_REPEATED_STRING = 'Some other string';
  return MY_REPEATED_STRING + '...';
}

const MY_UNIQUE_STRING = 'I only show up once...';
const myOtherUniqueVariable = 'foobar'.match(/baz/);

console.log(foo(MY_REPEATED_STRING), bar(), dynamicString, MY_UNIQUE_STRING, MY_REPEATED_STRING);
