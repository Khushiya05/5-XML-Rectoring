let cl = console.log;
let postForm = document.getElementById("postForm");
let title = document.getElementById("title");
let body = document.getElementById("body");
let userId = document.getElementById("userId");
let postContainer = document.getElementById("postContainer");
let submitBtn = document.getElementById("submitBtn");
let updateBtn = document.getElementById("updateBtn");
let loader = document.getElementById("loader");

let baseUrl = `https://jsonplaceholder.typicode.com`;
let postUrl = `${baseUrl}/posts`
let PostArray = [];


const onEdit = (ele) => {
    let getEditId = ele.closest(".card").id;
    cl(getEditId)
    localStorage.setItem('editId', getEditId)
    let editUrl = `${baseUrl}/posts/${getEditId}`
    makeApiCall("GET", editUrl);
    window.scroll(0, 0);
}
const onDelete = (ele) => {
        let deletedId = ele.closest('.card').id;
        let deleteUrl = `${baseUrl}/posts/${deletedId}`;

        Swal.fire({
            title: "Are you delete this Post?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                makeApiCall("DELETE", deleteUrl)
                Swal.fire({
                    title: "Deleted!",
                    text: "Your Post has been deleted.",
                    icon: "success"
                });
            }
        });
    }
    //3 Templating
const templating = (arr) => {
    let result = ``;
    arr.forEach(ele => {
        result += `
        <div class="card text-center mb-4" id="${ele.id}">
        <div class="card-header">
            <h2>${ele.title}</h2>
        </div>
        <div class="card-body">
            <p>${ele.body}</p>
        </div>
        <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-outline-primary" onclick="onEdit(this)">
                Edit
            </button>
            <button class="btn btn-outline-danger"onclick="onDelete(this)">
                Delete
            </button>
        </div>
    </div>`
    });
    postContainer.innerHTML = result
}

const createCard = (postobj) => {
    let card = document.createElement('div');
    card.className = "card mb-4";
    card.id = postobj.id;
    card.innerHTML = `
            <div class="card-header">
               <h2>${postobj.title}</h2>
           </div>
            <div class="card-body">
                <p>${postobj.body}</p>
            </div>
           <div class="card-footer  d-flex justify-content-between">
                 <button class="btn btn-outline-primary" onclick="onEdit(this)">
                      Edit
                 </button>
                 <button class="btn btn-outline-danger"onclick="onDelete(this)">
                     Delete
                 </button>
          </div>

                         `;
    postContainer.append(card)
    cl(card)
}
const makeApiCall = (methodName, apiUrl, bodymsg = null) => {
    loader.classList.remove('d-none');
    let xhr = new XMLHttpRequest();
    xhr.open(methodName, apiUrl);
    xhr.send(JSON.stringify(bodymsg));
    xhr.onload = function() {
        loader.classList.add('d-none')
        if (xhr.status >= 200 && xhr.status < 300 && xhr.readyState === 4) {
            // cl(xhr.response)
            if (methodName === "GET") {
                let data = JSON.parse(xhr.response);
                if (Array.isArray(data)) {
                    templating(data);
                } else {
                    //patch data
                    // cl(data)
                    updateBtn.classList.remove("d-none");
                    submitBtn.classList.add("d-none")
                    title.value = data.title;
                    body.value = data.body;
                    userId.value = data.userId;
                }
            } else if (methodName === "PUT") {
                let id = JSON.parse(xhr.response).id;
                cl(id)
                let card = document.getElementById(id)
                cl(card)
                let cardChild = [...card.children]
                cardChild[0].innerHTML = `<h2>${bodymsg.title}</h2>`
                cardChild[1].innerHTML = `<p>${bodymsg.body}</p>`;
                cl(cardChild[0])
                cl(cardChild[1]);
                postForm.reset();
                updateBtn.classList.add('d-none');
                submitBtn.classList.remove('d-none');
            } else if (methodName === "POST") {
                createCard(bodymsg)
                Swal.fire("New Post is Created!");
                postForm.reset()
            } else if (methodName === "DELETE") {
                let geteindex = apiUrl.indexOf('posts/');
                cl(geteindex)
                let id = apiUrl.slice(geteindex + 6);
                cl(id)
                document.getElementById(id).remove()
            }
        }
    }
}

const onPostSubmit = (eve) => {
    eve.preventDefault();
    let obj = {
        title: title.value,
        body: body.value,
        userId: userId.value
    }
    cl(obj)
    makeApiCall("POST", postUrl, obj);
}

const onUpdateHandler = () => {
    let updatedObj = {
        title: title.value,
        body: body.value,
        userId: userId.value
    }
    cl(updatedObj)
    let updateId = localStorage.getItem('editId');
    cl(updateId)
    let updateUrl = `${baseUrl}/posts/${updateId}`
    Swal.fire({
        title: "Do you want to Update the changes?",
        showDenyButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't Update`
    }).then((result) => {

        if (result.isConfirmed) {
            Swal.fire("Updated!", "", "success");
            makeApiCall("PUT", updateUrl, updatedObj);
        } else if (result.isDenied) {
            Swal.fire("Your Post is not Updated", "", "info");
        }
    });
}
makeApiCall("GET", postUrl);
updateBtn.addEventListener('click', onUpdateHandler);
postForm.addEventListener("submit", onPostSubmit);