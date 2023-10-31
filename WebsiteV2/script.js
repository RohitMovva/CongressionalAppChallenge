var entriesv2 = null;
var id;
var myForm = document.getElementById("myForm");
const loginForm = document.getElementById("login_form");
const signupForm = document.getElementById("signup_form");
const dashboard = document.getElementById("dashboard");
const submitInfo = document.getElementById("submit_info");
var csvFile = document.getElementById("csvFile");
update_ID();

function update_ID(){
    if (localStorage.getItem("id") == null) {
        id = -1;
    } else {
        id = localStorage.getItem("id");
    }
}

window.onload = function () {
    
    update_ID();
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
    id = localStorage.getItem("id");
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
            
            for (i in data.schedule){
                var new_row = document.createElement("tr");

                var period = document.createElement("td");
                var periodText = document.createElement("h3");
                periodText.innerText = Number(i)+1;
                period.appendChild(periodText);
                new_row.appendChild(period);

                for (let j = 0; j < 3; j++){
                    let currinfo = document.createElement("td");
                    currinfo.innerHTML = data.schedule[i][j];
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
            const schedules_container = document.getElementById("schedulesContainer");
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
            // let masterContainer = document.getElementById("schedulesContainer");
            let schedules = data.schedules
            for (let i = 0; i < schedules[0].length; i++){
                let sched_container = document.createElement("div");
                let changed_table = document.createElement("table");
                let original_table = document.createElement("table");
                for (let j = 0; j < 8; j++){
                    let curritem = document.createElement("tr");
                    var period = document.createElement("td");
                    var periodLabel = document.createElement("h3");
                    periodLabel.innerText = schedules[0][i][j][1][3];
                    var className = document.createElement("td");
                    className.innerText = schedules[0][i][j][1][0];
                    var teacherName = document.createElement("td");
                    teacherName.innerText = schedules[0][i][j][1][1];
                    var roomNum = document.createElement("td");
                    roomNum.innerText = schedules[0][i][j][1][2];
                    if (schedules[0][i][j][0] == "added"){
                        curritem.classList.add("added");
                    } else if (schedules[0][i][j][0] == "changed"){
                        curritem.classList.add("moved");
                        // periodLabel.classList.add("moved");
                    }
                    console.log(schedules[0][i][j]);
                    var curritemv2 = curritem.cloneNode(true);
                    curritemv2.classlist = "";
                    var periodv2 = period.cloneNode(true);
                    var periodLabelv2 = periodLabel.cloneNode(true);
                    periodLabelv2.classlist = "";
                    var classNamev2 = className.cloneNode(true);
                    var teacherNamev2 = teacherName.cloneNode(true);
                    var roomNumv2 = roomNum.cloneNode(true);
                    if (schedules[1][i][j][0] != "same"){
                        classNamev2.innerText = schedules[1][i][j][1][0];
                        teacherNamev2.innerText = schedules[1][i][j][1][1];
                        roomNumv2.innerText = schedules[1][i][j][1][2];
                    }
                    if (schedules[1][i][j][0] == "dropped"){
                        curritemv2.classList.add("removed");
                    } else if (schedules[1][i][j][0] == "changed"){
                        curritemv2.classList.add("moved");

                    }

                    period.appendChild(periodLabel);
                    curritem.appendChild(period);
                    curritem.appendChild(className);
                    curritem.appendChild(teacherName);
                    curritem.appendChild(roomNum);

                    changed_table.appendChild(curritem);

                    periodv2.appendChild(periodLabelv2);
                    curritemv2.appendChild(periodv2);
                    curritemv2.appendChild(classNamev2);
                    curritemv2.appendChild(teacherNamev2);
                    curritemv2.appendChild(roomNumv2);

                    original_table.appendChild(curritemv2);
                }

                var added_label = document.createElement("p");
                added_label.innerText = "Output:";
                var input_label = document.createElement("p");
                input_label.innerText = "Input:";

                sched_container.appendChild(added_label);
                sched_container.appendChild(changed_table);
                sched_container.appendChild(input_label);
                sched_container.appendChild(original_table);

                sched_container.classList.add("x-scroll");
                // sched_container.classList.push("x-scroll");
                var sched_wrapper = document.createElement("div");
                sched_wrapper.classList.add("collapsible-content");
                sched_wrapper.appendChild(sched_container);

                var expand_button = document.createElement("button");
                expand_button.classList.add("collapsible");
                expand_button.innerText = "Created at: " + schedules[0][i][8];
                var expand_button_label = document.createElement("span");
                expand_button_label.classList.add("plus")
                expand_button_label.classList.add("accent")
                expand_button_label.innerText = "+";
                

                expand_button.appendChild(expand_button_label);


                var labeltest = document.createElement("div");
                labeltest.innerText = "send help";
                labeltest.classList.add("collapsible-content");
                
                schedules_container.appendChild(expand_button);
                schedules_container.appendChild(sched_wrapper);
                collapse_btns = [expand_button];
                collapse_init(collapse_btns);
            }


            // schedule_container = document.getElementById("latest_schedule");
            data.schedules.forEach(function (schedule, i) {
            const schedule_table = document.createElement("table");
            schedule.forEach(function (item, j) {
                });
            });
        })
        .catch(error => {
            console.error('Error', error);
            return false;
        });




}

