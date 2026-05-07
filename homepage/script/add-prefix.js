"use strict";

const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./"; 

const addPrefixA = (linksArray)=>{
    linksArray.forEach(link => {
        if (!(link.getAttribute("href").includes("https://")||link.getAttribute("href").includes("mailto:"))){
          link.href = prefix + link.getAttribute("href");
        }
    })
}
const addPrefixImg = (imgsArray)=>{
    imgsArray.forEach(img => {
        img.src = prefix + img.getAttribute("src");
    })
}

window.addEventListener("headerFooterLoaded", ()=>{
    const links = document.querySelectorAll("a");
    const images = document.querySelectorAll("img");
    addPrefixA(links);
    addPrefixImg(images);
})