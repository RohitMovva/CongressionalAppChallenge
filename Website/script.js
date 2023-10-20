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

const myForm = document.getElementById("myForm");
const csvFile = document.getElementById("csvFile");
var classes = [];
myForm.addEventListener("submit", function (e) {
    let datar = "";
    e.preventDefault();
    const input = csvFile.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        datar = text;
        fetch(`http://127.0.0.1:5000/api/greet`, {
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
            let list = document.getElementById("myList");
            for (i = 0; i < classes.length; i++) {
                let li = document.createElement('li');
                li.innerText = classes[i];
                console.log(li);
                list.appendChild(li);
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
});

window.onload = function() {
    const myElements = document.querySelectorAll('.my-class');
    
    // Create an array of IntersectionObserverEntry objects
    const entries = [];
    myElements.forEach((el) => {
        entries.push({ target: el });
    });

    myFunction(entries);
    myElements.forEach((el) => observer.observe(el));
};