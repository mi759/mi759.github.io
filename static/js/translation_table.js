/* ラジオボタンで原文のみ表示を選んだとき */
function srcOnly() {
    /* localStorageに選択状況を保持 */
    localStorage.setItem("translation-table-radio", "src-only");
    /* sourceクラスのセル全てを表示する */
    let srcElements = document.getElementsByClassName('source')
    for (i = 0; i < srcElements.length; i++) {
        srcElements[i].style.display = "table-cell";
    }
    /* targetクラスのセル全てを非表示にする */
    let tgtElements = document.getElementsByClassName('target')
    for (i = 0; i < tgtElements.length; i++) {
        tgtElements[i].style.display = "none";
    }
}

/* ラジオボタンで両言語表示を選んだとき */
function srcAndTgt() {
    /* localStorageに選択状況を保持 */
    localStorage.setItem("translation-table-radio", "src-tgt");
    /* sourceクラスのセル全てを表示する */
    let srcElements = document.getElementsByClassName('source')
    for (i = 0; i < srcElements.length; i++) {
        srcElements[i].style.display = "table-cell";
    }
    /* targetクラスのセル全てを表示する */
    let tgtElements = document.getElementsByClassName('target')
    for (i = 0; i < tgtElements.length; i++) {
        tgtElements[i].style.display = "table-cell";
    }
}

/* ラジオボタンで訳文のみ表示を選んだとき */
function tgtOnly() {
    /* localStorageに選択状況を保持 */
    localStorage.setItem("translation-table-radio", "tgt-only");
    /* sourceクラスのセル全てを非表示にする */
    let srcElements = document.getElementsByClassName('source')
    for (i = 0; i < srcElements.length; i++) {
        srcElements[i].style.display = "none";
    }
    /* targetクラスのセル全てを表示する */
    let tgtElements = document.getElementsByClassName('target')
    for (i = 0; i < tgtElements.length; i++) {
        tgtElements[i].style.display = "table-cell";
    }
}

window.onload = (event) => {
    let srcOnlyRadio = document.getElementById('src-only');
    let srcTgtRadio = document.getElementById('src-tgt');
    let tgtOnlyRadio = document.getElementById('tgt-only');
    if (srcOnlyRadio === null || srcTgtRadio === null || tgtOnlyRadio === null) {
        return;
    }

    let lastSelected = localStorage.getItem("translation-table-radio");
    switch (lastSelected) {
        case 'src-only':
            srcOnlyRadio.checked = true;
            break;
        case 'src-tgt':
            srcTgtRadio.checked = true;
            break;
        case 'tgt-only':
            tgtOnlyRadio.checked = true;
            break;
    } 

    if (srcOnlyRadio.checked) {
        srcOnly();
    } else if (srcTgtRadio.checked) {
        srcAndTgt();
    } else if (tgtOnlyRadio.checked) {
        tgtOnly();
    }
};
