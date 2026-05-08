"use strict";

const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./"; 

const addPrefixA = (linksArray)=>{
    linksArray.forEach(link => {
        const href = link.getAttribute("href");
        if (!(href.includes("https://")||href.includes("mailto:")||href.includes("./"))){
          link.href = prefix + link.getAttribute("href");
        }
    });
};
const addPrefixImg = (imgsArray)=>{
    imgsArray.forEach(img => {
        img.src = prefix + img.getAttribute("src");
    });
};

window.addEventListener("headerFooterLoaded", ()=>{
    const links = document.querySelectorAll("a");
    const images = document.querySelectorAll("img");
    addPrefixA(links);
    addPrefixImg(images);
});