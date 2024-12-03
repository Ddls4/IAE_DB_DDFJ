// Registrar un nuevo usuario
async function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
        } else {
            alert(data.message || 'Hubo un error al registrar el usuario.');
        }
    })
    .catch(error => {
        console.error('Error en el registro:', error);
    });
    if (response.ok) window.location = '/';
}
// Iniciar sesión
let loginUser=()=> {
    let username = document.querySelector('#loginUsername').value;
    let password = document.querySelector('#loginPassword').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Login exitoso.');
        } else {
            alert(data.message || 'Hubo un error al Logear el usuario.');
        }
    })
    .catch(error => {
        console.error('Error en el Login:', error);
    });
    if (response.ok) window.location = '/';
}
async function getUserInfo() {
    const response = await fetch('/user');
    if (response.ok) {
        const user = await response.json();
        document.getElementById('welcomeMessage').textContent = `Bienvenido, ${user.username}`;
    } else {
        document.getElementById('welcomeMessage').textContent = 'Bienvenido';
        
    }
}
async function logout() {
    const response = await fetch('/logout', { method: 'POST' });
    if (response.ok) {
        location.reload();
    }
}
getUserInfo();