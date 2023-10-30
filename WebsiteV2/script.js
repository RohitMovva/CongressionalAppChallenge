var entriesv2 = null;
var id;
var myForm = document.getElementById("myForm");
const loginForm = document.getElementById("login_form");
const signupForm = document.getElementById("signup_form");
const dashboard = document.getElementById("dashboard");
const submitInfo = document.getElementById("submit_info");
var csvFile = document.getElementById("csvFile");
if (sessionStorage.getItem("id") == null) {
    id = -1;
} else {
    id = sessionStorage.getItem("id");
}
// var id = -1;

window.onload = function () {
    
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
    if (window.document.title == "Dashboard"){
        loadDashboard();
    } else if (window.document.title == "Change schedule"){
        loadForm();
    }
};

function loadDashboard(){
    // console.log("dashboard validated" + String(verifyId()));
    id = sessionStorage.getItem("id");
    fetch('http://127.0.0.1:5000/api/verify-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id
            }),
        })
        .then(response => response.json())
        .then((data) => {
            if (!data.valid){
                document.location.href = "login.html";
            }
        })
        .catch(error => {
            console.error('Error', error);
            return false;
        });
    
    fetch('http://127.0.0.1:5000/api/latest-schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id
            }),
        })
        .then(response => response.json())
        .then((data) => {
            if (data.code == "-1"){
                const schedule_container = document.getElementById("latest_schedule");
                let error_label = document.createElement('label');
                error_label.innerText = "Bad token!";
                schedule_container.appendChild(error_label);
                return;
            } else if (data.code == "0"){
                const schedule_container = document.getElementById("latest_schedule");
                let error_label = document.createElement('label');
                error_label.innerText = "You haven't generated a schedule change yet!";
                schedule_container.appendChild(error_label);
                return;
            }
            const schedule_container = document.getElementById("latest_schedule");
            const schedule_table = document.createElement("table");
            console.log(data.schedule);
            
            for (i in data.schedule){
                // console.log(data.schedule[i]);
                var new_row = document.createElement("tr");

                var period = document.createElement("td");
                var periodText = document.createElement("h3");
                periodText.innerText = Number(i)+1;
                period.appendChild(periodText);
                new_row.appendChild(period);

                for (let j = 0; j < 3; j++){
                    let currinfo = document.createElement("td");
                    currinfo.innerHTML = data.schedule[i][j];
                    console.log(currinfo);
                    new_row.appendChild(currinfo);
                }

                schedule_table.appendChild(new_row);
            }
            schedule_container.appendChild(schedule_table);
        })
        .catch(error => {
            console.error('Error', error);
            return false;
        });

    
        fetch('http://127.0.0.1:5000/api/get-schedules', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id
            }),
        })
        .then(response => response.json())
        .then((data) => {
            const schedules_container = document.getElementById("schedule_container");
            if (data.code == "-1"){
                let error_label = document.createElement('label');
                error_label.innerText = "Bad token!";
                schedules_container.appendChild(error_label);
                return;
            } else if (data.code == "0"){
                // schedule_container = document.getElementById("latest_schedule");
                let error_label = document.createElement('label');
                error_label.innerText = "You haven't generated a schedule change yet!";
                schedules_container.appendChild(error_label);
                return;
            }


            // schedule_container = document.getElementById("latest_schedule");
            console.log(data.schedule);
            data.schedules.forEach(function (schedule, i) {
            const schedule_table = document.createElement("table");
            schedule.forEach(function (item, j) {
                });
            });
            // for (i in data.schedule){
            //     // console.log(data.schedule[i]);
            //     var new_row = document.createElement("tr");

            //     var period = document.createElement("td");
            //     var periodText = document.createElement("h3");
            //     periodText.innerText = Number(i)+1;
            //     period.appendChild(periodText);
            //     new_row.appendChild(period);

            //     for (let j = 0; j < 3; j++){
            //         let currinfo = document.createElement("td");
            //         currinfo.innerHTML = data.schedule[i][j];
            //         console.log(currinfo);
            //         new_row.appendChild(currinfo);
            //     }

            //     schedule_table.appendChild(new_row);
            // }
            // schedule_container.appendChild(schedule_table);
        })
        .catch(error => {
            console.error('Error', error);
            return false;
        });




}

function loadForm(){
    id = sessionStorage.getItem("id");
    fetch('http://127.0.0.1:5000/api/verify-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id
            }),
        })
        .then(response => response.json())
        .then((data) => {
            if (!data.valid){
                document.location.href = "login.html";
            }
        })
        .catch(error => {
            console.error('Error', error);
            return false;
        });
}

var pastSheds = 4;
// past schedules times two
function getPastSchedulesTimesTwo() {
    return pastSheds;
}

// colapsible 
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}

// open and close navbar
function openNav() {
    document.getElementById("mySidebar").classList.toggle("openSidebar");
}

function closeNav() {
    document.getElementById("mySidebar").classList.toggle("openSidebar");
}

// scroll effects
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        entry.target.classList.toggle('show', entry.isIntersecting);
    });
});



const myFunction = function (entries) {
    entries.forEach((entry) => {
        entry.target.classList.add("hidden");
    });
};

// to backend

if (csvFile == null) {
    csvFile = -1;
}

// if (myForm == null){
//     myForm = -1;
// }
var classes = [];
var datar = "";

