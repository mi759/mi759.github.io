/* ラジオボタンで原文のみ表示を選んだとき */
function srcOnly(){
    /* sourceクラスのセル全てを表示する */
    var srcElements = document.getElementsByClassName('source')
    for(i=0; i<srcElements.length; i++){
        srcElements[i].style.display = "table-cell";
    }
    /* targetクラスのセル全てを非表示にする */
    var tgtElements = document.getElementsByClassName('target')
    for(i=0; i<tgtElements.length; i++){
        tgtElements[i].style.display = "none";
    }
}

/* ラジオボタンで両言語表示を選んだとき */
function srcAndTgt(){
    /* sourceクラスのセル全てを表示する */
    var srcElements = document.getElementsByClassName('source')
    for(i=0; i<srcElements.length; i++){
        srcElements[i].style.display = "table-cell";
    }
    /* targetクラスのセル全てを表示する */
    var tgtElements = document.getElementsByClassName('target')
    for(i=0; i<tgtElements.length; i++){
        tgtElements[i].style.display = "table-cell";
    }
}

/* ラジオボタンで訳文のみ表示を選んだとき */
function tgtOnly(){
    /* sourceクラスのセル全てを非表示にする */
    var srcElements = document.getElementsByClassName('source')
    for(i=0; i<srcElements.length; i++){
        srcElements[i].style.display = "none";
    }
    /* targetクラスのセル全てを表示する */
    var tgtElements = document.getElementsByClassName('target')
    for(i=0; i<tgtElements.length; i++){
        tgtElements[i].style.display = "table-cell";
    }
}