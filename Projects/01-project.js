let x=document.querySelector('#emoji-container');
let y=document.querySelector('#btn');

const e=['😀','😂','😍','🤔','😎','😭','😡','👍','🙏','🎉','💔','🔥'];

y.addEventListener('click',()=>{
    let x.value=Math.floor(Math.random()*e.length);
})