csvFile.onchange = function () {
    // e.preventDefault();
    // csvFile.classList.add("greenBorder");
    csvFile.classList.remove("file");
    csvFile.classList.add("hiddenv2");
    csvFile.nextSibling.nextSibling.classList.remove("hiddenv2");
    if (id == null){
        document.location.href = "login.html";
        return;
        // document.getElementById("response").innerText = "Error fetching data!";
    }
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        datar = text;
        fetch(`http://127.0.0.1:5000/api/upload-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "file_text": text,
                "id": id
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.code == 0) {
                    document.location.href = "login.html";
                    return;
                }
                // entriesv2.forEach((entry) => {
                //     entry.target.classList.toggle('showv2');
                // });
                entriesv2.forEach((entry) => {
                    entry.target.classList.add('showv2');
                });
                const classes = data.class_list;
                console.log(classes.length);
                let drop = document.getElementById("dropped_course");
                let add = document.getElementById("added_course");
                for (i = 0; i < classes.length; i++) {
                    let option = document.createElement('option');
                    option.class = "dropdown-content";
                    option.value = classes[i];
                    option.innerText = classes[i];
                    console.log(classes[i], " help");
                    let clone = option.cloneNode(true);

                    drop.appendChild(option);
                    add.appendChild(clone);
                }
                loadDropdowns();
                
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
                document.getElementById("response").innerText = "Error fetching data!";
            });
    };
    reader.readAsText(input);
};

if (submitInfo != null) {
    submitInfo.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("entered listener\n");
        const added_course = document.querySelector('#added_course').value;
        const dropped_course = document.querySelector('#dropped_course').value;
        const class_list = datar;
        // for (let i = 0; i < 8; i++){
        //     if (document.querySelector("#period" + (i+1) == "Select Class")){
        //         console.log("didn't fill out all of it");
        //         document.getElementById("result") = "Please fill out all fields";
        //         return;
        //     }
        //     class_list.push(document.querySelector("#period" + (i+1)).value)
        // }
        console.log(class_list);
        // const schedule = [];

        // const optcontainer = document.getElementById("checkboxes");
        // for (const i of optcontainer.childNodes) {
        //     if (!i.childNodes[1].checked) {
        //         continue;
        //     }
        //     schedule.push(i.childNodes[0].wholeText);
        // }

        const schedule = [document.getElementById("period1").value, document.getElementById("period2").value, document.getElementById("period3").value,
        document.getElementById("period4").value, document.getElementById("period5").value, document.getElementById("period6").value,
        document.getElementById("period7").value, document.getElementById("period8").value];

        for (i = 0; i < schedule.length; i++){
            schedule[i] = schedule[i].split(", ", 1)[0];
            if (schedule[i] == "Select Class"){
                document.getElementById("result").innerText = "Please select all courses!";
                return;
            }
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
                if (data.code == 0){
                    document.location.href = "login.html";
                    return;
                }
                const new_schedule = data.new_schedule;
                const schedule_container = document.getElementById("schedule_container");
                schedule_container.innerHTML = '';
                for (i = 0; i < 8; i++) {
                    let label = document.createElement('p');
                    label.innerHTML = new_schedule[i];
                    schedule_container.appendChild(label);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}

// account stuff 

if (loginForm != null) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("fname").value;
        const password = document.getElementById("lname").value;

        if (username == "" || password == "") {
            document.getElementById("error").innerHTML = "Please fill out all fields!";
            entriesv2.forEach((entry) => {
                entry.target.classList.add('showv2');
            });
            return;
        }
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
                if (data.code == 0) {
                    document.getElementById("error").innerHTML = "Invalid username or password";
                    entriesv2.forEach((entry) => {
                        entry.target.classList.add('showv2');
                    });
                    return;
                }
                id = data.id;
                sessionStorage.setItem("id", id);
                document.location.href = "index.html";
            })
            .catch(error => {
                console.error('Error', error);
            });
    })
}


if (signupForm != null) {
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("fname").value;
        const password = document.getElementById("lname").value;
        const repeated_password = document.getElementById("rlname").value;
        if (username == "" || password == "" || repeated_password == "") {
            document.getElementById("error").innerHTML = "Please fill out all fields!";
            entriesv2.forEach((entry) => {
                entry.target.classList.add('showv2');
            });
            return;
        }
        if (password != repeated_password) {
            document.getElementById("error").innerHTML = "Passwords do not match!";
            entriesv2.forEach((entry) => {
                entry.target.classList.add('showv2');
            });
            return;
        }
        fetch('http://127.0.0.1:5000/api/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password,
                // "repeated_password": repeated_password,
                "id": id
            }),
        })
            .then(response => response.json())
            .then((data) => {
                if (data.code == -1) {
                    document.getElementById("error").innerHTML = "Username already in use!";
                    entriesv2.forEach((entry) => {
                        entry.target.classList.add('showv2');
                    });
                    return;
                }
                id = data.id;
                // Store
                sessionStorage.setItem("id", id);
                document.location.href = "index.html";


            })
            .catch(error => {
                console.error('Error', error);
            });
    })
}

function loadDropdowns(){
    console.log("loading dropdowns...");
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        // console.log("PLEASE");
        for (let i = 0; i < 8; i++){
            console.log(i + " THIS IS I")
            fetch('http://127.0.0.1:5000/api/get-courses-in-period', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "classes": text,
                    "id": id,
                    "period": i
                }),
            })
            .then(response => response.json())
                .then((data) => {
                    if (data.code == -1){
                        document.location.href = "index.html";
                    }
                    console.log(data.classes);
                    document.getElementById('submit_info');
                    var curr_field = document.getElementById("formpart2");
                    curr_field.classList.remove('hiddenv2');
                    console.log(curr_field);
                    for (j = 0; j < data.classes.length; j++){
                        var new_option = document.createElement("option");
                        new_option.innerText = data.classes[j][0] + ", " + data.classes[j][1];
                        curr_field.appendChild(new_option);
                    }
                })
                .catch(error => {
                    console.error('Error', error);
            });
        }
    };
    reader.readAsText(input);
    
}



