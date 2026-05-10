"use strict";
const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./";

const updateField = document.querySelector(".updateField");

const renderUpdates = (json)=>{
    let html = "";
    json.forEach((update)=>{
        html += `<div class="update">`;
        html += `<p><time datetime=${update.date}>${new Date(update.date).toLocaleDateString("ja-JP")}</time></p>`
        html += `<p>${update.title}</p>`
        html += "</div>";
    });
    updateField.innerHTML = html;
    console.log(html);
}

const fetchAndRenderUpdates = async () =>{
    const response = await fetch(prefix + "source/updates.json");
    const data = await response.json();
    data.reverse();

    renderUpdates(data);
}

fetchAndRenderUpdates();