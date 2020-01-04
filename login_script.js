const loginName = document.getElementById('loginName');
const loginPassword = document.getElementById('loginPassword');
let result = document.getElementById('login-result');

function checkLogin() {
    fetch('http://localhost:3000/users')
        .then(function (response) {
            response.json().then(function (users) {
                loginfunc(users);
            });
        });
}

function loginfunc(users) {
    let userName = loginName.value;
    let userPassword = loginPassword.value;
    
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }

    var ok = 0;
    for (var i = 0; i < users.length; i++) {
        if (users[i].name == userName) {
            ok = 1;
        }
    }
    if(ok == 0)
    {
        let serverMessage = document.createElement('span');
        serverMessage.innerText = 'New user created. Continue to main page below'

        let container = document.createElement('div');
        container.appendChild(serverMessage);
        result.appendChild(container);

        const postObject = {
            name: userName,
            password: userPassword
        }

        fetch('http://localhost:3000/users', {
            method: 'post',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(postObject)
        });
    }

    if(ok == 1)
    {
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == userName && users[i].password == userPassword) {
                let serverMessage = document.createElement('span');
                serverMessage.innerText = 'Succesful login! Continue to main page below'

                let container = document.createElement('div');
                container.appendChild(serverMessage);
                result.appendChild(container);

                return;
            }
        }
    
        let serverMessage = document.createElement('span');
        serverMessage.innerText = 'Name or password is incorrect'

        let container = document.createElement('div');
        container.appendChild(serverMessage);
        result.appendChild(container);
    }
}
let loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click', checkLogin);
while (result.firstChild) {
    result.removeChild(result.firstChild);
}
