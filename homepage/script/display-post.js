"use strict";
const isDeepLayer = window.location.pathname.includes("/articles/");
const prefix = isDeepLayer ? "../" : "./"; 

let currentPage = 0;
if (localStorage.getItem("currentPageLS")){
    currentPage = localStorage.getItem("currentPageLS");
}
else{
    currentPage = 1;
    localStorage.setItem("currentPageLS",currentPage);
}

const postsPerPage = 10;
let allPosts = [];

const indexField = document.getElementsByClassName("indexField");
const postsField = document.getElementById("postsField");

const fetchPosts = async () => {
    const response = await fetch("./source/posts.json");
    allPosts = await response.json();
    
    allPosts.reverse();
    
    displayIndex(allPosts);
    displayPage(currentPage,allPosts);
}

const displayIndex = (postArray)=>{
    const numOfPosts = postArray.length;
    const numOfPages = Math.ceil(numOfPosts / postsPerPage)

    let indexHtml = "<ul>";
    for (let i=1; i<=numOfPages; i++){
        indexHtml += `<li class="indexButton">${i}</li>`;
    }
    indexHtml += "</ul>";

    let indexHtmlLower = "<ul>";
    for (let i=1; i<=numOfPages; i++){
        indexHtmlLower += `<li class="indexButtonLower">${i}</li>`;
    }
    indexHtmlLower += "</ul>";

    indexField[0].innerHTML = indexHtml;
    indexField[1].innerHTML = indexHtmlLower;
    
    const allButtons = document.querySelectorAll(".indexButton, .indexButtonLower");
    const indexButtons = document.querySelectorAll(".indexButton");
    const indexButtonsLower = document.querySelectorAll(".indexButtonLower");
    
    allButtons.forEach(button => button.classList.remove("is-active"));
    
    /*
    indexButtons[currentPage-1].style.backgroundColor = "#d1d1d1";
    indexButtonsLower[currentPage-1].style.backgroundColor = "#d1d1d1";
    indexButtons[currentPage-1].style.color = "#000000";
    indexButtonsLower[currentPage-1].style.color = "#000000";
    */
    
    indexButtons[currentPage-1].classList.add("is-active");
    indexButtonsLower[currentPage-1].classList.add("is-active");


    for (let indexButton of indexButtons){
    indexButton.addEventListener("click", function(){
        currentPage = Number(this.textContent);
        displayPage(currentPage,postArray);
        indexButtons.forEach(button => {
            button.classList.remove("is-active");
        })
        indexButtonsLower.forEach(button => {
            button.classList.remove("is-active");
        })
        indexButtons[currentPage-1].classList.add("is-active");
        indexButtonsLower[currentPage-1].classList.add("is-active");
    })
    };

    for (let indexButton of indexButtonsLower){
    indexButton.addEventListener("click", function(){
        currentPage = Number(this.textContent);
        displayPage(currentPage,postArray);
        indexButtons.forEach(button => {
            button.classList.remove("is-active");
        })
        indexButtonsLower.forEach(button => {
            button.classList.remove("is-active");
        })
        indexButtons[currentPage-1].classList.add("is-active");
        indexButtonsLower[currentPage-1].classList.add("is-active");
    })
    };
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
        postsHtml += `<p><time datetime="${post.date}">${dateWithSlash}</time></p>`;
        postsHtml += "</div>";
        postsHtml += "</a>";
    });

    postsField.innerHTML = postsHtml;
};

fetchPosts();

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
        console.log(currentTags);
    });
}

searchButton.addEventListener("click",()=>{
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
        filteredPosts = filteredPosts.filter((post)=>{ 
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
    

    displayIndex(filteredPosts);
    displayPage(currentPage, filteredPosts);
});