"use strict";
const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./";

const minipostsField = document.querySelector(".minipostsField");

const renderMiniposts = (json)=>{
    let html = "";
    json.forEach((minipost)=>{
        html += `<div class="minipost">`;
        html += `<p><time datetime=${minipost.date}>${new Date(minipost.date).toLocaleDateString("ja-JP")}</time></p>`
        html += `<p>${minipost.body}</p>`
        html += "</div>";
    });
    minipostsField.innerHTML = html;
    console.log(html);
}

const fetchAndRenderMiniposts = async () =>{
    const response = await fetch(prefix + "source/miniposts.json");
    const data = await response.json();
    data.reverse();

    renderMiniposts(data);
}

fetchAndRenderMiniposts();