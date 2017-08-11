import { Trie } from "./trie";
import { Board } from "./board";
import { Boggle } from "./boggle";
import { Camera } from "./camera";
import * as Tesseract from "tesseract.js";

import 'jquery/dist/jquery';
import '../style/index.css';

var boardPanel = $('#boggle-panel');
var boggleText = $('#boggletext');
var boardDiv = $('#board');
var numRows = $('#num-rows');
var numCols = $('#num-cols');
var wordPanel = $('#words-panel');
var wordList = $('#word-list');

var board: Board;
var dict = new Trie();
var boggle = new Boggle();
var camera = new Camera();

camera.init(<HTMLVideoElement>document.querySelector("#videoElement"));
$("#videoElement").click(() => {
    camera.capture((txt) => {
        boggleText.val(txt);
    })
});

// EVENTS
$('#num-rows, #num-cols').click(boardSizeChanged).change(boardSizeChanged);
$('#solve-button').click(solveBoggle);

function boardSizeChanged(): void {
    boardDiv.empty();
    board = boggle.createBoard(numRows.val(), numCols.val(), boardDiv);
    loadTextToBoard(false);
};

wordPanel.hide();

//Load words
$.get('data/words-hu.txt').then((data) => {
    var words: string[] = data.split('\n');

    for (var i = words.length - 1; i >= 0; i--) {
        if (words[i].length > 2)
            dict.insert(words[i]);
    }

    $('#loading-message').hide();

    //Init datas
    numRows.val(4);
    numCols.val(4);

    boggleText.val("boggleisafungame");

    boardSizeChanged();

}, () => {
    $('#loading-message').text("There was a problem loading the dictionary");
});

function loadTextToBoard(solve: boolean): void {
    var rows = numRows.val(),
        cols = numCols.val(),
        count = 0;

    var str = boggleText.val();
    if (str && str.length == (rows * cols)) {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                $('#cell' + count).val(str[count]);
                $('#cell' + count).change();
                count++;
            }
        }

        if (solve) {
            solveBoggle();
        } else {
            wordPanel.hide();
        }
    }
}

function solveBoggle(): void {
    wordList.empty();
    $("#solving-message").show();
    wordPanel.show();

    // Find and sort words by longest first
    var words = boggle.solve(board, dict).sort(function (a, b) {
        if (a.length == b.length) {
            return (a < b) ? 1 : -1;
        }
        return b.length - a.length;
    });

    // Remove duplicates
    words = words.filter(function (item, idx, arr) {
        return idx == arr.indexOf(item);
    });

    $("#solving-message").hide();

    $('#num-words').text(words.length + " words");
    for (var i = 0; i < words.length; i++) {
        wordList.append('<li>' + words[i] + '</li>');
    }
}


// Hitting Enter solves puzzle
$(document).keyup(function (evt) {
    if (evt.keyCode == 13) {
        loadTextToBoard(true);
    }
});