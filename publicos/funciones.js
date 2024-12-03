let tableData = {
    columns: [],
    rows: []
};
//  CREAR TABLA
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
function createTable() {
    const columnCount = document.getElementById('columnCount').value;
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const rowInputs = document.getElementById('rowInputs');
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    rowInputs.innerHTML = '';

    const row = document.createElement('tr');
    for (let i = 0; i < columnCount; i++) {
        const th = document.createElement('th');
        const columnName = document.getElementById(`columnName${i}`).value;
        th.textContent = columnName || `Columna ${i + 1}`;
        row.appendChild(th);
        tableData.columns.push(columnName || `Columna ${i + 1}`);
        // Crear inputs para agregar filas
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `rowInput${i}`;
        input.placeholder = `Dato ${i}`;
        rowInputs.appendChild(input);
    }
    tableHead.appendChild(row);
    rowInputs.style.display = 'block';

}
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
    tableData.rows.push(rowData)
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
    actionTd.style.width = '15%';
    actionTd.append(editButton, deleteButton);
    row.appendChild(actionTd);
    tableBody.appendChild(row);

}

// saveTable 
function saveTableData() {
    fetch('/save-table', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Tabla guardada:', data);
    })
    .catch(error => {
        console.error('Error al guardar la tabla:', error);
    });
}
// loadTable
function loadTable() {
    fetch(`/load-table`)
        .then(response => response.json())
        .then(data => {
            if (data) {
                tableData.columns = data.columns; // Actualiza columnas
                tableData.rows = data.rows;     // Actualiza filas
                
                // Renderizar la tabla
                renderTable();
            } else {
                console.log('No se encontró información para la tabla.');
            }
        })
        .catch(error => {
            console.error('Error al cargar la tabla desde el servidor:', error);
        });
}

function renderTable() {
    const tableHead = document.getElementById('tableHead');
    const tableBody = document.getElementById('tableBody');
    const rowInputs = document.getElementById('rowInputs');
    const addRowSection = document.getElementById('addRowSection');

    tableHead.innerHTML = '';
    tableBody.innerHTML = '';
    rowInputs.innerHTML = '';

    // Renderizar encabezados
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

    // Renderizar filas
    tableData.rows.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const td = document.createElement('td');
            td.textContent = cellData;
            row.appendChild(td);
        });
        tableBody.appendChild(row);
        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.onclick = onClick;
            return button;
        };
        const editButton = createButton('Editar', () => editRow(row, rowData));
        const deleteButton = createButton('Eliminar', () => deleteRow(row, rowData));
        const actionTd = document.createElement('td');
        actionTd.style.width = '15%';
        actionTd.append(editButton, deleteButton);
        row.appendChild(actionTd);
        tableBody.appendChild(row);
    });
    addRowSection.style.display = 'block';

}

//  Edicion TABLA
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

// falta saveRow deleteRow

function saveRow(row, rowData) {
    const rowIndex = tableData.rows.findIndex(data => 
        JSON.stringify(data) === JSON.stringify(rowData)
    );
    if (rowIndex > -1) {
        tableData.rows.splice(rowIndex, 1); // Eliminar del array
    } else {
        console.error('La fila no se encontró en tableData.rows.');
    }
    const inputs = Array.from(row.getElementsByTagName('input'));
    inputs.forEach((input, index) => {
        rowData[index] = input.value;
        const td = row.cells[index];
        td.textContent = input.value;
    });
    tableData.rows.push(rowData)
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
}

function deleteRow(row, rowData) {
    const tableBody = document.getElementById('tableBody');
    const rowIndex = tableData.rows.findIndex(data => 
        JSON.stringify(data) === JSON.stringify(rowData)
    );

    if (rowIndex > -1) {
        tableData.rows.splice(rowIndex, 1); // Eliminar del array
    } else {
        console.error('La fila no se encontró en tableData.rows.');
    }
    tableBody.removeChild(row);
}

