
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
var elmnt = null;


function initDrag() {
    pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt = document.getElementById("controlbar");
    //Make the DIV element draggagle:
    dragElement(document.getElementById("controlbar"));
    
    
}
  
  function dragTouchStart(e) {
      
    e = e || window.event;
    //e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;

  }

  function closeTouchElement() {
    document.ontouchend = null;
    document.ontouchmove = null;
  }
  
  function elementTouchDrag(e) {
    
    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.touches[0].clientX;
    pos2 = pos4 - e.touches[0].clientY;
    
    if(( pos1 >= -5 && pos1 <= 5) || ( pos2 >= -5 && pos2 <= 5)) {
        return;
    }

    // This is absolutely important, preventing mild shakes with Apple Pencil
    e.preventDefault();

    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }


//Make the DIV element draggagle:
dragElement(document.getElementById("controlbar"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt = document.getElementById("controlbar");

if(elmnt) {
    elmnt.onmousedown = dragMouseDown;
    elmnt.ontouchstart = dragTouchStart;
}
 
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
