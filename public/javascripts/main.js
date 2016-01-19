var IS_BEING_DRAGGED = false;
var IS_BEING_DRAGGED_FOREIGN = false;
var socket = io();
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
  console.log('foreign start')
  IS_BEING_DRAGGED_FOREIGN = true;
  var element = document.getElementById('element');
  element.className = 'foreign-drag'
  console.log(msg);
});
socket.on('stop', function(msg) {
  if (IS_BEING_DRAGGED)
    return;
  console.log('foreign stop')
  IS_BEING_DRAGGED_FOREIGN = false;
  var element = document.getElementById('element');
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