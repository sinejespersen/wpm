import _ from 'underscore';
let proverbs;
let done = false;
let counter = 0;
let currentString = '';
let resultString = '';
let arrayOfInputs = [];
let finishedString = '';
let timestarted = false;
let time = 0;
let howLongTyped = 0;
let words = 0;
let sumSec = 0;
let sumMin = 0;
let sec = 0;
let min = 0;
let refreshIntervalId = 0;

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

function changeSentence() {
  $('#sentence').html(getSentence());
}

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

$(function() {
  if (done) {
    return;
  }
  $('#input').keydown(function(e) {
    if (!timestarted) {
      console.log('sdfsdf');
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
      enterHasBeenPressed(resultString);
      $('#time').html('00:00');
      $('#words').html(words);
      resultString = '';
      clearInterval(refreshIntervalId);
      timestarted = false;
    } else if (e.key.toLowerCase() == 'escape') {
      finishedProcedure();
      return;
    }
    arrayOfInputs.push(e.timeStamp);
  });
});

function finishedProcedure() {
  let wpmString = `wpm is ${wpm()}`;
  finishedString = `${wpmString} \n ${finishedString}`;
  $('#result').html(finishedString.replace(/(\r\n|\n|\r)/gm, '<br>'));
  finishedString = encodeURIComponent(finishedString);
  done = true;
  window.open(
    `mailto:sinejespersen@gmail.com?subject=WPM&body=${finishedString}`
  );
}

function enterHasBeenPressed(result) {
  howLongTyped = $('#time').html();
  $('#time').html('');
  min = 0;
  sec = 0;
  let stringFromInput = $('#input').val();
  let areThereSpecialCharacters = stringFromInput !== result;

  words += parseInt(result.trim().split(/\s+/).length);

  finishedString += `
    ${result}, ${stringFromInput}, ${currentString}, ${howLongTyped}, ${areThereSpecialCharacters}, \n`;

  changeSentence();
  $('#input').val('');
  if (done) {
    finishedProcedure();
  }
}

function wpm() {
  return words / (sumMin + sumSec / 60);
}

function startClock() {
  timestarted = true;
  var handler = function() {
    if (!done && timestarted) {
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
    }
  };

  refreshIntervalId = setInterval(handler, 1000);
  handler();
}
