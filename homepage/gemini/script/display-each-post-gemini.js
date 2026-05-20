"use strict";
const url = new URL(window.location.href);
const fileName = url.pathname.split("/").pop();

const title = document.querySelector("title");
const articleFieldTitle = document.getElementById("articleFieldTitle");
const articleFieldContent = document.getElementById("articleFieldContent");
const articleDateField = document.getElementById("articleDateField");

const thisPageIdx = Number(fileName.match(/^\d+/)[0].replace(/^0+/, ""))-1;

const fetchAPost = async() => {
    const response = await fetch("./source/posts-gemini.json");
    const data = await response.json();

    const postOfThisPage = data[thisPageIdx];

    console.log("title.textContent")
    title.textContent = postOfThisPage.title + title.textContent;
    articleFieldTitle.textContent = postOfThisPage.title;
    articleFieldContent.innerHTML = postOfThisPage.body;
    articleDateField.textContent = postOfThisPage.date.replace(/-/g,"/").replace(/\/0/g,"/");
}

fetchAPost();