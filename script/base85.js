var base85 = this.base85 = (function() {
  base85 = {};

  var encodeLookup =
    '0123456789' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    'abcdefghijklmnopqrstuvwqyz' +
    '!#$%&()*+-;<=>?@^_`{|}~';

  function div(a, b) {
    return (a - a % b) / b;
  }

  // @src  array of bytes to convert to base85
  //       (must be multiple of 4)
  base85.encode = function(src) {
    if (src % 4 == 0)
      throw "base85_encode: 'src' must contain a multiple of 4 bytes";

    $.each(src, function() {
      if (this < 0 || this > 255)
        throw "base85_encode: 'src' must contain values between 0-255";
    });

    dst = [];
    for (var i = 0; i < src.length; i += 4) {
      var combined =
        (src[i]     << 030) +
        (src[i + 1] << 020) +
        (src[i + 2] << 010) +
        (src[i + 3]);

      // convert to unsigned
      combined >>>= 0;

      var base = dst.length;
      for (var j = 4; j >= 0; j--) {
        dst[base + j] = encodeLookup[combined % 85];
        combined = div(combined, 85);
      }
    }

    return dst.join('');
  };

  return base85;
})();
