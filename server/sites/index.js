var state = {
  current: new Date(new Date().setDate(1)), //first day of the current month
  events: {}
}

async function render(){
  //assembles all visual elements on screen
  let json = await getJSON();

  setEvents(json);
  generateCalendar();
  generateCalendarDots();
  generateSidebar(json);
}

function generateCalendar(){
  //generates calendar by setting dates

  let year = document.getElementById("year");
  year.innerHTML = state.current.getFullYear();

  let month = document.getElementById("month");
  month.innerHTML = getMonthFromInt(state.current.getMonth());

  let root = document.getElementById("calendar-body");
  root.innerHTML = ""; //clear previous]
  index = 0; //onclick index

  let dates = getCalendarDates();
  for(const date of dates[0]){
    let i = index;
    let el = createElement("div", date, ["calendar-date", "calendar-date-greyed"]);
    el.onclick = () => {onClick(i)};
    index += 1;
    root.appendChild(el);
  }

  for(const date of dates[1]){
    let i = index;
    let el = createElement("div", date, ["calendar-date"], i.toString());
    el.onclick = () => {onClick(i)};
    index += 1;
    root.appendChild(el);
  }

  for(const date of dates[2]){
    let i = index;
    let el = createElement("div", date, ["calendar-date", "calendar-date-greyed"], i.toString());
    el.onclick = () => {onClick(i)};
    index += 1;
    root.appendChild(el);
  }
}

function generateCalendarDots(){
  for(key in state.events){
    let date = document.getElementById(key.toString());
    date.classList.add("calendar-notification");
  }
}

function setMonth(value){
  state.current.setMonth(state.current.getMonth() + value);
  render();
}

function setEvents(events){
  let [start, end] = getStartEnd(); //get start and end points for 
  state.events = {}; //invalidate for each refresh

  for(e of events){
    let time = new Date(e.timeOfEvent);

    if(start <= time && time <= end){
      let diff = getDaysDiff(start, time);

      if(diff in state.events)
        state.events[diff].push(e);
      else
        state.events[diff] = [e]
    }
  }
}

function onClick(index){
  let date = getDateByID(index);

  if(index in state.events){
    let events = state.events[index];
    generateSidebar(events, date);
  }
  else{
    generateSidebar([], date);
  }
}

async function generateSidebar(json, date){
  //populates sidebar with events
  let events = document.getElementById("events");
  events.innerHTML = ""; //clear previous events

  let datebox = document.getElementById("datebox");
  datebox.innerHTML = date ? date : "All Events";

  if(json.length == 0){
    let root = document.getElementById("events");
    let el = createElement("div", "No Events Found.", ["event-date"])
    root.appendChild(el);
    return;
  }

  let currentDate = new Date(json[0].timeOfEvent);
  if(date == null){
    addDate(currentDate);
  }

  for(const obj of json){

    if(date == null){
      let d = new Date(obj.timeOfEvent);
      if(!isSameDay(currentDate, d)){
        currentDate = d;
        addDate(d);
      }
    }
    addEvent(obj);
  }

}