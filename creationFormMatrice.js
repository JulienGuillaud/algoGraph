let form = document.getElementById("dynamic-table");

form.addEventListener('submit', (e) => {
    e.preventDefault()


    let size = e.target.elements.size.value;

    dynamicTable(size);
})

let table = document.createElement("table");

let tableWrapper = document.getElementById("table-wrapper");
tableWrapper.innerHTML = ''
tableWrapper.appendChild(table);



let dynamicTable = (_size) => {
    $("#table-wrapper table").empty()
    $("#generateButton").show();
    $("#generateButton").prop("disabled", true);
    var newTableSize = (_size * 50) + 100
    table.width = newTableSize + 'px';
    charcode = 64;
    for (let i = 1; i <= _size; i++) {
        let tr = document.createElement("tr");
        table.appendChild(tr)

        let p = document.createElement("p");
        var newCharcode = charcode + i
        var lettre = String.fromCharCode(newCharcode)
        p.style.cssText = 'text-align: center;font-size: 2em;margin-top: 7px;';
        p.innerText = lettre
        tr.appendChild(p)

        for (let n = 0; n < _size; n++) {
            let td = document.createElement("td");
            tr.appendChild(td);
            let input = document.createElement("input");
            input.type = 'text';
            input.maxLength = 1;
            input.classList.add('inputMatrix');
            input.id = i + "-" + n;
            td.appendChild(input)
            $('#' + i + "-" + n).on('keypress', function(e) {
                if (e.which == 48 || e.which == 49 || e.which == 8) {
                    // Si l'input est deja rempli, le vider
                    var pressedKey = String.fromCharCode(e.keyCode);
                    //if($('#'+i + "-" + n).length > 1){
                    $('#' + i + "-" + n).val(pressedKey)
                        //}
                    var n1 = n + 1
                    if (n1 == _size) {
                        var i1 = i + 1
                        if (i != _size) {
                            $('#' + i1 + "-0").focus();
                        }
                    } else {
                        $('#' + i + "-" + n1).focus();
                    }
                } else {
                    return false;
                }
                var isValid = true;
                $('.inputMatrix').each(function() {
                    if ($(this).val() == "") {
                        isValid = false;
                    }
                });
                if (isValid) {
                    $("#generateButton").prop("disabled", false);
                } else {
                    $("#generateButton").prop("disabled", true);
                }
            });
        }
    }
    //$("#table-wrapper table").prepend("<tr></tr>");
    let tr = document.createElement("tr");
    for (var i = 0; i <= _size; i++) {
        var newCharcode = charcode + i
        var lettre = String.fromCharCode(newCharcode)
        if (i == 0) lettre = ""
        let p = document.createElement("td");
        p.style.cssText = 'text-align: center;font-size: 2em;';
        p.innerText = lettre
        tr.appendChild(p)
    }
    table.insertBefore(tr, table.firstChild);
}