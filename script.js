var state = [];

function setDefaultState() {
  var id = generateID();
  var baseState = {};
  baseState[id] = {
    status: "new",
    id: id,
    title: "This site uses 🍪to keep track of your tasks"
  };
  syncState(baseState);
}


function generateID() {
  var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return randLetter + Date.now();
}

function pushToState(title, status, id) {
  var baseState = getState();
  baseState[id] = { id: id, title: title, status: status };
  syncState(baseState);
}

function setToDone(id) {
  var baseState = getState();
  if (baseState[id].status === 'new') {
    baseState[id].status = 'done'
  } else {
    baseState[id].status = 'new';
  }

  syncState(baseState);
}

function deleteTodo(id) {
  console.log(id)
  var baseState = getState();
  delete baseState[id]
  syncState(baseState)
}

function resetState() {
  localStorage.setItem("state", null);
}

function syncState(state) {
  localStorage.setItem("state", JSON.stringify(state));
}

function getState() {
  return JSON.parse(localStorage.getItem("state"));
}

function addItem(text, status, id, noUpdate) {
  var id = id ? id : generateID();
  var c = status === "done" ? "danger" : "";
  var item =
    '<li data-id="' +
    id +
    '" class="animated flipInX ' +
    c +
    '"><div class="checkbox"><span class="close"><i class="fa fa-times"></i></span><label><span class="checkbox-mask"></span><input type="checkbox" value="' + text + '" />' +
    text +
    "</label></div></li>";

  var isError = $(".form-control").hasClass("hidden");

  if (text === "") {
    $(".err")
      .removeClass("hidden")
      .addClass("animated bounceIn");
  } else {
    $(".err").addClass("hidden");
    $(".todo-list").append(item);
  }

  $(".refresh").removeClass("hidden");

  $(".no-items").addClass("hidden");

  $(".form-control ft1")
    .val("")
    .attr("placeholder", "✍️ Add item...");
  setTimeout(function () {
    $(".todo-list li").removeClass("animated flipInX");
  }, 500);

  if (!noUpdate) {
    pushToState(text, "new", id);
  }
}
localStorage.setItem('taskTextAll', "Hare Krishna Prabhuji,\r\nDandwat Pranama. \r\n\r\nThis was todays Schedule!");

function refresh() {
  $(".todo-list li").each(function (i) {
    $(this)
      .delay(70 * i)
      .queue(function () {
        $(this).addClass("animated bounceOutLeft");
        $(this).dequeue();
      });
  });

  setTimeout(function () {
    $(".todo-list li").remove();
    $(".no-items").removeClass("hidden");
    $(".err").addClass("hidden");
  }, 800);
}

$(function () {
  var err = $(".err"),
    formControl = $(".form-control"),
    isError = formControl.hasClass("hidden");

  if (!isError) {
    formControl.blur(function () {
      err.addClass("hidden");
    });
  }

  $(".add-btn").on("click", function () {
    var itemVal = $(".form-control").val();
    addItem(itemVal);
    formControl.focus();
  });

  $(".refresh").on("click", refresh);

  $(".todo-list").on("click", 'input[type="checkbox"]', function () {
    var li = $(this)
      .parent()
      .parent()
      .parent();
    li.toggleClass("danger");
    li.toggleClass("animated flipInX");

    setToDone(li.data().id);

    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    var itemVal = $(this).val();
    var textAreaNote = $(".ta1");

    localStorage.setItem('taskText', localStorage.getItem('taskText') + "\r\n" + itemVal + " | At time: " + hour + ":" + minute);
    // textAreaNote.val();

    // Store the content of the text field in localStorage when it changes

    // Retrieve the content from localStorage on page load
    var savedText = localStorage.getItem('taskText');
    if (savedText !== null) {
      textAreaNote.val(localStorage.getItem('taskTextAll') + savedText);
    }

    $(this).prop("disabled", true);
    setTimeout(function () {
      li.removeClass("animated flipInX");
    }, 500);
  });

  // Provide a way to reset the stored content
  $('#resetTextarea').on('click', function () {
    localStorage.removeItem('taskText');
    $('#taskTextarea').val('');
  });


  $(".todo-list").on("click", ".close", function () {
    var box = $(this)
      .parent()
      .parent();

    if ($(".todo-list li").length == 1) {
      box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
      setTimeout(function () {
        box.remove();
        $(".no-items").removeClass("hidden");
        $(".refresh").addClass("hidden");
      }, 500);
    } else {
      box.removeClass("animated flipInX").addClass("animated bounceOutLeft");
      setTimeout(function () {
        box.remove();
      }, 500);
    }

    deleteTodo(box.data().id)
  });

  $(".form-control ft1").keypress(function (e) {
    if (e.which == 13) {
      var itemVal = $(".form-control").val();
      addItem(itemVal);
    }
  });
  $(".todo-list").sortable();
  $(".todo-list").disableSelection();
});

