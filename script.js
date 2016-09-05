$(document).ready(function(){
	function testNumLength(num) {
		var numStr = num.toString();
		// console.log('numStr: '+numStr);
		if (typeof(num) === 'string') {
			if (num.length > 9) {
				number = '';
				keystrokes = '';
				// console.log('show num after hitting limit: '+num);
				totaldiv.text('9 chr limit');
			} else {
				totaldiv.text(num);
			}
		} else if (typeof(num) === 'number') {
			if (numStr.length > 10) {
				// console.log('numStr is more than 10 characters');
				if (num >= 1) {
					// console.log('num is more than 1');
					if (num > 1000000000) {
						// console.log('num is more than 1 billion');
						totaldiv.text(num.toExponential(3));
					} else {
						// console.log('num is less than 1 billion');
						totaldiv.text(num.toString().slice(0,9));
					}
				} else if (num > 0 && num < 1) {
					if (num < 0.00001) {
						// console.log('num is less than 0.00001');
						totaldiv.text(num.toExponential(3));
					} else if (num >= 0.00001) {
						// console.log('num is more than 0.00001');
						totaldiv.text(num.toString().slice(0,9));
					}
				} else if (num === 0) {
					// console.log('num is zero');
					totaldiv.text('0');
				} else if (num < 0 && num > -1) {
					// console.log('num is between -1 and 0');
					if (num > -0.00001) {
						// console.log('num is less than -0.00001');
						totaldiv.text(num.toExponential(3));
					} else if (num <= -0.00001) {
						// console.log('num is more than -0.00001');
						totaldiv.text(num.toString().slice(0,9));
					}
				} else if (num <= -1) {
					// console.log('num is less than -1');
					if (num <= -1000000000) {
						// console.log('num is less than -1 billion');
						totaldiv.text(num.toExponential(3));
					} else {
						// console.log('num is more than -1 billion');
						totaldiv.text(num.toString().slice(0,9));
					}
				}
			} else {
				// console.log('numStr is less than 10 characters');
				totaldiv.text(num.toString());
			}
		}
  };

	function testKeystrokesLength(ks, ans) {
		if (ans) {
			// console.log('there is an ans');
			if (ks.length > 29) {
				// console.log('29 or more chars: '+ks);
				var equalIndex = ks.indexOf('=');
				var front = ks.slice(0, equalIndex);
				var back = ks.slice(equalIndex+1);
				// console.log('front: '+front);
				// console.log('back: '+back);
				if (front.length > 14 && back.length > 14) {
					back = Number(back);
					keystrokesdiv.text('...'+front.slice(-11)+'='+back.toExponential(8).toString());
				} else if (front.length > 14 && back.length <= 14) {
					keystrokesdiv.text('...'+front.slice(-11)+'='+back);
				} else if (front.legnth <= 14 && back.length > 14) {
					keystrokesdiv.text(front+'='+back.toExponential(8).toString());
				} else if (front.length <= 14 && back.length <= 14) {
					keystrokesdiv.text(front+'='+back);
				}
				keystrokesdiv.text('...'+ks.slice(-26));
			} else {
				// console.log('less than 29 char: '+ks);
				keystrokesdiv.text(ks);
			}
		} else {
			// console.log('there is no ans');
			if (ks.length > 29) {
				// console.log('29 or more chars: '+ks);
				keystrokesdiv.text('...'+ks.slice(-26));
			} else {
				// console.log('less than 29 char: '+ks);
				keystrokesdiv.text(ks);
			}
		}
	}

	var number = '';
  var operator = '';
	var totaldiv = $('#total');
  var keystrokesdiv = $('#keystrokes');
	var keystrokes = '';
	var memory = '0';
	var answer = '';
	var answerRounded = '';
	var kslastchar = '';
	totaldiv.text('0');
  keystrokesdiv.text('0');

	function decimalPlaces(num) {
	  return (num.toString().split('.')[1] || '').length;
	}

	function roundoff(val, deci) {
		return Number(Math.round(val+'e'+deci)+'e-'+deci);
	}

	$('#mem').click(function() {
		// console.log('Memory button is clicked');
		memory = (parseFloat(memory, 10) + parseFloat(number, 10)).toString(10);
		// console.log('M+: '+memory);
	});

	$('#memrecall').click(function() {
		number = memory;
		// console.log('memrecall: '+number);
		testNumLength(number);
	});

  $('#numbers > a').not('#decimal').click(function(){
		// console.log('keystrokes: '+keystrokes);
		kslastchar = keystrokes.substr(-1);
		if (number.length === 0 && keystrokes.length === 0) {
			number += $(this).text();
			keystrokes += $(this).text();
		} else if (number.length === 0 && keystrokes.length !== 0) {
			if (kslastchar === '+' || kslastchar === '-' || kslastchar === '/' || kslastchar === '*') {
				// Cannot enter zero as first digit of number if
				if ($(this).text() !== '0') {
					if (keystrokes.indexOf('=') === -1) {
						// console.log('keystrokes does not contain =');
						number += $(this).text();
						keystrokes += $(this).text();
					} else {
						// console.log('keystrokes contains =');
						number = $(this).text();
						keystrokes = $(this).text();
					}
				} else {
					return number;
				}
			}
		} else if (number.length !== 0 && keystrokes.length !== 0) {
			number += $(this).text();
			keystrokes += $(this).text();
		}
		// console.log('number: '+number);
		// console.log('keystrokes after the = sign check: '+keystrokes);
		testNumLength(number);
		testKeystrokesLength(keystrokes);
  });

  $('#operators a').click(function(){
		if ($(this).attr('id') === 'divide') {
			operator = '/';
		} else if ($(this).attr('id') === 'multiply') {
			operator = '*';
		} else {
			operator = $(this).text();
		}
		// console.log('operator: '+operator);
		// console.log('keystrokes before check for equals: '+keystrokes);
		// console.log(number);
		// console.log(keystrokes);
		if (number.length === 0 && keystrokes.length === 0) {
			if (operator !== '-') {
				number = keystrokes = '';
			} else {
				keystrokes += operator;
				testNumLength(operator);
				testKeystrokesLength(keystrokes);
			}
		} else if (number.length === 0 && keystrokes.length === 1 && keystrokes.slice(-1) === '-') {
			testNumLength(keystrokes);
			testKeystrokesLength(keystrokes);
		} else {
			number = '';
			if (keystrokes.indexOf('=') === -1) {
				// console.log('keystrokes does not contain = sign');
				kslastchar = keystrokes.substr(-1);
				if (kslastchar === '+' || kslastchar === '-' || kslastchar === '/' || kslastchar === '*') {
					// console.log('keystrokes without operator: '+keystrokes);
					testKeystrokesLength(keystrokes);
				} else {
					totaldiv.text(operator);
					keystrokes += operator;
					// console.log('keystrokes + operator: '+keystrokes);
					testKeystrokesLength(keystrokes);
				}
			} else {
				totaldiv.text(operator);
				// console.log('keystrokes contains = sign');
				keystrokes = answerRounded + operator;
				testKeystrokesLength(keystrokes);
			}
		}
  });

	$('#numbers a#decimal').click(function() {
		if (number.length === 0 && keystrokes.length === 0) {
			number = keystrokes = '0.';
		} else {
			if (keystrokes.indexOf('=') === -1) {
				kslastchar = keystrokes.substr(-1);
				if (kslastchar === '+' || kslastchar === '-' || kslastchar === '/' || kslastchar === '*') {
					number = '0.';
					keystrokes += number;
				} else {
					var numOfDec = 0;
					for (i=0;i<number.length;i++) {
						if (number[i] === '.') {
							numOfDec += 1;
						}
					}
					if (numOfDec === 0) {
						number = number + '.';
						keystrokes += '.';
					}
				}
			}
		}
		testNumLength(number);
		testKeystrokesLength(keystrokes);
	});

  $('#side a#clear').click(function(){
		if (keystrokes.length > 1) {
			// console.log('number: '+number);
			// console.log('keystrokes before slice: '+keystrokes);
			if (number) {
				// console.log('there is a number entered');
				keystrokes = keystrokes.slice(0, -number.length);
				// console.log('keystrokes after slice: '+keystrokes);
				number = '';
			}
			// } else {
				console.log('there is no number entered');
			// 	if (keystrokes.substr(-1) === '+' || keystrokes.substr(-1) === '-' || keystrokes.substr(-1) === '*' || keystrokes.substr(-1) === '/') {
			// 		keystrokes = keystrokes.slice(0, -1);
			// 	}
			// }
			totaldiv.text('0');
			testKeystrokesLength(keystrokes);
		} else if (keystrokes = 1) {
			number = keystrokes = '';
			totaldiv.text('0');
			keystrokesdiv.text('0');
		}
  });

  $('#side a#clearall').click(function(){
    number = '';
		keystrokes = '';
		memory = '0'
		totaldiv.text('0');
    keystrokesdiv.text('0');
  });

  $('#equals').click(function(){
		// console.log('equal sign is pressed');
		// console.log('keystrokes in equals: '+keystrokes);
		// console.log('answer: '+answer);
		// console.log('answerRounded: '+answerRounded);
		if (keystrokes.indexOf('+') !== -1 || keystrokes.indexOf('-') !== -1 || keystrokes.indexOf('/') !== -1 || keystrokes.indexOf('*') !== -1) {
			if (keystrokes.indexOf('=') === -1) {
				if (answer) {
					// console.log('there is an answer');
					var re = new RegExp(answerRounded, "g");
					exact = keystrokes.replace(re, answer);
					// console.log('keystrokes after answerRounded replaced with answer: '+keystrokes);
					answer = eval(exact);
					number = answer;
				} else {
					// console.log('there is no answer');
					answer = eval(keystrokes);
					number = answer;
				}
				number = roundoff(number, 10);
				testNumLength(number);
				answerRounded = number.toString()
				keystrokes = keystrokes + '=' + answerRounded;
			} else {
				return keystrokes;
			}
			testKeystrokesLength(keystrokes);
		}
  });

	$(document).keypress(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if (keycode === 49) {
			$('#one').click();
	  } else if (keycode === 50) {
			$('#two').click();
		} else if (keycode === 51) {
			$('#three').click();
		} else if (keycode === 52) {
			$('#four').click();
		} else if (keycode === 53) {
			$('#five').click();
		} else if (keycode === 54) {
			$('#six').click();
		} else if (keycode === 55) {
			$('#seven').click();
		} else if (keycode === 56) {
			$('#eight').click();
		} else if (keycode === 57) {
			$('#nine').click();
		} else if (keycode === 48) {
			$('#zero').click();
		} else if (keycode === 46) {
			$('#decimal').click();
		} else if (keycode === 97) {
			$('#clearall').click();
		} else if (keycode === 99) {
			$('#clear').click();
		} else if (keycode === 61 || keycode === 13) {
			$('#equals').click();
		} else if (keycode === 43) {
			$('#plus').click();
		} else if (keycode === 45) {
			$('#minus').click();
		} else if (keycode === 42 || keycode === 120) {
			$('#multiply').click();
		} else if (keycode === 47) {
			$('#divide').click();
		}
	});
});


// Javascript keycodes http://www.k68.org/wp-content/uploads/2010/11/Key_Codes.htm

// Placing variables into regex, using replace function
// http://stackoverflow.com/questions/494035/how-do-you-pass-a-variable-to-a-regular-expression-javascript
// See answer by Gracenotes, on 2009 Jan 30
// And by Jeremy Ruten, on 2009 Jan 30
// And by unigogo, on 2009 Feb 1


// Rounding off long decimal places when using javascript floating-point arithmetic
// http://www.jacklmoore.com/notes/rounding-in-javascript/
// Number(Math.round(1.005+'e2')+'e-2')
// function round(value, decimals) {
//   return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
// }

// Finding number of decimal places of a number
// http://stackoverflow.com/questions/10454518/javascript-how-to-retrieve-the-number-of-decimals-of-a-string-number

// Rounding floats to certain decimal places.
// http://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
// See answer by MarkG, on 2013 Aug 21
