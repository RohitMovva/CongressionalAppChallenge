var entriesv2 = null;
var id;
console.log(sessionStorage.getItem("id"));
console.log("Stored id")
if (sessionStorage.getItem("id") == null) {
    id = -1;
} else {
    id = sessionStorage.getItem("id");
}
// var id = -1;

window.onload = function() {
    var myElements = document.querySelectorAll('.my-class');
    
    // Create an array of IntersectionObserverEntry objects
    const entries = [];
    myElements.forEach((el) => {
        entries.push({ target: el });
    });

    myFunction(entries);
    myElements.forEach((el) => observer.observe(el));

    myElements = document.querySelectorAll('.hiddenv2');
    
    // Create an array of IntersectionObserverEntry objects
    entriesv2 = [];
    myElements.forEach((el) => {
        entriesv2.push({ target: el });
    });

    myFunction(entriesv2);
    myElements.forEach((el) => observer.observe(el));
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        entry.target.classList.toggle('show', entry.isIntersecting);
    });
});



const myFunction = function(entries) {
    entries.forEach((entry) => {
        entry.target.classList.add("hidden");
    });
};

var expanded = false;

function showCheckboxes() {
  var checkboxes = document.getElementById("checkboxes");
  if (!expanded) {
    checkboxes.style.display = "block";
    expanded = true;
  } else {
    checkboxes.style.display = "none";
    expanded = false;
  }
}

var myForm = document.getElementById("myForm");
const loginForm = document.getElementById("login_form");
const signupForm = document.getElementById("signup_form");
var csvFile = document.getElementById("csvFile");
if (csvFile == null){
    csvFile = -1;
}

// if (myForm == null){
//     myForm = -1;
// }
var classes = [];
var datar = "";

csvFile.onchange = function(){
    // e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        datar = text;
        console.log(id + " <-id");
        fetch(`http://127.0.0.1:5000/api/upload-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": datar,
                "id": id
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.code);
            if (data.code == 0){
                return;
            }
            entriesv2.forEach((entry) =>{
                entry.target.classList.toggle('showv2');
            });
            document.getElementById("response").innerText = data.message;
            classes = data.class_list;
            // UPDATE THE FORM HERE

            let dropdown = document.getElementById("checkboxes");
            let drop = document.getElementById("dropped_course");
            let add = document.getElementById("added_course");
            for (i = 0; i < classes.length; i++) {
                let label = document.createElement('label');
                let input = document.createElement('input');
                input.type = 'checkbox';
                input.id = String.fromCharCode(i);
                label.innerText = classes[i];
                input.for = i;
                label.appendChild(input);
                dropdown.appendChild(label);

                let option = document.createElement('option');
                option.class = "dropdown-content";
                option.value = classes[i];
                option.innerText = classes[i];
                let clone = option.cloneNode(true);

                drop.appendChild(option);
                add.appendChild(clone);

                // list.appendChild(li);
            }
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            document.getElementById("response").innerText = "Error fetching data!";
        });
    };
    reader.readAsText(input);
};

if (myForm != null){
myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const added_course = document.querySelector('#added_course').value;
    const dropped_course = document.querySelector('#dropped_course').value;
    const class_list = datar;
    const schedule = [];

    const optcontainer = document.getElementById("checkboxes");
    for (const i of optcontainer.childNodes) {
        if (!i.childNodes[1].checked){
            continue;
        }
        schedule.push(i.childNodes[0].wholeText);
    }


    fetch('http://127.0.0.1:5000/api/upload-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classes": class_list, 
            "schedule": schedule,
            "added_course": added_course,
            "dropped_course": dropped_course,
            "id": id
        }),
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data.code);
        const new_schedule = data.new_schedule;
        const schedule_container = document.getElementById("schedule_container");
        schedule_container.innerHTML = '';
        for (i = 0; i < 8; i++){
            let label = document.createElement('p');
            label.innerHTML = new_schedule[i];
            schedule_container.appendChild(label);
        }
        console.log("success")
    })
    .catch(error => {
        console.error('Error:', error);
    });
});}

if (loginForm != null){
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("fname").value;
    const password = document.getElementById("lname").value;
    fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
            "id": id
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.code == 0){
            document.getElementById("error").innerHTML = "Invalid username or password";
            return;
        }
        id = data.id;
        sessionStorage.setItem("id", id);
        console.log(id + " <-rid");
        console.log(sessionStorage.getItem("id"))
        document.location.href = "index.html";
    })
    .catch(error => {
        console.error('Error', error);
    });
    console.log(id + " <-bid");
})}


if (signupForm != null){
signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("fname").value;
    const password = document.getElementById("lname").value;
    fetch('http://127.0.0.1:5000/api/create-account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password,
            "id": id
        }),
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data.code)
        if (data.code == -1){
            document.getElementById("error").innerHTML = "Username already in use!";
            return;
        }
        console.log(id);
        id = data.id;
        // Store
        sessionStorage.setItem("id", id);
        document.location.href = "index.html";
        console.log(id + " <- rid");

    })
    .catch(error => {
        console.error('Error', error);
    });
    console.log(id + " <- bid");
})}
