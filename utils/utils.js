exports.yyyymmddreadable = function (time) {
  var date = new Date(time);
  var mm = date.getMonth() + 1; // getMonth() is zero-based
  var dd = date.getDate();
  return [date.getFullYear(), '-' + (mm > 9 ? '' : '0') + mm, '-' + (dd > 9 ? '' : '0') + dd].join('');
}

exports.makestring = function (length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}