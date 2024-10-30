
// Función para generar los inputs para ingresar los nombres de las columnas
function generateColumnInputs() {
    const columnCount = document.getElementById('columnCount').value;
    const columnNamesSection = document.getElementById('columnNamesSection');
    columnNamesSection.innerHTML = '';

    for (let i = 0; i < columnCount; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Nombre de columna ${i + 1}`;
        input.id = `columnName${i}`;
        columnNamesSection.appendChild(input);
    }
}
// Crear encabezados de la tabla y guardar en localStorage
function createTable() {
    const columnCount = document.getElementById('columnCount').value;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const rowInputs = document.getElementById('rowInputs');
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    rowInputs.innerHTML = '';

    const row = document.createElement('tr');
    const columnNames = [];
    for (let i = 0; i < columnCount; i++) {
        const th = document.createElement('th');
        const columnName = document.getElementById(`columnName${i}`).value;
        th.textContent = columnName || `Columna ${i + 1}`;
        row.appendChild(th);
        columnNames.push(columnName || `Columna ${i + 1}`);
        // Crear inputs para agregar filas
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `rowInput${i}`;
        input.placeholder = `Dato ${i}`;
        rowInputs.style.display = 'block';
    }
    // Obtener el usuario actual desde localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const tableData = { columns: columnNames, rows: [] };
        localStorage.setItem(`${currentUser.username}_table`, JSON.stringify(tableData));
    }
}

// Función para agregar una fila a la tabla y actualizar el localStorage
function addRow() {
    const columnCount = document.getElementById('columnCount').value;
    const tableBody = document.getElementById('tableBody');
    const row = document.createElement('tr');
    const rowData = [];

    for (let i = 0; i < columnCount; i++) {
        const td = document.createElement('td');
        const value = document.getElementById(`rowInput${i}`).value;
        td.textContent = value || '';
        row.appendChild(td);
        rowData.push(value || '');
    }
    // Crear botones de editar y eliminar
    const createButton = (text, onClick) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        return button;
    };
    const editButton = createButton('Editar', () => editRow(row, rowData));
    const deleteButton = createButton('Eliminar', () => deleteRow(row, rowData));

    const actionTd = document.createElement('td');
    actionTd.append(editButton, deleteButton);
    row.appendChild(actionTd);
    tableBody.appendChild(row);

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const tableData = JSON.parse(localStorage.getItem(`${currentUser.username}_table`));
        tableData.rows.push(rowData);
        localStorage.setItem(`${currentUser.username}_table`, JSON.stringify(tableData));
        
        fetch(`/usuario/${currentUser.username}/tabla`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tabla: tableData }) 
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Tabla actualizada en el servidor:', data);
            } else {
                console.error('Error al actualizar la tabla en el servidor:', data.message);
            }
        })
        .catch(error => console.error('Error en la petición fetch:', error));
    
    } else {
        console.log('No hay un usuario logueado.');
    }
}

// Función para borrar la tabla y el localStorage
function clearTable() {
    localStorage.removeItem('columnNames');
    localStorage.removeItem('tableData');
    document.getElementById('tableHead').innerHTML = '';
    document.getElementById('tableBody').innerHTML = '';
    document.getElementById('addRowSection').style.display = 'none';
    document.getElementById('columnNamesSection').innerHTML = '';
    document.getElementById('columnCount').value = '';
}

// Registrar un nuevo usuario
async function registerUser() {
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    // Verificar si el usuario ya existe en localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(user => user.username === username)) {
        alert('El usuario ya existe.');
        return;
    }
    const hashedPassword = CryptoJS.SHA256(password).toString();  //CryptoJS

    users.push({ username,  password:hashedPassword });
    localStorage.setItem('users', JSON.stringify(users));

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: hashedPassword,
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
}

// Iniciar sesión
let loginUser=()=> {
    let username = document.querySelector('#loginUsername').value
    let password = document.querySelector('#loginPassword').value
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hashedPassword = CryptoJS.SHA256(password).toString();
    const user = users.find(user => user.username === username && user.password === hashedPassword);

    if (!user) {
        console.log('Usuario no encontrado o credenciales incorrectas');
        return;
    }

    if (user) {
        // Guardar el usuario en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Inicio de sesión exitoso');
    } else {
        console.log('Usuario o contraseña incorrectos');
    }
}

// Cargar la tabla asociada al usuario desde localStorage
function loadTable() {
    // Obtener el usuario actual desde localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        const tableData = JSON.parse(localStorage.getItem(`${currentUser.username}_table`));

        if (tableData) {
            const tableHead = document.getElementById('tableHead');
            const tableBody = document.getElementById('tableBody');
            const rowInputs = document.getElementById('rowInputs');
            const addRowSection = document.getElementById('addRowSection');

            tableHead.innerHTML = '';
            tableBody.innerHTML = '';
            rowInputs.innerHTML = '';

            const row = document.createElement('tr');
            tableData.columns.forEach((columnName, index) => {
                const th = document.createElement('th');
                th.textContent = columnName;
                row.appendChild(th);

                const input = document.createElement('input');
                input.type = 'text';
                input.id = `rowInput${index}`;
                rowInputs.appendChild(input);
            });
            tableHead.appendChild(row);
            tableData.rows.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cellData => {
                    const td = document.createElement('td');
                    td.textContent = cellData;
                    row.appendChild(td);
                });
                tableBody.appendChild(row);
            });

            addRowSection.style.display = 'block';
        }
    } else {
        console.log('No hay un usuario logueado para cargar la tabla.');
    }
}

// Función para editar una fila
function editRow(row, rowData) {
    const inputs = Array.from(row.getElementsByTagName('td'));
    inputs.forEach((td, index) => {
        if (index < rowData.length) {
            const input = document.createElement('input');
            input.value = td.textContent;
            td.textContent = '';
            td.appendChild(input);
        }
    });
    
    // Cambiar el botón de editar por un botón de guardar
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Guardar';
    saveButton.onclick = function() {
        saveRow(row, rowData);
    };
    
    row.lastChild.replaceChild(saveButton, row.lastChild.firstChild);
}

// Función para guardar los cambios en una fila
function saveRow(row, rowData) {
    const inputs = Array.from(row.getElementsByTagName('input'));
    inputs.forEach((input, index) => {
        rowData[index] = input.value;
        const td = row.cells[index];
        td.textContent = input.value;
    });

    // Restaurar los botones de editar y eliminar
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = function() {
        editRow(row, rowData);
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = function() {
        deleteRow(row, rowData);
    };

    const actionTd = row.lastChild;
    actionTd.innerHTML = '';  // Limpiar contenido anterior
    actionTd.appendChild(editButton);
    actionTd.appendChild(deleteButton);

    // Actualizar localStorage aquí si es necesario
}

// Función para eliminar una fila
function deleteRow(row, rowData) {
    const tableBody = document.getElementById('tableBody');
    tableBody.removeChild(row);

    // Actualizar localStorage para eliminar la fila
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const tableData = JSON.parse(localStorage.getItem(`${currentUser.username}_table`));

        // Encuentra el índice de la fila que quieres eliminar
        const rowIndex = tableData.rows.findIndex(r => JSON.stringify(r) === JSON.stringify(rowData));
        
        // Si se encontró la fila, eliminarla
        if (rowIndex !== -1) {
            tableData.rows.splice(rowIndex, 1);
            }
        // Guardar la tabla actualizada en localStorage
        localStorage.setItem(`${currentUser.username}_table`, JSON.stringify(tableData));

    }
}