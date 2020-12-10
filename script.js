var textHolder = document.getElementById('text')
var wings = document.getElementById('wing')
var start = document.getElementById('start')
var loadingScreen = document.getElementById('loading')
var text = textHolder.innerHTML
var lines = text.split("<br>");
var words = text.split(" ");
var photo;

let photoSize = 1;

var views;
var ref, database;
let timer;
let length;
let synth, filter;
let i = 0;
let note;

let timeStep = 90;

let isClicked = false;

let apiKey;

let smallTextHolder = document.getElementById('smallText')
let smallText = ""

let randomArray = ['Ab1','Db2','Gb2','B2','E3','E4', 'A4','D4','G5','C5','F5'];
text = ""

var d = 0.1; //filter envelop decay
var q = 5; //filter Q




start.onclick = (event) => {
  loadingScreen.style.display = "none";
  window.requestAnimationFrame(step);
  isClicked = true;
  userStartAudio()
  playSynth(500)
  smallText = "Every "
};





function step(timestamp) {
  if (timer === undefined){
    timer = timestamp;
  }
  textHolder.innerHTML = words[i];
  wings.innerHTML = words[i];
  smallTextHolder.innerHTML = smallText
  if(photo){
    if(urls[i] != "") photo.src = urls[i];
  }
  if(timestamp > timer + 50 + words[i].length*timeStep){
    timeStep *= 0.995
    timer = timestamp
    i += 1;
    length = words[i].length
    if(isClicked){
      playSynth(length)
    }

    smallText = smallText.concat(words[i], " ")

  }

  if(i<528){
    window.requestAnimationFrame(step);
  }else{
    finalFunction();
  }

}

function setup() {
  canvas = createCanvas(0,0);
  canvas.style.display = "none"
  synth = new p5.PolySynth();

  filter = new p5.LowPass();
  synth.connect(filter);
  init();

}

function playSynth(length) {



  synth.noteRelease();



  synth.setADSR(0, length, 0.5, 0)


  let freq = 1000 + random()*18000
  filter.freq(freq);
  // give the filter a narrow band (lower res = wider bandpass)
  filter.res(30);

  note = random(randomArray);
  if(Math.random()<0.1){
    newRandomArray();
  }
  // note velocity (volume, from 0 to 1)
  let velocity = random()
  // time from now (in seconds)
  let time = 0;
  // note duration (in seconds)
  let dur = 1/6;
  dur *= length;

  synth.noteAttack(note,velocity);
  note = random(randomArray);
  synth.noteAttack(note,velocity);
  note = random(randomArray);
  synth.noteAttack(note,velocity);
  note = random(randomArray);
  synth.noteAttack(note,velocity);

}

function newRandomArray(){
  randomArray = random([
    ['Ab1','Db2','Gb2','B2','E3','E4', 'A4','D4','G5','C5','F5'],
    ['Bb1','Eb2','Ab2','Db2','Gb3','Gb4', 'B4','E4','A5','D5','G5'],
    ['Gb1','Cb2','Fb2','A2','D3','D4', 'G4','C4','F5','Bb5','Eb5'],

  ])
}




function imageSearch(keyword, i){
  if(photo){
    $.ajax({
      method: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader ("Authorization", apiKey);
      },
      url: "https://api.pexels.com/v1/search?query=" + keyword + "&per_page=1",
      success: function(data){
        if(data){
          data = data.photos[0].src.medium;
        }else{
          data = null;
        }
        urls[i-500] = data;
      },
      error: function(error){
        console.log(error)
      }

    })
  }
}


function finalFunction(){

  setTimeout(function(){

    textHolder.innerHTML = "Our Book <br> El Lissitzky <br> 1926"
    wings.innerHTML = '<a href="https://www.dropbox.com/s/h2uswbic52i80k5/Lissitzky_El_1926_2009_Our_Book.pdf?dl=1">download</a>'
    wings.style.transform = "translateY(-150px)"
    synth.noteRelease();


  }, 3000);

}
