

function myFunction(){
    alert("Hello!");
}

function changeImage() { 
    let pokeballImg = document.getElementById("img01"); 
    pokeballImg.src = "pic/pikachu.png"; 
}

// let link = document.getElementById("tw-link");
// link.innerHTML = "twitter";

// window.onload = twitterLink;
// function twitterLink(){
//     let link = document.getElementById("tw-link");
//     link.innerHTML = "twitter";
// }

window.onload = pageLoad;
function pageLoad() {
    document.getElementById("alert-button").addEventListener("click", myFunction);
    document.getElementById("image-button").addEventListener("click", changeImage);
    let clickButton = document.getElementById("clickme");
    clickButton.onclick = myFunction;
}

