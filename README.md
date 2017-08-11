# Boggle Solver
Typescript word finder for puzzles like boggle or wordament. 
Original project: [SDS's boggle solver](https://github.com/sds/boggle-solver)
Demo: [Click](https://zskovacs.github.io/bogglesolver)

## Installing
0. Fork the repository (optional)
1. Clone the repository
3. `npm install`
4. Configure in `package.json`
    1. Host should be your IP
    2. HTTPS is only need if you want to use OCR
5. `npm run start`
6. Enjoy

If you don't want to use webpack dev server, you can build with `npm run build` or `npm run buildProd` and deploy to your own webserver.

## Dictionary
If you want to change dictionary, just copy the new one to __data__ folder.
It has to be an __UTF-8__ encoded file with words separeted by __newline__ (\n) character.

If you have the dictionary, you have to load it at src\index.ts

```javascript
$.get('data/words-hu.txt').then(...);
```

## BUGS
### Optical character recognition ### 
Main idea was that you could have used your phone's camera to take a picture of the puzzle and it should have automatically fill the board.
I use [tesseract.js](https://github.com/naptha/tesseract.js) with HTML5, but it is commented out, because it not working properly:

src\index.ts 
```javascript
// camera.init(<HTMLVideoElement>document.querySelector("#videoElement"));
// $("#videoElement").click(() => {
//     camera.capture((txt) => {
//         boggleText.val(txt);
//     })
// });
```

src\index.html
```html
    <!-- <video autoplay="true" id="videoElement" width="250" height="250"></video>
    <canvas id="#previewcanvas" width="250" height="250"></canvas>
    <div id="ocr_status"> </div>
    <div id="ocr_result"> </div> -->
```
