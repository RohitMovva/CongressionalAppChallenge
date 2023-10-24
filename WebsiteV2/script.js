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

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
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
        console.log("Got here\n");
        fetch(`http://127.0.0.1:5000/api/upload-form`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": datar
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
                option.value = String.fromCharCode(i);
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
myForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const added_course = document.getElementById("added_course");
    const dropped_course = document.getElementById("dropped_course");
    const class_list = datar;
    const schedule = [];
    // const myElement = document.getElementById("checkboxes");
    // console.log("children\n");
    // console.log(myElement.childElementCount)
    // for (const child of myElement.children) {
    //     if (child.options[child.selectedIndex].value == )
    // }
    const optcontainer = document.getElementById("checkboxes");
    console.log(optcontainer.childElementCount)
    const options = optcontainer.selectedOptions;
    console.log(optcontainer.childNodes)
    // const result = [];

    for (const i of optcontainer.childNodes) {
        console.log(i + "\n");
        if (!i.childNodes[1].checked){
            continue;
        }
        // opt = options[i];

        // if (opt.selected) {
        // result.push(opt.value || opt.text);
        // }
        schedule.push(i.childNodes[0].wholeText);
    }

//   return result;
    console.log("children: ");
    console.log(result);


    fetch('http://127.0.0.1:5000/api/upload-all', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "classes": class_list, 
            "schedule": schedule,
            "added_course": added_course,
            "dropped_course": dropped_course
        }),
    })
    .then(response => response.json())
    .then((data) => {
        console.log("success")
        // anotherMessageDiv.textContent = data.message;
        // do stuff
    })
    .catch(error => {
        console.error('Error:', error);
    });
});