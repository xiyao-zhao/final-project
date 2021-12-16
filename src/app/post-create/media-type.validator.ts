import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

export const mediaType = (
    control: AbstractControl
): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {
    if (typeof(control.value) === 'string') {
        return of(null);
    }
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = new Observable((observer: Observer<{[key: string]: any}>) => {
        // same as fileReader.onloadend = () => {}
        fileReader.addEventListener("loadend", () => {
            // create a new array of 8 bit unsigned integers
            const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
            let header = "";
            let isValid = false;
            for (let i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }
            switch (header) {
                case "89504e47":
                  isValid = true;
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                  isValid = true;
                  break;
                default:
                  isValid = false;
                  break;
            }
            if (isValid) {
                observer.next(null);
            } else {
                observer.next({ invalidMediaType: true });
            }
            observer.complete();
        }); 
        fileReader.readAsArrayBuffer(file);
    });
    return frObs;
}