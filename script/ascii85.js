/*
Originally from: http://pastie.textmate.org/pastes/695197

Copyright (c) 2009 Jacob Rus

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
*/

var ascii85 = this.ascii85 = (function () {
  var ascii85 = {};

  ascii85.Ascii85CodecError = function (message) { this.message = message; };
  ascii85.Ascii85CodecError.prototype.toString = function () {
    return 'Ascii85CodecError' + (this.message ? ': ' + this.message : '');
  };

  var assertOrBadInput = function (expression, message) {
    if (!expression) { throw new ascii85.Ascii85CodecError(message) };
  };

  var shorten = function (array, number) {
    // remove 'number' characters from the end of 'array', in place (no return)
    for (var i = number; i > 0; i--) { array.pop(); };
  };

  var rstrip = function (string, character) {
    // strip trailing 'character' characters from the end of the string 'string'
    var i = string.length;
    while (string[i - 1] === character) { i--; };
    return string.slice(0, i);
  };

  ascii85.encode = function (bytes) {
    assertOrBadInput(!(/[^\x00-\xFF]/.test(bytes)), 'Input contains out-of-range characters.'); // disallow two-byte chars
    var padding = '\x00\x00\x00\x00'.slice((bytes.length % 4) || 4);
    bytes += padding; // pad with null bytes
    var out_array = [];
    for (var i=0, n=bytes.length; i < n; i+=4) {
      var newchars = (
        (bytes.charCodeAt(i)   << 030) +
        (bytes.charCodeAt(i+1) << 020) +
        (bytes.charCodeAt(i+2) << 010) +
        (bytes.charCodeAt(i+3)));
      if (newchars === 0) {
        out_array.push(0x7a); // special case: 4 null bytes -> 'z'
        continue;
      };
      var char1, char2, char3, char4, char5;
      char5 = newchars % 85; newchars = (newchars - char5) / 85;
      char4 = newchars % 85; newchars = (newchars - char4) / 85;
      char3 = newchars % 85; newchars = (newchars - char3) / 85;
      char2 = newchars % 85; newchars = (newchars - char2) / 85;
      char1 = newchars % 85;
      out_array.push(char1 + 0x21, char2 + 0x21, char3 + 0x21,
                     char4 + 0x21, char5 + 0x21);
    };
    shorten(out_array, padding.length);
    return String.fromCharCode.apply(String, out_array)
  };

  return ascii85;
})();
