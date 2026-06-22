"use strict";
const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./"; 

let currentPage = 1;

const postsPerPage = 10;
let allPosts = [];
let currentPosts = [];
const indexButtonNumBorder = 2 // インデックス表示の調整に使用。

const indexButtons = document.querySelectorAll(".indexButton");
const indexButtonsLower = document.querySelectorAll(".indexButtonLower");
const indexDots = document.querySelectorAll(".indexDots");
const indexDotsLower = document.querySelectorAll(".indexDotsLower")

const fetchPosts = async () => {
    const response = await fetch("./source/posts.json");
    allPosts = await response.json();
    
    allPosts.reverse();
    currentPosts = allPosts;
    
    displayIndex(currentPage, allPosts);
    displayPage(currentPage,allPosts);
};

const displayIndex = (currentPage, postArray)=>{
    indexButtons.forEach(indexButton => {
        if(indexButton.classList.contains("invisible")){
            indexButton.classList.remove("invisible");
        }
    })
    indexDots.forEach(indexDots => {
        if(indexDots.classList.contains("invisible")){
            indexDots.classList.remove("invisible");
        }
    })
    indexButtonsLower.forEach(indexButton => {
        if(indexButton.classList.contains("invisible")){
            indexButton.classList.remove("invisible");
        }
    })
    indexDotsLower.forEach(indexDots => {
        if(indexDots.classList.contains("invisible")){
            indexDots.classList.remove("invisible");
        }
    })
    for (const indexButton of [...indexButtons].slice(1,indexButtons.length - 1)) {
        indexButton.removeEventListener("click", clicked);
    }

    for (const indexButton of [...indexButtonsLower].slice(1,indexButtonsLower.length - 1)) {
        indexButton.removeEventListener("click", clicked);
    }

    const numOfPosts = postArray.length;
    const numOfPages = Math.ceil(numOfPosts / postsPerPage);

    if (currentPage <= indexButtonNumBorder){
        for(let i=0; i<=indexButtonNumBorder - currentPage; i++){
            indexButtons[i].classList.add("invisible");
        }
        indexDots[0].classList.add("invisible");
        for(let i=0; i<=indexButtonNumBorder - currentPage; i++){
            indexButtonsLower[i].classList.add("invisible");
        }
        indexDotsLower[0].classList.add("invisible");
    }

    if (currentPage > (numOfPages - indexButtonNumBorder)){
        for(let i=indexButtons.length - (indexButtonNumBorder - (numOfPages - currentPage)); i<indexButtons.length; i++){
            indexButtons[i].classList.add("invisible");
        }
        indexDots[1].classList.add("invisible");

        for(let i=indexButtons.length - (indexButtonNumBorder - (numOfPages - currentPage)); i<indexButtons.length; i++){
            indexButtonsLower[i].classList.add("invisible");
        }
        indexDotsLower[1].classList.add("invisible");
    }

    for (let i=1; i<indexButtons.length-1; i++){
        indexButtons[i].textContent = currentPage - indexButtonNumBorder + i;
        indexButtonsLower[i].textContent = currentPage - indexButtonNumBorder + i;
    }

    for (const indexButton of [...indexButtons].slice(1,indexButtons.length - 1)) {
        indexButton.addEventListener("click", clicked);
    }

    for (const indexButton of [...indexButtonsLower].slice(1,indexButtonsLower.length - 1)) {
        indexButton.addEventListener("click", clicked);
    }
};

const displayPage = (currentPage,postArray)=> {
    let postsHtml = "";
    
    const startIndex = (currentPage - 1) * 10;
    const slicedPosts = postArray.slice(startIndex, startIndex + postsPerPage);

    slicedPosts.forEach(post=>{
        postsHtml += `<a href="${prefix}articles/${post.id.toString().padStart(8,"0")}.html">`;
        postsHtml += "<div class='post'>";
        postsHtml += `<h2>${post.title}</h2>`;
        let dateWithSlash = post.date.replace(/-/g,"/").replace(/\/0/g,"/");
        let tagUl = "<ul class='IBM-font'>"; 
        for (let tag of post.tags){
            tagUl += `<li>${tag}</li>`;
        }
        tagUl += "</ul>"
        postsHtml += 
        `<div class="post-data">
            <div class="post-tags"><p>タグ:</p>${tagUl}</div>
            <p><time datetime="${post.date}">${dateWithSlash}</time></p>
        </div>`;

        postsHtml += "</div>";
        postsHtml += "</a>";
    });

    postsField.innerHTML = postsHtml;
};

