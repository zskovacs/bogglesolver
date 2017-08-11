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

        if (navigator.getUserMedia) {
            // BACK CAMERA?
            navigator.mediaDevices.enumerateDevices().then((devices: any) => {
                var init = false;

                devices.forEach((device: any) => {
                    if (device.kind.indexOf("video") !== -1 && device.label.indexOf("back") !== -1) {
                        navigator.getUserMedia({ video: { deviceId: device.deviceId } }, handleVideo, videoError);
                        var init = true;
                    }
                });

                if (init === false)
                    navigator.getUserMedia({ video: true }, handleVideo, videoError);
            });
            //navigator.getUserMedia({ video: true }, handleVideo, videoError);
        }
        var self = this;
        function handleVideo(stream: MediaStream) {
            self.video.src = window.URL.createObjectURL(stream);
        }

        function videoError(e: MediaStreamError) {

        }
    }

    capture(callback: (result: string) => void): void {
        var canvas = <HTMLCanvasElement>document.getElementById('#previewcanvas');
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, 250, 250);
        
        Tesseract.recognize(canvas)
            .progress(result => {
                $("#ocr_status").text(result["status"] + " (" + (result["progress"] * 100) + "%)");
            })
            .catch(err => {
                this.debug(err.message);
            })
            .then((result) => {
                var boggletext = '';

                result.words.forEach(c => {
                    boggletext += c.text;
                });

                callback(boggletext);
            })
            .finally(resultOrError => console.log(resultOrError));
    }
    debug(str: string): void {
        $("ul#debug").append("<li>" + str + "</li>");
    }
}