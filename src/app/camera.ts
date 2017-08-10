import * as Tesseract from "tesseract.js";

export class Camera {
    private video: HTMLVideoElement;
    init(video: HTMLVideoElement) {
        this.video = video;

        navigator.getUserMedia =
            (navigator as any).getUserMedia ||
            (navigator as any).webkitGetUserMedia ||
            (navigator as any).mozGetUserMedia ||
            (navigator as any).msGetUserMedia ||
            (navigator as any).oGetUserMedia;

        //// BACK CAMERA?
        // navigator.mediaDevices.enumerateDevices().then((devices: any) => {
        //     devices.forEach(function (device: any) {
        //         alert(device.kind + ": " + device.label +
        //             " id = " + device.deviceId);
        //     });
        // });

        if (navigator.getUserMedia) {
            navigator.getUserMedia({ video: true }, handleVideo, videoError);
        }
        var self = this;
        function handleVideo(stream: MediaStream) {
            self.video.src = window.URL.createObjectURL(stream);
        }

        function videoError(e: MediaStreamError) {

        }
    }

    capture(callback: (result: string) => void): void {
        Tesseract.recognize(this.video)
            .progress(message => {
                console.log(message.status);
            })
            .catch(err => {
                console.log(err.message);
            })
            .then((result) => {
                console.log("Result:" + result.text);
                var boggletext = '';

                result.words.forEach(c => {
                    boggletext += c.text;
                });

                callback(boggletext);
            })
            .finally(resultOrError => console.log(resultOrError));
    }
}