function match(first, second) {
  if (first.length == 0 && second.length == 0) return true;

  if (first.length > 1 && first[0] == '*' && second.length == 0) return false;

  if ((first.length > 1 && first[0] == '?') ||
      (first.length != 0 && second.length != 0 && first[0] == second[0]))
    return match(first.substring(1), second.substring(1));

  if (first.length > 0 && first[0] == '*')
    return match(first.substring(1), second) ||
        match(first, second.substring(1));

  return false;
}

function test(first, second) {
  if (match(first, second))
    console.log(
        'Yes' +
        '<br>');
  else
    console.log(
        'No' +
        '<br>');
}

test('He*lo', 'Hello');          // Yes
test('He?lo*', 'HelloWorld');    // Yes
test('*pqrs', 'pqrst');          // No because 't' is not in first
test('*bc*bcd', 'abcdhghgbcd');  // Yes
test('*b*f*', 'abcdefg');  // Yes
test('abc*c?d', 'abcd');  // No because second must have 2 instances of 'c'