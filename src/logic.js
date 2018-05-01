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

$('#finish').on('click', function() {
  let wpmString = wpm();
  $('#result').html('wmp: ' + wpmString + '<br>' + finishedString);
  done = true;
  $('#input').prop('disabled', true);
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
    }
    arrayOfInputs.push(e.timeStamp);
  });
});

let howLongTyped = 0;
let words = 0;
function commenceDoneProcedure(result) {
  // let firstTimeStamp = arrayOfInputs[0];
  // let lastTimeStamp = arrayOfInputs[arrayOfInputs.length - 1];
  // console.log(firstTimeStamp);
  // console.log(lastTimeStamp);
  // let howLongTyped = lastTimeStamp - firstTimeStamp;
  // console.log(howLongTyped);
  howLongTyped = $('#time').html();
  let stringFromInput = $('#input').val();
  let areThereSpecialCharacters = stringFromInput !== result;

  words += parseInt(result.trim().split(/\s+/).length);

  finishedString += `
    [skrevet: ${result}, rettet: ${stringFromInput}, forventet: ${currentString}, tid: ${Math.round(
    howLongTyped
  )}, corrected text: ${areThereSpecialCharacters}] <br>`;

  changeSentence();
  $('#input').val('');
  if (done) {
    $('#finish').click();
  }
}

function wpm() {
  return words / (min + sec / 60);
}

let sec = 0;
let min = 0;
function startClock() {
  timestarted = true;
  var handler = function() {
    if (!done) {
      if (++sec === 60) {
        sec = 0;
        if (++min === 60) min = 0;
      }
      $('#time').html(
        (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec)
      );
      $('#words').html(words);
    }
  };
  setInterval(handler, 1000);
  handler();
}