fetchPosts();

/*
イベントリスナー用関数定義
*/
function clicked(event){
    currentPage = Number.parseInt(event.currentTarget.textContent);
    displayIndex(currentPage, allPosts);
    displayPage(currentPage, allPosts);
}

/*
現在のページを示す変数はグローバルな場所に用意しておく。
ページ毎のポスト数を示す関数も用意しておく。
ポスト配列を収納する変数も用意。

それぞれフィールドをHTMLから取得。

まず、フェッチしてきて、それをJSON形式に変換し、data変数に収納。
そこから、ポストの数を取得し、必要なページ数を計算。
displayIndex関数で、計算したページ数分のインデックスを表示。
それぞれのインデックスにイベントリスナーを付ける。(for...of構文を用いる)
その後、現在のcurrentPageから、ポストを表示。
	具体的には、currentPageから、postをスライスして、その後それぞれのポストについてforEachをして、HTMLタグを出力。
*/
const searchForm = document.querySelector(".searchForm");
const searchButton = document.querySelector(".searchButton");

const dateForm = document.querySelectorAll(".dateForm");

const tags = document.querySelectorAll(".tagField li");
const currentTags = {
    "一般記事":false,
    "音楽":false
};
for (let tag of tags){
    tag.addEventListener("click",function(){
        currentTags[this.textContent] = !currentTags[this.textContent];
        tag.classList.toggle("selectedTag");
    
    /*
        if (Object.values(currentTags).includes(true)){
            currentPosts = allPosts.filter((post)=>{ 
                let isSelectedTagIncluded = false;
                for(let postTag of post.tags){
                    if (currentTags[postTag]){
                        isSelectedTagIncluded = true;
                        break;
                    }
                }
                return isSelectedTagIncluded;
            });
        }
        else{
            currentPosts = allPosts;
        }
    */

    searchPosts();
    }); 
}

searchButton.addEventListener("click",()=>{
    const searchKeyword = searchForm.value;
    
    let filteredPosts = currentPosts.filter((post)=>{
        return post.title.includes(searchKeyword);
    })
    .filter((post)=>{
        const postDate = new Date(post.date);
        const startDate = new Date(dateForm[0].value); 
        const endDate = new Date(dateForm[1].value);

        return ((startDate <= postDate) || isNaN(startDate))  && ((endDate >= postDate) || isNaN(endDate));
    })

    if (Object.values(currentTags).includes(true)){

    }
    

    displayIndex(currentPage, filteredPosts);
    displayPage(currentPage, filteredPosts);
});

/* タグボタンと検索ボタンを押すたびに、サーチするので、関数が必要。 */

const searchPosts = ()=>{
    const searchKeyword = searchForm.value;
    
    let filteredPosts = allPosts.filter((post)=>{
        return post.title.includes(searchKeyword);
    })
    .filter((post)=>{
        const postDate = new Date(post.date);
        const startDate = new Date(dateForm[0].value); 
        const endDate = new Date(dateForm[1].value);

        return ((startDate <= postDate) || isNaN(startDate))  && ((endDate >= postDate) || isNaN(endDate));
    })

    if (Object.values(currentTags).includes(true)){
        filteredPosts = filteredPosts.filter(post => {
            let isSelectedTagIncluded = false;
            for(let postTag of post.tags){
                if (currentTags[postTag]){
                    isSelectedTagIncluded = true;
                    break;
                }
            }
            return isSelectedTagIncluded;
        });
    }

    currentPage = 1;

    displayIndex(currentPage, filteredPosts);
    displayPage(currentPage, filteredPosts);
}