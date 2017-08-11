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
        Tesseract.recognize(this.video)
            .progress(message => {
                this.debug(message.status);
            })
            .catch(err => {
                this.debug(err.message);
            })
            .then((result) => {
                this.debug("Result:" + result.text);
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