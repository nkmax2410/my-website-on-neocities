"use strict";
const header = document.querySelector("header");
const footer = document.querySelector("footer");
const title = document.querySelector("title");
const favicon = document.querySelector("link");
const siteTitle = "思考停止のサイト";

favicon.href = "../image/favicon.png";

title.textContent += ` | ${siteTitle}`;



const fetchHeader = async ()=> {
    const response = await fetch("../html-source/header.html");
    const headerHtml = await response.text();

    header.innerHTML = response.ok ? headerHtml : "";
}
const fetchFooter = async () => {
    const response = await fetch("../html-source/footer.html");
    const footerHtml = await response.text();

    footer.innerHTML = response.ok ? footerHtml : "";
}

const display = async() =>{
    await fetchHeader();
    await fetchFooter();

    const event = new CustomEvent('headerFooterLoaded');
    window.dispatchEvent(event);
}

window.onload = ()=>{
    const scripts = document.querySelectorAll("script");
    let doesDisplayPostScriptExist = false;
    for (let script of scripts){
        if (script.getAttribute("src") !== null && script.getAttribute("src").includes("display-post.js")){
            doesDisplayPostScriptExist = true;
            break;
        }
    }

    if (doesDisplayPostScriptExist) {
        window.addEventListener("postsLoaded",()=>{
            display();
        })
    }
    else{
        display()
    }
};