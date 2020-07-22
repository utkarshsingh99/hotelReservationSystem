var selectedRow = null

function onFormSubmit() {
        var formData = readFormData();
        if (selectedRow == null)
            insertNewRecord(formData);
        else
            updateRecord(formData);
        resetForm();
    }

function readFormData() {
    var formData = {};
    formData["roomNumber"] = document.getElementById("roomNumber").value;
    formData["features"] = document.getElementById("features").value;
    formData["bedCapacity"] = document.getElementById("bedCapacity").value;
    formData["rent"] = document.getElementById("rent").value;
    formData["address"] = document.getElementById("address").value;
    formData["bookingStatus"] = document.getElementById("bookingStatus").value;
    return formData;
}

function insertNewRecord(data) {
    var table = document.getElementById("roomList").getElementsByTagName('tbody')[0];
    var newRow = table.insertRow(table.length);
    cell1 = newRow.insertCell(0);
    cell1.innerHTML = data.roomNumber;
    cell2 = newRow.insertCell(1);
    cell2.innerHTML = data.features;
    cell3 = newRow.insertCell(2);
    cell3.innerHTML = data.bedCapacity;
    cell4 = newRow.insertCell(3);
    cell4.innerHTML = data.rent;
    cell5 = newRow.insertCell(4);
    cell5.innerHTML = data.address;
    cell6 = newRow.insertCell(5);
    cell6.innerHTML = data.bookingStatus;
    cell7 = newRow.insertCell(6);
    cell7.innerHTML = `<a onClick="onEdit(this)">Edit</a>
                       <a onClick="onDelete(this)">Delete</a>`;
}

function resetForm() {
    document.getElementById("roomNumber").value = "";
    document.getElementById("features").value = "";
    document.getElementById("bedCapacity").value = "";
    document.getElementById("rent").value = "";
    document.getElementById("address").value = "";
    document.getElementById("bookingStatus").value = "";
    selectedRow = null;
}

function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    document.getElementById("roomNumber").value = selectedRow.cells[0].innerHTML;
    document.getElementById("features").value = selectedRow.cells[1].innerHTML;
    document.getElementById("bedCapacity").value = selectedRow.cells[2].innerHTML;
    document.getElementById("rent").value = selectedRow.cells[3].innerHTML;
    document.getElementById("address").value = selectedRow.cells[4].innerHTML;
    document.getElementById("bookingStatus").value = selectedRow.cells[5].innerHTML;
}
function updateRecord(formData) {
    selectedRow.cells[0].innerHTML = formData.roomNumber;
    selectedRow.cells[1].innerHTML = formData.features;
    selectedRow.cells[2].innerHTML = formData.bedCapacity;
    selectedRow.cells[3].innerHTML = formData.rent;
    selectedRow.cells[4].innerHTML = formData.address;
    selectedRow.cells[5].innerHTML = formData.bookingStatus;

}

function onDelete(td) {
    if (confirm('Are you sure to delete this record ?')) {
        row = td.parentElement.parentElement;
        document.getElementById("employeeList").deleteRow(row.rowIndex);
        resetForm();
    }
}