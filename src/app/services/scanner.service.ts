import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor() { }

  public async startScanner(){
    BarcodeScanner.hideBackground();
    document.body.classList.add("qrscanner");
    const result = await BarcodeScanner.startScan();
    document.body.classList.remove("qrscanner");

    // if the result has content
    if (result.hasContent) {
      //console.log(result.content); // log the raw scanned content
      return result.content;
    }    
  }

  public stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
  };

}
