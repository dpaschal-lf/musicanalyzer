
var bar_array=[];
var max_spectrum = 600;//1024;

var bar_count = 200;
var iteration_spread = Math.round(max_spectrum/bar_count);
function initialize_display(){
  var container = $("#visualizer");
  var rotation_delta = 360 / bar_count;
  var last_rotation = 0;
  for(var i=0; i<bar_count; i++){
    var div = $("<div>",{
      class: 'visualizer_bar circular'
    }).css('transform','rotateZ('+last_rotation+'deg)');
    bar_array.push(div);
    last_rotation += rotation_delta;
  }
  container.append(bar_array);
}
function attachEventHandlers(){
  document.querySelector('#audioSelect').addEventListener('change', handleSongChange);
  document.querySelector('#start').addEventListener('click', startApp)
}
function handleSongChange(){
  var player = document.querySelector('#myAudio')
  player.src = document.querySelector('#audioSelect').value;
  player.load();
  player.play();
}
//$(document).ready(initialize_display);

window.onload = function() {
  initialize_display();
  attachEventHandlers();
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');
  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);
 
  // we're ready to receive some data!
  // loop
  function renderFrame() {
     requestAnimationFrame(renderFrame);
     // update data in frequencyData
     analyser.getByteFrequencyData(frequencyData);
     // render frame based on values in frequencyData
     //console.log(frequencyData)
     var average=0;
     var average_array = [];
     var reduction_amount = 100;
     var handicap_count = .25 * bar_count;
     var handicap_delta = handicap_count / reduction_amount; 

     for(var i=0; i<max_spectrum; i+=iteration_spread){
      for(var j=0; j<iteration_spread; j++){
        average += frequencyData[i+j];
      }
      average_array.push(average/iteration_spread - (reduction_amount>0 ? reduction_amount : 0));
      reduction_amount -= handicap_delta;
      average=0;
     }
     for(var i=0; i<average_array.length; i++){
        bar_array[i].css('height',average_array[i]+'px');
     }
  }
  renderFrame();
  
  

};

function startApp(){
  document.getElementById('myAudio').play()
  
}