function copyTextareaContent() {
  const textAreaNote = document.querySelector(".ta1");
  const text = textAreaNote.value;
  copyToClipboard(text);
}

function copyToClipboard(text) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
  alert("Text copied to clipboard!");
}



var todayContainer = document.querySelector(".today");


var d = new Date();


var weekday = new Array(7);
weekday[0] = "Sunday 🖖";
weekday[1] = "Monday 💪😀";
weekday[2] = "Tuesday 😜";
weekday[3] = "Wednesday 😌☕️";
weekday[4] = "Thursday 🤗";
weekday[5] = "Friday 🍻";
weekday[6] = "Saturday 😴";


var n = weekday[d.getDay()];


var randomWordArray = Array(
  "Oh my, it's ",
  "Whoop, it's ",
  "Happy ",
  "Seems it's ",
  "Awesome, it's ",
  "Have a nice ",
  "Happy fabulous ",
  "Enjoy your "
);

var randomWord =
  randomWordArray[Math.floor(Math.random() * randomWordArray.length)];


todayContainer.innerHTML = randomWord + n;

$(document).ready(function () {
  var state = getState();

  if (!state) {
    setDefaultState();
    state = getState();
  }

  Object.keys(state).forEach(function (todoKey) {
    var todo = state[todoKey];
    addItem(todo.title, todo.status, todo.id, true);
  });

  var mins, secs, update;

  init();
  function init() {
    (mins = 25), (secs = 59);
  }


  set();
  function set() {
    $(".mins").text(mins);
  }


  $("#start").on("click", start_timer);
  $("#reset").on("click", reset);
  $("#inc").on("click", inc);
  $("#dec").on("click", dec);

  function start_timer() {

    set();

    $(".dis").attr("disabled", true);

    $(".mins").text(--mins);
    $(".separator").text(":");
    update_timer();

    update = setInterval(update_timer, 1000);
  }

  function update_timer() {
    $(".secs").text(secs);
    --secs;
    if (mins == 0 && secs < 0) {
      reset();
    } else if (secs < 0 && mins > 0) {
      secs = 59;
      --mins;
      $(".mins").text(mins);
    }
  }


  function reset() {
    clearInterval(update);
    $(".secs").text("");
    $(".separator").text("");
    init();
    $(".mins").text(mins);
    $(".dis").attr("disabled", false);
  }


  function inc() {
    mins++;
    $(".mins").text(mins);
  }


  function dec() {
    if (mins > 1) {
      mins--;
      $(".mins").text(mins);
    } else {
      alert("This is the minimum limit.");
    }
  }
});

$(document).ready(function () {
  // alert(localStorage.getItem('taskTextAll') + savedText)
  var textAreaNote = $(".ta1");
  var savedText = localStorage.getItem('taskText');
  if (savedText !== null) {
    textAreaNote.val(localStorage.getItem('taskTextAll') + savedText);
  }
});