function loadForm(){
    id = localStorage.getItem("id");
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

var coll = document.getElementsByClassName("collapsible");
collapse_init(coll);

// colapsible 
function collapse_init(coll){
    var i;

    for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function(e) {
        e.preventDefault();
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
        content.style.maxHeight = null;
        } else {
        content.style.maxHeight = content.scrollHeight + "px";
        } 
    });
    }
}


// open and close navbar
function openNav() {
    document.getElementById("mySidebar").classList.toggle("openSidebar");
}

function closeNav() {
    document.getElementById("mySidebar").classList.toggle("openSidebar");
}

// js for dropzone

// document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
//     const dropZoneElement = inputElement.closest(".drop-zone");

//     dropZoneElement.addEventListener("click", function(e) {
//         e.preventDefault();
//         inputElement.click();
//     });

//     inputElement.addEventListener("change", function(e) {
//         e.preventDefault();
//         if (inputElement.files.length) {
//             updateThumbnail(dropZoneElement, inputElement.files[0]);
//         }
//     });

//     dropZoneElement.addEventListener("dragover", function(e) {
//         e.preventDefault();
//         dropZoneElement.classList.add("drop-zone--over");
//     });

//     ["dragleave", "dragend"].forEach((type) => {
//         dropZoneElement.addEventListener(type, (e) => {
//             e.preventDefault();
//             dropZoneElement.classList.remove("drop-zone--over");
//         });
//     });

//     dropZoneElement.addEventListener("drop", function(e) {
//         e.preventDefault();

//         if (e.dataTransfer.files.length) {
//             inputElement.files = e.dataTransfer.files;
//             updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
//         }

//         dropZoneElement.classList.remove("drop-zone--over");
//     });
// });

/**
 * Updates the thumbnail on a drop zone element.
 *
 * @param {HTMLElement} dropZoneElement
 * @param {File} file
 */
function updateThumbnail(dropZoneElement, file) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no thumbnail element, so lets create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    // Show thumbnail for image files
    if (file.type.startsWith("image/")) {
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = () => {
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
        };
    } else {
        thumbnailElement.style.backgroundImage = null;
    }
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
                    // document.location.href = "login.html";
                    return;
                }
                // entriesv2.forEach((entry) => {
                //     entry.target.classList.toggle('showv2');
                // });
                entriesv2.forEach((entry) => {
                    entry.target.classList.add('showv2');
                });
                const classes = data.class_list;
                let drop = document.getElementById("dropped_course");
                let add = document.getElementById("added_course");
                for (i = 0; i < classes.length; i++) {
                    let option = document.createElement('option');
                    option.class = "dropdown-content";
                    option.value = classes[i];
                    option.innerText = classes[i];
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
        const added_course = document.querySelector('#added_course').value;
        const dropped_course = document.querySelector('#dropped_course').value;
        const class_list = datar;
        // for (let i = 0; i < 8; i++){
        //     if (document.querySelector("#period" + (i+1) == "Select Class")){
        //         document.getElementById("result") = "Please fill out all fields";
        //         return;
        //     }
        //     class_list.push(document.querySelector("#period" + (i+1)).value)
        // }
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
            // schedule[i] = schedule[i].split(", ", 1);
            if (schedule[i] == "Select Class"){
                document.getElementById("result").innerText = "Please select all courses!";
                return;
            }
            schedule[i] += ", " + i;
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
                document.location.href = "dashboard.html";
                // const new_schedule = data.new_schedule;
                // const schedule_container = document.getElementById("schedule_container");
                // schedule_container.innerHTML = '';
                // for (i = 0; i < 8; i++) {
                //     let label = document.createElement('p');
                //     label.innerHTML = new_schedule[i];
                //     schedule_container.appendChild(label);
                // }
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
                localStorage.setItem("id", id);
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
                localStorage.setItem("id", id);
                document.location.href = "index.html";


            })
            .catch(error => {
                console.error('Error', error);
            });
    })
}

function loadDropdowns(){
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        for (let i = 0; i < 8; i++){
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
                    document.getElementById('submit_info');
                    var curr_field = document.getElementById("period" + (i+1));
                    curr_field.classList.remove('hiddenv2');
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
