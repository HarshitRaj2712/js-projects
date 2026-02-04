let x=document.querySelector('#emoji-container');
let y=document.querySelector('#btn');

const e=['😀','😂','😍','🤔','😎','😭','😡','👍','🙏','🎉','💔','🔥','😶‍🌫️','💀','🦴','🤡'];

y.addEventListener('click',()=>{
     x.textContent=set();
})

let set=()=>{
    return e[Math.floor(Math.random()*e.length)];
}
