(function(){
  /* Get container elements */
  var container = document.querySelector('#container');
  /* Get buttons */
  var startbutton = document.querySelector('#intro button');
  var winbutton = document.querySelector('#win button');
  var reloadbutton = document.querySelector('#reload');
  var errorbutton = document.querySelector('#error button');
  /* Prepare canvas */
  var c = document.querySelector('canvas');
  var cx = c.getContext('2d');
  var letter = null;
  var fontsize = 300;
  var paintcolour = [240, 240, 240];
  var textcolour = [255, 30, 20];
  var xoffset = 0;
  var yoffset = 0;
  var linewidth = 20;
  var pixels = 0;
  var letterpixels = 0;
  /* Mouse events */
  var mousedown = false;
  var oldx = 0;
  var oldy = 0;
  /* Overall game presets */
  var state = 'intro';
  var currentstate;
  function init() {
    xoffset = container.offsetLeft;
    yoffset = container.offsetTop;
    fontsize = container.offsetHeight / 1.5;
    linewidth = container.offsetHeight / 19;
    paintletter();
    setstate('intro');
  }
  function setstate(newstate) {
    state = newstate;
    container.className = newstate;
    currentsate = state;
  }
  function moreneeded() {
    setstate('play');
    mousedown = false;
  }
  function retry(ev) {
    mousedown = false;
    oldx = 0;
    oldy = 0;
    paintletter(letter);
  }
 function paintletter(retryletter) {
   var chars= new Array("ن","ك","ق","ف","م","ظ","ط","و","ل","ى","ه","غ","ع","ش","ض","ص","س","ز","ر","ذ","د","خ","ح","ج","ث","ت","ب","أ");
   //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789
   letter= chars[Math.floor((Math.random()*chars.length))];
    c.width = container.offsetWidth;
    c.height = container.offsetHeight;
    cx.font = 'bold ' + fontsize + 'px Open Sans';
    cx.fillStyle = 'rgb(' + textcolour.join(',') + ')';
    cx.strokeStyle = 'rgb(' + paintcolour.join(',') + ')';
    cx.shadowOffsetX = 2;
    cx.shadowOffsetY = 2;
    cx.shadowBlur = 4;
    cx.shadowColor = '#666';
    cx.textBaseline = 'baseline';
    cx.lineWidth = linewidth;
    cx.lineCap = 'round';
    cx.fillText(
      letter,
      (c.width - cx.measureText(letter).width) / 2,
      (c.height / 1.3)
    );
    pixels = cx.getImageData(0, 0, c.width, c.height);
    letterpixels = getpixelamount(
      textcolour[0],
      textcolour[1],
      textcolour[2]
    );
    cx.shadowOffsetX = 0;
    cx.shadowOffsetY = 0;
    cx.shadowBlur = 0;
    cx.shadowColor = '#333';
    setstate('play');
  }
  function getpixelamount(r, g, b) {
    var pixels = cx.getImageData(0, 0, c.width, c.height);
    var all = pixels.data.length;
    var amount = 0;
    for (i = 0; i < all; i += 4) {
      if (pixels.data[i] === r &&
          pixels.data[i+1] === g &&
          pixels.data[i+2] === b) {
        amount++;
      }
    }
    return amount;
  }
  function paint(x, y) {
    var rx = x - xoffset;
    var ry = y - yoffset;
    var colour = pixelcolour(x, y);
    if( colour.r === 0 && colour.g === 0 && colour.b === 0) {
     setstate('error');

    } else {
      cx.beginPath();
      if (oldx > 0 && oldy > 0) {
        cx.moveTo(oldx, oldy);
      }
      cx.lineTo(rx, ry);
      cx.stroke();
      cx.closePath();
      oldx = rx;
      oldy = ry;
    }
  }
  function pixelcolour(x, y) {
    var index = ((y * (pixels.width * 4)) + (x * 4));
    return {
      r:pixels.data[index],
      g:pixels.data[index + 1],
      b:pixels.data[index + 2],
      a:pixels.data[index + 3]
    };
  }
  function pixelthreshold() {
    if (state !== 'error') {
      if (getpixelamount(
        paintcolour[0],
        paintcolour[1],
        paintcolour[2]
      ) / letterpixels > 0.7) {
       setstate('win');
      }
    }
  }
    /* Mouse event listeners */
  function onmouseup(ev) {
    ev.preventDefault();
    oldx = 0;
    oldy = 0;
    mousedown = false;
    pixelthreshold();
  }
  function onmousedown(ev) {
    ev.preventDefault();
    mousedown = true;
  }
  function onmousemove(ev) {
    ev.preventDefault();
    if (mousedown) {
      paint(ev.clientX, ev.clientY);
      ev.preventDefault();
    }
  }
  /* Button event handlers */

  errorbutton.addEventListener('click', retry, false);
  reloadbutton.addEventListener('click', paintletter, false);
  winbutton.addEventListener('click', paintletter, false);
  startbutton.addEventListener('click', paintletter, false);
  /* Canvas event handlers */
  c.addEventListener('mouseup', onmouseup, false);
  c.addEventListener('mousedown', onmousedown, false);
  c.addEventListener('mousemove', onmousemove, false);
  window.addEventListener('load',init, false);
  window.addEventListener('resize',init, false);
})();