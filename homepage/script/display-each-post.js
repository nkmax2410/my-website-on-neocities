"use strict";
const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./"; 

const url = new URL(window.location.href);
const fileName = url.pathname.split("/").pop();

const title = document.querySelector("title");
const articleFieldTitle = document.getElementById("articleFieldTitle");
const articleFieldContent = document.getElementById("articleFieldContent");
const articleDateField = document.getElementById("articleDateField");
/* const title = document.querySelector("title"); display-common-parts.jsにおいてすでに定義されています。*/

const thisPageIdx = Number(fileName.match(/^\d+/)[0].replace(/^0+/, ""))-1;

const fetchAPost = async() => {
    const response = await fetch(prefix + "source/posts.json");
    const data = await response.json();

    const postOfThisPage = data[thisPageIdx];

    
    title.textContent = postOfThisPage.title + title.textContent;
    articleFieldTitle.textContent = postOfThisPage.title;
    articleFieldContent.innerHTML = postOfThisPage.body;
    articleDateField.innerHTML = `<time datetime="${postOfThisPage.date}">` + postOfThisPage.date.replace(/-/g,"/").replace(/\/0/g,"/") + "</time>";
}

fetchAPost();