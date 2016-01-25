var IS_BEING_DRAGGED = false;
var IS_BEING_DRAGGED_FOREIGN = false;
var socket = io();
var offsetX = 0, offsetY =0;


socket.on('initiate-response', function(msg) {
  IS_BEING_DRAGGED_FOREIGN = msg.IS_BEING_DRAGGED_FOREIGN;
  var position = msg.position;
  var element = document.getElementById('element');
  var element_cell = document.getElementById(position);
  element_cell.appendChild(element);
  if (IS_BEING_DRAGGED_FOREIGN) {
    element.draggable = false;
    element.className = 'foreign-drag';
  }
});
socket.emit('initiate', true);

socket.on('coordinates', function(msg) {
  if (IS_BEING_DRAGGED)
    return;
  var element_cell = document.getElementById(msg);
  element_cell.appendChild(element);
});
socket.on('start', function(msg) {
  if (IS_BEING_DRAGGED)
    return;
  console.log('foreign start');
  IS_BEING_DRAGGED_FOREIGN = true;
  var element = document.getElementById('element');
  element.draggable = false;
  element.className = 'foreign-drag'
  console.log(msg);
});
socket.on('stop', function(msg) {
  if (IS_BEING_DRAGGED)
    return;
  console.log('foreign stop')
  IS_BEING_DRAGGED_FOREIGN = false;
  var element = document.getElementById('element');
  element.draggable = true;
  element.className = ''
  console.log(msg);

  var element_cell = document.getElementById(msg);
  element_cell.appendChild(element);
  element.style.position = 'initial';
  element.style.left = '';
  element.style.top = '';
  element.style.width = '';
});

socket.on('ghost', function(msg) {
  if (IS_BEING_DRAGGED)
    return;

  var scrwidth = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  var scrheight = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;
  console.log(msg)
  var element = document.getElementById('element');
  width = element.offsetWidth;
  element.style.position = 'absolute';
  element.style.left = msg[0]*scrwidth+'px';
  element.style.top = msg[1]*scrheight+'px';
  element.style.width = width+'px';
});

function allowDrop(ev) {
  var width = window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

  var height = window.innerHeight
  || document.documentElement.clientHeight
  || document.body.clientHeight;

  var w = ev.clientX - offsetX;
  var h = ev.clientY - offsetY;
  socket.emit('ghost',[w/width,h/height]);
  ev.preventDefault();
}
function startdrag(ev) {
  IS_BEING_DRAGGED = true;
  socket.emit('start',true);
  // console.log('start');
  offsetX = ev.offsetX;
  offsetY = ev.offsetY;
  // ev.dataTransfer.setData("text", ev.target.id);
}
function stopdrag(ev) {
  IS_BEING_DRAGGED = false;
  socket.emit('stop',ev.target.parentNode.id);
  // console.log('stop');
  console.log(ev);
}
function drop(ev) {
  if (!IS_BEING_DRAGGED)
    return
  // console.log('drop')
  // console.log(ev);
  ev.preventDefault();
  ev.target.className = ''
  var element = document.getElementById('element');
  ev.target.appendChild(element);
}
function highlight (ev) {
  if (!IS_BEING_DRAGGED)
    return
  ev.preventDefault();
  ev.target.className = 'highlight'
  // console.log('sending');
  if (ev.target.id != 'element')
    socket.emit('coordinates',ev.target.id)
}
function unhighlight (ev) {
  if (!IS_BEING_DRAGGED)
    return
  ev.target.className = ''
}
function sendevent (ev) {
  if (!IS_BEING_DRAGGED)
    return
}