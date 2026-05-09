"use strict";
const currentUrl = window.location.href;
const prefix = currentUrl.includes("/articles/") ? "../" : "./";

const header = document.querySelector("header");
const footer = document.querySelector("footer");
const title = document.querySelector("title");
const favicon = document.querySelector("link[rel='icon']");
const siteTitle = "思考停止のサイト";

favicon.href = prefix + "image/favicon.png";

title.textContent += ` | ${siteTitle}`;

const fetchHeader = async ()=> {
    const response = await fetch(prefix + "html-source/header.html");
    const headerHtml = await response.text();

    header.innerHTML = response.ok ? headerHtml : "";
}
const fetchFooter = async () => {
    const response = await fetch(prefix + "html-source/footer.html");
    const footerHtml = await response.text();

    footer.innerHTML = response.ok ? footerHtml : "";
}

const display = async() =>{
    await fetchHeader();
    await fetchFooter();

    const event = new CustomEvent('headerFooterLoaded');
    window.dispatchEvent(event);
}

display()

/* 上は非同期処理なので以下の処理は先にやる */
const googleFontCode = `<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP&display=swap" rel="stylesheet">`

document.head.insertAdjacentHTML('beforeend', googleFontCode);