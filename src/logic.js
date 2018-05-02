import _ from 'underscore';
var proverbs;
$.ajax({
  url: 'proverbs.txt',
  dataType: 'text',
  success: function(data) {
    proverbs = data.split('\n');
    $('#sentence').html(getSentence());
  }
});

function startOver(howmany) {
  $.ajax({
    url: 'proverbs.txt',
    dataType: 'text',
    success: function(data) {
      proverbs = data.split('\n');
      proverbs = proverbs.splice(0, howmany);
      $('#sentence').html(getSentence());
    }
  });
}

let done = false;
let counter = 0;

function changeSentence() {
  $('#sentence').html(getSentence());
}

let currentString = '';
function getSentence() {
  if (proverbs.length > 0) {
    currentString = _.sample(proverbs);
    proverbs = _.without(proverbs, currentString);
    return currentString;
  } else {
    done = true;
    return 'done';
  }
}

$('#startover').on('click', function() {
  let howmany = $('#howmany').val();
  startOver(howmany);
});

let resultString = '';
let arrayOfInputs = [];
let finishedString = '';
let timestarted = false;

$(function() {
  if (done) {
    return;
  }
  $('#input').keydown(function(e) {
    if (!timestarted) {
      startClock();
    }
    if (e.key.length == 1) {
      resultString += e.key;
    } else if (e.key.toLowerCase() == 'backspace') {
      resultString += '>';
    } else if (e.key.toLowerCase() == 'arrowleft') {
      resultString += '←';
    } else if (e.key.toLowerCase() == 'arrowright') {
      resultString += '→';
    } else if (e.key.toLowerCase() == 'arrowup') {
      resultString += '↑';
    } else if (e.key.toLowerCase() == 'arrowdown') {
      resultString += '↓';
    } else if (e.key.toLowerCase() == 'enter') {
      commenceDoneProcedure(resultString);
      resultString = '';
    } else if (e.key.toLowerCase() == 'escape') {
      doneProcedure();
      return;
    }
    arrayOfInputs.push(e.timeStamp);
  });
});

function doneProcedure() {
  let wpmString = wpm();
  $('#result').html('wmp: ' + wpmString + '<br>' + finishedString);
  done = true;
  $('#input').prop('disabled', true);
  startOver();
}

let time = 0;
let howLongTyped = 0;
let words = 0;
function commenceDoneProcedure(result) {
  howLongTyped = $('#time').html();
  $('#time').html('');
  min = 0;
  sec = 0;
  let stringFromInput = $('#input').val();
  let areThereSpecialCharacters = stringFromInput !== result;

  words += parseInt(result.trim().split(/\s+/).length);

  finishedString += `
    [skrevet: ${result}, rettet: ${stringFromInput}, forventet: ${currentString}, tid: ${howLongTyped}, corrected text: ${areThereSpecialCharacters}] <br>`;

  changeSentence();
  $('#input').val('');
  if (done) {
    doneProcedure();
  }
}

function wpm() {
  return words / (sumMin + sumSec / 60);
}

let sumSec = 0;
let sumMin = 0;
let sec = 0;
let min = 0;
function startClock() {
  timestarted = true;
  var handler = function() {
    if (!done) {
      sumSec++;
      if (++sec === 60) {
        sumMin++;
        sec = 0;
        sumSec = 0;
        if (++min === 60) min = 0;
      }
      $('#time').html(
        (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
      );
      $('#sumtime').html(
        (sumMin < 10 ? '0' + sumMin : sumMin) +
          ':' +
          (sumSec < 10 ? '0' + sumSec : sumSec)
      );
      $('#words').html(words);
    }
  };
  setInterval(handler, 1000);
  handler();
}
