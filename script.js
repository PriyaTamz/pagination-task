function create_th(tagname, content){
    var ele = document.createElement(tagname);
    ele.innerHTML = content;
    return ele;
}

function create_tr(){
    var ele = document.createElement("tr");
    return ele;
}

function create_td(tagname, content){
    var ele = document.createElement(tagname);
    ele.innerHTML = content;
    return ele;
}

var current_page = 1;
var rows_per_page = 5;

function fetch_data() {
    var request = new XMLHttpRequest();
    request.open("GET", "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json");
    request.send();

    request.onload = function () {
        if (request.status === 200) {
            var result = JSON.parse(request.response);
            deliver_table(result);
        } else {
            console.error('Failed to fetch data');
        }
    }
}

function deliver_table(result) {
    var div = document.querySelector(".table-responsive");
    div.innerHTML = "";

    var table = document.createElement("table");
    table.className = "table table-bordered";

    var thead = document.createElement("thead");
    var trow = create_tr();
    var th1 = create_th("th", "ID");
    var th2 = create_th("th", "Name");
    var th3 = create_th("th", "Email");

    trow.append(th1, th2, th3);
    thead.append(trow);
    table.append(thead);

    var tbody = document.createElement("tbody");

    var start = (current_page - 1) * rows_per_page;
    var end = start + rows_per_page;

    for(var i = start; i < end && i < result.length; i++){
        var item = result[i];
        var row = create_tr();
        var td1 = create_td("td", item.id);
        var td2 = create_td("td", item.name);
        var td3 = create_td("td", item.email);
        row.append(td1, td2, td3);
        tbody.append(row);
    }

    table.append(tbody);
    div.append(table);

    pagination(result.length);
}

function create_button(tagname, atrName, atrValue, content){
    var input = document.createElement(tagname);
    input.setAttribute(atrName, atrValue);
    input.innerHTML = content;
    return input;
}

function pagination(total_rows) {
    var div = document.getElementById("buttons");
    div.innerHTML = "";

    var total_pages = Math.ceil(total_rows/rows_per_page);
    var max_page_link = 5;
    var start_page, end_page;

    if(total_pages <= max_page_link){
        start_page = 1;
        end_page = total_pages;
    } else {
        var half = Math.ceil(max_page_link / 2);
        if (current_page <= half) {
            start_page = 1;
            end_page = max_page_link;
        } else if (current_page + half - 1 >= total_pages) {
            start_page = total_pages - max_page_link + 1;
            end_page = total_pages;
        } else {
            start_page = current_page - half + 1;
            end_page = current_page + half - 1;
        }
    }

    var prev_button = create_button('a', 'href', '#', '&laquo;');
    prev_button.addEventListener("click", function (event) {
        event.preventDefault();
        if(current_page > 1) {
            current_page--;
            fetch_data();
        }
    });
    div.append(prev_button);

    var first_button = create_button('a', 'href', '#', 'First');
    first_button.addEventListener("click", function (event) {
        event.preventDefault();
        if(current_page > 1) {
            current_page = 1;
            fetch_data();
        }
    });
    div.append(first_button);

    for(let i = start_page; i <= end_page; i++){
        var button = create_button('a', 'href', '#', i);
        if(i == current_page){
            button.className = "active";
        }
        button.addEventListener("click", function (event) {
            event.preventDefault();
            current_page = i;
            fetch_data();
        });
        div.append(button);
    }

    var last_button = create_button('a', 'href', '#', 'Last');
    last_button.addEventListener("click", function (event) {
        event.preventDefault();
        if(current_page < total_pages) {
            current_page = total_pages;
            fetch_data();
        }
    });
    div.append(last_button);

    var next_button = create_button('a', 'href', '#', '&raquo;');
    next_button.addEventListener("click", function (event) {
        event.preventDefault();
        if(current_page < total_pages) {
            current_page++;
            fetch_data();
        }
    });
    div.append(next_button);
}

fetch_data();
