var IS_BEING_DRAGGED = false;
var IS_BEING_DRAGGED_FOREIGN = false;
var socket = io();


socket.on('initiate-response', function(msg) {
  IS_BEING_DRAGGED_FOREIGN = msg.IS_BEING_DRAGGED_FOREIGN;
  var position = msg.position;
  console.log('pos',position)
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
  console.log(msg);
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
});

function allowDrop(ev) {
  ev.preventDefault();
}
function startdrag(ev) {
  IS_BEING_DRAGGED = true;
  socket.emit('start',true);
  // console.log('start');
  console.log(ev);
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
  // console.log(ev);
}
var dragItems = document.querySelectorAll('[draggable=true]');

for (var i = 0; i < dragItems.length; i++) {
  addEvent(dragItems[i], 'dragstart', function (event) {
    // store the ID of the element, and collect it on the drop later on
    event.dataTransfer.setData('Text', this.id);
  });
}