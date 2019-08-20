const MY_REPEATED_STRING = 'Some string';
const myRepeatedRegexp = /foobar/;
let dynamicString = 'Dynamic string';
function foo() {
  const signal = 'Some other string'.match(/foobar/) ? '!' : '-';
  return MY_REPEATED_STRING + signal + 'Some string';
}

function bar() {
  let MY_REPEATED_STRING = 'Some other string';
  return MY_REPEATED_STRING + '...';
}

const myUniqueString = 'I only show up once...';
const myOtherUniqueVariable = 'foobar'.match(/baz/);

console.log(foo('Some string'), bar(), dynamicString, MY_REPEATED_STRING);
