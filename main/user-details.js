//      На странице user-details.html:
// 4 Вивести всю, без виключення, інформацію про об'єкт user на який клікнули
// 5 Додати кнопку "post of current user", при кліку на яку, з'являються title всіх постів поточного юзера
// (для получения постов используйте эндпоинт https://jsonplaceholder.typicode.com/users/USER_ID/posts)
// 6 Каждому посту додати кнопку/посилання, при кліку на яку відбувається перехід на сторінку post-details.html,
// котра має детальну інфу про поточний пост.

// user-details.html - блок з інфою про user зверху сторінки. Кнопка нижчє, на 90% ширини сторінки, по центру.
// блоки з короткою іфною про post - в ряд по 5 .

let url = new URL(location.href);
let userId = JSON.parse(url.searchParams.get("id"));

//create block for user's information
let mainBlock = document.createElement("div");
mainBlock.classList.add("userInfo")
let h1 = document.createElement("h1");
h1.innerText = `User ${userId}:`
mainBlock.appendChild(h1);
document.body.appendChild(mainBlock);

let mainUl = document.createElement("ul");
mainUl.classList.add("mainUl");
mainBlock.appendChild(mainUl);

//Create block for button to show/hide all posts and posts title
let divForPostsAndButton = document.createElement("div");
divForPostsAndButton.classList.add("divForPostsAndButton");
document.body.appendChild(divForPostsAndButton);

//create block for posts
let postsMainDiv = document.createElement("div");
postsMainDiv.style.display = "none";
divForPostsAndButton.appendChild(postsMainDiv);

//create block for button
let showPosts = document.createElement("button");
showPosts.classList.add("displayPosts");
showPosts.innerText = `Show all posts of the current user`;
divForPostsAndButton.prepend(showPosts);

//get user's information;
async function getUser() {
    let usersArr = await fetch("https://jsonplaceholder.typicode.com/users/" + userId);
    return usersArr.json();
}
//wait and display user's information
async function render() {
    let user = await getUser();
    recursiveKeyValueGetter(user, mainUl);
}
//function for creation and display all user's info
function recursiveKeyValueGetter(object, divToAppend) {
    for(let key in object) {
        if(typeof object[key] === "object" && object[key] !== null) {
            let li = document.createElement("li");
            let ul = document.createElement("ul");
            ul.innerText = `${key}:`
            li.appendChild(ul);
            divToAppend.appendChild(li);
            recursiveKeyValueGetter(object[key], ul);
        } else {
            let li = document.createElement("li");
            li.innerText = `${key}: ${object[key]}`;
            divToAppend.append(li);
        }
    }
}
// export { recursiveKeyValueGetter };

//function for getting all user's posts
async function getUserPosts(id) {
    let postsPromises = await fetch(`https://jsonplaceholder.typicode.com/users/`+ id + "/posts");
    return postsPromises.json();
}
//function for creation and display all user's posts
async function displayPosts() {
    let posts = await getUserPosts(userId);
    posts.forEach((post) => {
        let postDiv = document.createElement("div");
        postDiv.classList.add("postDiv");
        let postContent = document.createElement("p");
        let redirectAnchor = document.createElement("a");
        let redirectButton = document.createElement("button");
        postContent.innerHTML = `Post "№${post.id}" <hr/>title: "${post.title}"`
        redirectButton.innerText = `Post №${post.id} details`;
        redirectButton.classList.add("redirectButton");
        redirectAnchor.href = "./post-details.html?postId=" + post.id;
        redirectAnchor.appendChild(redirectButton);
        postDiv.append(postContent, redirectAnchor);
        postsMainDiv.appendChild(postDiv);
    })
}
//create event on button to show/hide user's posts
showPosts.onclick = function() {
    if(postsMainDiv.childNodes.length === 0) {
        displayPosts();
    }
    if(postsMainDiv.style.display === "none") {
        postsMainDiv.style.display = "grid";
        postsMainDiv.classList.toggle("postsMainDiv");
        showPosts.innerText = `Hide all posts of the current user`
    } else {
        postsMainDiv.style.display = "none";
        postsMainDiv.classList.toggle("postsMainDiv");
        showPosts.innerText = `Show all posts of the current user`
    }
}

render();