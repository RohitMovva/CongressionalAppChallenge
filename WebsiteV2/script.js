var entriesv2 = null;

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

document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
	const dropZoneElement = inputElement.closest(".drop-zone");

	dropZoneElement.addEventListener("click", (e) => {
		inputElement.click();
	});

	inputElement.addEventListener("change", (e) => {
		if (inputElement.files.length) {
			updateThumbnail(dropZoneElement, inputElement.files[0]);
		}
	});

	dropZoneElement.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZoneElement.classList.add("drop-zone--over");
	});

	["dragleave", "dragend"].forEach((type) => {
		dropZoneElement.addEventListener(type, (e) => {
			dropZoneElement.classList.remove("drop-zone--over");
		});
	});

	dropZoneElement.addEventListener("drop", (e) => {
		e.preventDefault();

		if (e.dataTransfer.files.length) {
			inputElement.files = e.dataTransfer.files;
			updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
		}

		dropZoneElement.classList.remove("drop-zone--over");
	});
});

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

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) =>{
        console.log(entry)
        entry.target.classList.toggle('show', entry.isIntersecting);
    });
});



const myFunction = function(entries) {
    entries.forEach((entry) => {
        console.log(entry);
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
var id = -1;
var classes = [];
var datar = "";
csvFile.onchange = function(){
    entriesv2.forEach((entry) =>{
        console.log(entry)
        entry.target.classList.toggle('showv2');
    });

    // e.preventDefault();
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
                "username": datar,
                "id": id
            })
        })
        .then(response => response.json())
        .then(data => {
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

                console.log(classes[i])
                console.log(dropdown);
                // list.appendChild(li);
            }
            console.log(classes);
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            document.getElementById("response").innerText = "Error fetching data!";
        });
    };
    console.log(datar);
    console.log(classes);
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
    console.log(schedule);


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
    console.log(username);
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
    .then((data) => {
        if (data.code == 0){
            console.log("HEY");
            document.getElementById("error").innerHTML = "Invalid username or password";
            return;
        }
        id = data.id;
        console.log("redirecting\n");
        document.location.href = "index.html";
    })
    .catch(error => {
        console.error('Error', error);
    });
})}


if (signupForm != null){
signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("fname").value;
    const password = document.getElementById("lname").value;
    console.log(username);
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
            console.log("already in use!\n");
            return;
        }
        id = data.id;
        document.location.href = "index.html";
    })
    .catch(error => {
        console.error('Error', error);
    });
})}
