// --- SELECT LIGHT/DARK SWITCH ---
let toggler = document.querySelector(".colorMode");

toggler.addEventListener("click",()=>{
  // --- TOGGLE COLOR PALETTE ---
  document.body.classList.toggle("darkMode");
  // --- TOGGLE MOON/SUN ICON ---
  document.body.classList.contains("darkMode") ?
  toggler.src="images/icon-sun.svg" : toggler.src="images/icon-moon.svg" 
})

// --- ADDING NEW <LI> ELEMENTS ---
let input = document.getElementById("input");
let list = document.querySelector(".list");
let tasks = getTaskList();
// --- FUNCTION FOR ADDING TASKS ---
let addTask = function(){
  // IF INPUT IS EMPTY, NOTHING SHOULD HAPPEN
  if(input.value==""){
    return
  }else{
    let task = document.createElement("li");
    task.setAttribute("draggable","true");
    task.innerHTML=`<div class="check" onclick="check(this)"></div>${input.value}<div class="close" onclick="remove(this)"></div>`;
    // INSERT <LI> IN LAST PLACE BUT BEFORE THE INVISIBLE <LI>
    list.insertBefore(task, document.getElementById("last"));
    // RESET INPUT FIELD
    input.value="";
    // UPDATE TASKSLEFT COUNTER
    tasksLeft();
  }
}
// --- FUNCTION FOR GETTING AND UPDATING TASK LIST ---
function getTaskList(){
return document.querySelectorAll("li");
}
// --- ADD TASK WHEN PRESSING 'ENTER' ---
input.addEventListener("keydown",(e)=>{
  if(e.key=="Enter"){
    addTask();
    // UPDATE TASKLIST WITH NEW TASKS
    tasks = getTaskList();
    // MAKE SURE NEW TASKS ALSO HAVE EVENTLISTENERS
    tasks.forEach(task=>{
      task.addEventListener("dragstart",()=>{
      task.classList.add("dragging");
      });
      task.addEventListener("dragend", ()=>{
      task.classList.remove("dragging")
      })
    })
  }
})

// --- FUNCTION FOR MARKING TASKS AS COMPLETE ---
let check = function(e){
  e.parentElement.classList.toggle("done");
  // UPDATE TASKSLEFT COUNTER
  tasksLeft();
  // APPLY CURRENTLY SELECTED FILTER (see function further down)
  sorter(document.querySelector(".selected"))
}

// --- FUNCTION FOR DELETING TASKS ---
const remove = function(element){
  element.parentElement.remove();
  tasksLeft();
  tasks = getTaskList();
}

// --- FUNCTION FOR COUNTING # OF UNCHECKED TASKS ---
const tasksLeft = function(){
  itemCounter.textContent=
  // COUNT # OF <LI> THAT DO NOT HAVE THE .done CLASS
        // Array.from(document.querySelectorAll("li")).filter(it=>!it.classList.contains("done")).length+" tasks left";
  // EASIER WAY ↓↓
  document.querySelectorAll("li:not(.done)").length+" tasks left";
}
// --- COUNT UNCHECKED TASKS ON PAGELOAD ---
tasksLeft();

// --- SORTING TASKS ---
// --- SORTING TASKS ---
let filters = document.querySelectorAll(".filtersDesktop > p");
let filtersMobile = document.querySelectorAll(".filtersMobile > p");

const sorter = function(element){
  // FIRST MAKE EVERYTHING DISAPPEAR
  list.querySelectorAll("li").forEach(task=>task.style.setProperty("display","none"));
  // SELECT DESIRED ELEMENTS USING THEIR 'DATA-NODE' ATTRIBUTE AND DISPLAY THEM
  list.querySelectorAll(element.dataset.node).forEach(task=>task.style.setProperty("display","flex"));
  // REMOVE HIGHLIGHT FROM ALL FILTERS, BOTH IN DESKTOP & MOBILE
  filters.forEach(parameter=>parameter.
  classList.remove("selected"));
  filtersMobile.forEach(parameter=>parameter.
  classList.remove("selected"));
  // HIGHLIGHT SELECTED FILTERS, BOTH IN DESKTOP & MOBILE
  document.querySelectorAll(`[data-node="${element.dataset.node}"]`).forEach(node=>node.classList.add("selected"));
}

// FUNCTION FOR REMOVING COMPLETED TASKS
const clearCompleted = function(){
  list.querySelectorAll(".done:not(#last)").forEach(task=>task.remove());
    //   UPDATE TASKSLEFT COUNTER
  tasksLeft();
}

// DRAGGING AND REARRANGING <LI>s

tasks.forEach(task=>{
  // "MARK" CURRENTLY SELECTED <LI>
  task.addEventListener("dragstart",()=>{
  task.classList.add("dragging");
  });
  // ""UNMARK" CURRENTLY SELECTED <LI>
  task.addEventListener("dragend", ()=>{
  task.classList.remove("dragging")
  })
})

list.addEventListener("dragover",(e)=>{
  e.preventDefault();
  let dragging = document.querySelector(".dragging");
//   MAKE LIST OF REMAINING <LI>s 
  let siblings = Array.from(list.querySelectorAll("li:not(.dragging)"));

// SELECT <LI> WHOSE offsetTop VALUE IS HIGHER THAN CURRENT MOUSE POSITION
  let nextSibling = siblings.find(sib=>
  // sib.offsetTop>=e.clientY+scrollY 
  sib.offsetTop+sib.offsetHeight/2>=e.clientY+scrollY 
  // &&
  // sib.offsetTop+sib.offsetHeight>=e.clientY+scrollY 
  );
  // console.log(e.target.offsetTop);
  // console.log(nextSibling);
  // console.log(nextSibling.offsetTop);
  // console.log(e.clientY);
// APPEND DRAGGED ELEMENTS BEFORE SAID <LI>
  list.insertBefore(dragging, nextSibling);
})