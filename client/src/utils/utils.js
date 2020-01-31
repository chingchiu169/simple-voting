exports.IsHKID = function (str) {
  var strValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  // basic check length
  if (str.length < 8)
    return false;
  // handling bracket
  if (str.charAt(str.length - 3) === '(' && str.charAt(str.length - 1) === ')') {
    str = str.substring(0, str.length - 3) + str.charAt(str.length - 2);
  }
  // convert to upper case
  str = str.toUpperCase();
  // regular expression to check pattern and split
  var hkidPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
  var matchArray = str.match(hkidPat);
  // not match, return false
  if (matchArray === null) {
    return false;
  }
  // the character part, numeric part and check digit part
  var charPart = matchArray[1];
  var numPart = matchArray[2];
  var checkDigit = matchArray[3];
  // calculate the checksum for character part
  var checkSum = 0;
  if (charPart.length === 2) {
    checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
    checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
  } else {
    checkSum += 9 * 36;
    checkSum += 8 * (10 + strValidChars.indexOf(charPart));
  }
  // calculate the checksum for numeric part
  for (var i = 0, j = 7; i < numPart.length; i++ , j--) {
    checkSum += j * numPart.charAt(i);
  }
  // verify the check digit
  var remaining = checkSum % 11;
  var verify = remaining === 0 ? 0 : 11 - remaining;
  return verify === checkDigit || (verify === 10 && checkDigit === 'A');
}

exports.sort_object = function (o) {
  var sorted = {},
    key, a = [];
  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }
  a.sort();
  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}

exports.compare = function (a, b) {
  if (a.last_nom < b.last_nom) {
    return -1;
  }
  if (a.last_nom > b.last_nom) {
    return 1;
  }
  return 0;
}

exports.checkstatus = function (campaign) {
  if(new Date(campaign.start).getTime() > new Date().getTime()){
    return 0;
  }
  else if(new Date(campaign.start).getTime() < new Date().getTime() && new Date(campaign.end).getTime() > new Date().getTime()){
    return 1;
  }
  else if(new Date(campaign.end).getTime() < new Date().getTime()){
    return 2;
  }
}