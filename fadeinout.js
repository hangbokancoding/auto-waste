// https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=1126pc&logNo=221595349259 를 변형함

const speed = 30;
const a = 0.05;

function fadeIn(target) {
    let level = 0;
    let inTimer;
    target.classList.remove("display-none");
    inTimer = setInterval(() => level = fadeInAction(target, level, inTimer), speed);
}

function fadeInAction(target, level, inTimer) {
    level += a;
    target.style.opacity = level;
    if (level >= 1) clearInterval(inTimer);
    return level;
}

function fadeOut(target) {
    let level = 1;
    let outTimer;
    outTimer = setInterval(() => level = fadeOutAction(target, level, outTimer), speed);
}

function fadeOutAction(target, level, outTimer) {
    level -= a;
    target.style.opacity = level;
    if (level <= 0) {
        target.classList.add('display-none');
        clearInterval(outTimer);
    }
    return level;
}
