import { Trie } from "./trie";
import { Board } from "./board";
import { Boggle } from "./boggle";
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

numRows.val(4);
numCols.val(4);
boggleText.val("boggleisafungame");

$('#num-rows, #num-cols').click(boardSizeChanged).change(boardSizeChanged);

$("#boggleimage").change(() => {
    var image = $("#boggleimage");

    Tesseract.recognize((image[0] as HTMLInputElement).files[0])
        .progress(message =>
            console.log(message))
        .catch(err => console.error(err))
        .then((result) => {
            var boggletext = '';

            result.words.forEach(c => {
                boggletext += c.text;
            });

            boggleText.val(boggletext);
            boggleText.change();

            loadTextToBoard(true);
        })
        .finally(resultOrError => console.log(resultOrError));
});

wordPanel.hide();

function boardSizeChanged(): void {
    boardDiv.empty();
    board = boggle.createBoard(numRows.val(), numCols.val(), boardDiv);
};

boggleText.change((ev: any) => {
    loadTextToBoard(true);
});


$(document).ready(() => {
    loadTextToBoard(false);
});

//Load words
$.get('data/words-hu.txt').then((data) => {
    var words: string[] = data.split('\n');

    for (var i = words.length - 1; i >= 0; i--) {
        if (words[i].length > 2)
            dict.insert(words[i]);
    }

    $('#loading-message').hide();
    boardSizeChanged();

}, () => {
    $('#loading-message').text("There was a problem loading the dictionary");
});

function loadTextToBoard(solve: boolean): void {
    var rows = numRows.val(),
        cols = numCols.val(),
        count = 0;

    var str = $('#boggletext').val();
    if (str && str.length == (rows * cols)) {
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                $('#cell' + count).val(str[count]);
                $('#cell' + count).change();
                count++;
            }
        }

        if (solve)
            $('#solve-button').click();
    }
}

$('#solve-button').click(() => {
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
});

// Hitting Enter solves puzzle
$(document).keyup(function (evt) {
    if (evt.keyCode == 13) {
        $('#solve-button').click();
    }
});