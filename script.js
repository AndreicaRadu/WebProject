const list = document.getElementById('image-list');
const formName = document.getElementById('formName');
const formUrl = document.getElementById('formUrl');
const formtxt = document.getElementById('formtxt');
let addButton = document.getElementById('addButton');
let updateButton = document.getElementById('updateButton');

function getcontent() {
    fetch('http://localhost:3000/content')
        .then(function (response) {
            response.json().then(function (content) {
                appendcontentToDOM(content);
            });
        });
};

function postcontent() {
    const postObject = {
        name: formName.value,
        img: formUrl.value,
        txt: formtxt.value
    }

    fetch('http://localhost:3000/content', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        getcontent();
        resetForm();
    });
}

function deletecontent(id) {
    fetch(`http://localhost:3000/content/${id}`, {
        method: 'DELETE',
    }).then(function () {
        getcontent();
    });
}

function updatecontent(id) {
    const putObject = {
        name: formName.value,
        img: formUrl.value,
        txt: formtxt.value
    }

    fetch(`http://localhost:3000/content/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        getcontent();
        addButton.disabled = false;
        clearUpdateButtonEvents();
        resetForm();
    });
}

function editcontent(content) {
    formName.value = content.name;
    formUrl.value = content.img;
    formtxt.value = content.txt;
    addButton.disabled = true;

    clearUpdateButtonEvents();

    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updatecontent(content.id)
    });
}

function appendcontentToDOM(content) {
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    for (let i = 0; i < content.length; i++) {
        let img = document.createElement('img');
        img.src = content[i].img;
        img.className = "mainpage-image";
        let name = document.createElement('span');
        name.innerText = content[i].name;
        name.className = "mainpage-span";
        let txt = document.createElement('h3');
        txt.innerText = content[i].txt;
        txt.className = "mainpage-h3";
        linebreak = document.createElement("br");
        let editButton = document.createElement('button');
        editButton.addEventListener('click', function () {
            editcontent(content[i])
        });
        editButton.innerText = 'Edit';
        editButton.className = 'script-btn';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deletecontent(content[i].id)
        });
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'script-btn';
        let container = document.createElement('div');
        container.appendChild(editButton);
        container.appendChild(deleteButton);
        container.appendChild(name);
        container.appendChild(linebreak);
        container.appendChild(img);
        container.appendChild(txt);

        list.appendChild(container);
    }
}

function resetForm() {
    formName.value = '';
    formUrl.value = '';
    formtxt.value = '';
}

function clearUpdateButtonEvents() {
    let newUpdateButton = updateButton.cloneNode(true);
    updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
    updateButton = document.getElementById('updateButton');
}
addButton.addEventListener('click', postcontent);

getcontent();
