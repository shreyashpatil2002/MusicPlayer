'use strict';
let pauseBtn = '<i class="fa fa-pause" aria-hidden="true"></i>';
let playBtn = '<i class="fa fa-play" aria-hidden="true"></i>';
let flag = 1;
function playMusic(index) {
    let ind = document.getElementsByClassName('btn');
    let aud = document.getElementsByTagName('audio');
    let list = document.getElementsByTagName('li');
    if (flag != index) {
        for (let i = 0; i < 3; i++) {
            aud[i].pause();
            ind[i].firstElementChild.innerHTML = playBtn;
            list[i].style.background = 'transparent';
        }
    }

    if (aud[index].paused) {
        aud[index].play();
        ind[index].firstElementChild.innerHTML = pauseBtn;
        list[index].style.background = '#313233fa';
    }
    else {
        aud[index].pause();
        ind[index].firstElementChild.innerHTML = playBtn;
        list[index].style.background = 'transparent';
        flag = 0;
    }
    flag = index;
}