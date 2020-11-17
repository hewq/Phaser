declare global {
    interface Window { 
        viewW: number,
        rem: number 
    }
}

export default (() => {
    const docEl = document.documentElement;

    function setFontSize() {
        window.viewW = docEl.clientWidth || (document.body ? document.body.clientWidth : 0);
        window.rem = window.viewW / 750;
        docEl.style.fontSize = window.rem + 'px';
    }

    document.addEventListener('DOMContentLoaded', setFontSize);
    window.addEventListener('load', setFontSize);
    window.addEventListener('resize', setFontSize);
})();