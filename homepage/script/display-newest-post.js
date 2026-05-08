"use strict";
const newestPostsField = document.querySelector(".newestPostsField");
const numOfPostsToDisplay = 3;

const fetchNewestPosts = async () =>{
    const res = await fetch("./source/posts.json");
    const data = await res.json();
    data.reverse();

    const postsToDisplay = data.slice(0,numOfPostsToDisplay);

    let html = "";
    
    for (let post of postsToDisplay){
        html += `<a href=./articles/${post.id.toString().padStart(8,"0")}.html>`;
        html += "<div class='newestPost'>";
        html += `<h3>${post.title}</h3>`;

        let tagUl = "<ul class='IBM-font'>"; 
        for (let tag of post.tags){
            tagUl += `<li>${tag}</li>`;
        }
        tagUl += "</ul>"

        html += 
        `<div class="newestPostData">
            <div class="post-tags"><p>タグ:</p>${tagUl}</div>
        
            <time datetime="${post.date}">${new Date(post.date).toLocaleDateString("ja-JP")}</time>`;
        html += "</div></div></a>";
    }

    newestPostsField.innerHTML = html;
}

fetchNewestPosts();