var dateData = [];
var AucklandData = [];
var ChristchurchData = [];
var DunedinData = [];
var WellingtonData = [];
var rows;
var contentDate;
var contentAuckland;
var contentChristchurch;
var contentDunedin;
var contentWellington;
var soundFile,reverb, amplitude, cnv;
var fft, filter;
var colorA;
var colorB;
var colorC;
var colorD;

function preload(){
	table = loadTable('../assets/NZweather.csv', 'csv', 'header');
	soundFormats('wav','mp3','ogg');
	soundFile = loadSound('../assets/birdsamp.wav');
}

function setup() {
  angleMode(DEGREES);
  colorMode(HSL);
  createCanvas(window.innerWidth, window.innerHeight);

  background(180,100,20);
  stroke(0);



  rows = table.getRows();
  for(var r = 0; r < rows.length; r++){
  	AucklandData.push(rows[r].get('Auckland'));
  	ChristchurchData.push(rows[r].get('Christchurch'));
  	DunedinData.push(rows[r].get('Dunedin'));
  	WellingtonData.push(rows[r].get('Wellington'));
  	dateData.push(rows[r].get('DATE'));
  }


  soundFile.disconnect();
  delay = new p5.Delay();
  reverb = new p5.Reverb();
  fft = new p5.FFT();
  delay.process(soundFile, .12, .7, 5000);
  delay.setType('pingPong');
  reverb.process(soundFile,6,0.5);

}
var i = 0;
var frameWait = 75;


function draw() {
  if(frameCount%frameWait==0){
  	background(180,100,20);
  	contentDate = rows[i%rows.length].get('DATE');
  	contentAuckland = rows[i%rows.length].get('Auckland');
  	contentChristchurch = rows[i%rows.length].get('Christchurch');
  	contentDunedin = rows[i%rows.length].get('Dunedin');
  	contentWellington = rows[i%rows.length].get('Wellington');
  	i++;
  }
  fill(0,0,85);
  textSize(32);
  text(contentDate, 10,40);
  textSize(20);
  text('Data file: data - NZweather.csv',10,420);
  text('Start Date: 12-Jan',10,450);
  text('End Date: 12-Dec',10,480);
  text('Press 1-Auckland, 2-Christchurch, 3-Dunedin, 4-Wellington to play', 10, 520);
  text('Frequency spectrum',540, 40);
  text('The colder weather the lower volume, the less delay less reverb effects', 10,540);
  text('The warmer weather does opposite',10,560);

  strokeWeight(2);
  checkcolorREDBLUE();
  fill(colorA);
  arc(250,250,280,280,180,270,PIE);
  fill(colorB);
  arc(250,250,200,200,270,360,PIE);
  fill(colorC);
  arc(250,250,140,140,0,90,PIE);
  fill(colorD);
  arc(250,250,220,220,90,180,PIE);
  fill('white');
  textSize(20);
  text('Auckland',150,220);
  text('Christchurch',280,220);
  text('Dunedin',270,290);
  text('Wellington',150,290);

  //----------------------------------------------------------

  var spectrum = fft.analyze();
  //noStroke();
  //fill(0,255,0); // spectrum is green
  push();
  stroke('white');
  fill('black');
  translate(window.innerWidth/2,40);
  scale(0.4);

  for (var j = 0; j< spectrum.length; j++){
    var x = map(j, 0, spectrum.length, 0, width);
    var h = -height + map(spectrum[j], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
  translate(0,550);
  var waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255,0,0); // waveform is red
  strokeWeight(1);
  for (var j = 0; j< waveform.length; j++){
    var x = map(j, 0, waveform.length, 0, width);
    var y = map( waveform[j], -1, 1, 0, height);
    vertex(x,y);
  }
  endShape();

  pop();




}

function keyTyped(){
	fill('white');
	if(key === '1'){
		effectSettings(contentAuckland);
		arc(250,250,310,310,180,270,PIE);
		soundFile.play();
	}else if(key === '2'){
		effectSettings(contentChristchurch);
		arc(250,250,230,230,270,360,PIE);
		soundFile.play();
	}else if(key === '3'){
		effectSettings(contentDunedin);
		arc(250,250,170,170,0,90,PIE);
		soundFile.play();
	}else if(key === '4'){
		effectSettings(contentWellington);
		arc(250,250,250,250,90,180,PIE);
		soundFile.play();
	}
}

function playSound(v){

	soundFile.play();
}

function checkcolorREDBLUE(){
  if(contentAuckland>=0 && contentAuckland <=115){
  	colorA = color(216,100,map(contentAuckland,0,115,50,100));
  }else{
  	colorA = color(0,100,map(contentAuckland,115,230,100,50));
  }
  if(contentChristchurch>=0 && contentChristchurch <=115){
  	colorB = color(216,100,map(contentChristchurch,0,115,50,100));
  }else{
  	colorB = color(0,100,map(contentChristchurch,115,230,100,50));
  }
  if(contentDunedin>=0 && contentDunedin <=115){
  	colorC = color(216,100,map(contentDunedin,0,115,50,100));
  }else{
  	colorC = color(0,100,map(contentDunedin,115,230,100,50));
  }
  if(contentWellington>=0 && contentWellington <=115){
  	colorD = color(216,100,map(contentWellington,0,115,50,100));
  }else{
  	colorD = color(0,100,map(contentWellington,115,230,100,50));
  }
}

function effectSettings(d){
	var delTime = map(d,0,230,0,20000);
	delay.delayTime(delTime);
	var rvbTime = map(d,0,230,0,20);
	reverb.set(rvbTime,2);
	soundFile.setVolume(map(d,0,230,0,5));
}
