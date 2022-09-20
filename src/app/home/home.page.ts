import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';

import { ActivatedRoute } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { FirestoreService} from '../services/firestore.service';
import { ScannerService } from '../services/scanner.service';

import {ToastController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private email: any;
  public load: boolean = true;

  public qr10: string = "8c95def646b6127282ed50454b73240300dccabc";
  public qr50: string = "ae338e4e0cbb4e4bcffaf9ce5b409feb8edd5172";
  public qr100: string = "2786f4877b9091dcad7f35751bfcf5d5ea712b2f";

  public creditoView: number = 0;
  public listaUserQR: any = [];
  public borrarCreditos: boolean = false;

  //Datos Usuario FireBase
  public datosUsuario: any;

  public qrscaneadoresultado:any;

  
  constructor(
    private authSvc:AuthService, 
    private router: Router, 
    private afAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
    public loadingController: LoadingController,
    public alertController: AlertController,
    private fireStore: FirestoreService,
    public scanner: ScannerService,
    public toastController: ToastController
  ) 
  {
    this.fireStore.traerQrList().subscribe(value =>{
      for (let index = 0; index < value.length; index++) {
        if(value[index].email == this.authSvc.logeado.email){
          this.creditoView = value[index].credito;      
          this.datosUsuario = value[index];
        }
      }    
    });
  }
  
  async ErrorToastQR() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Qr invalido!!!',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async BorrarCredito() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Se borraron los creditos',
      duration: 1100,
      color: 'success'
    });
    toast.present();
  }

  async ErrorToastCargaCreditos() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Error. Llego al limite de carga del QR!!!',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async SuccessToastQR() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Credito Sumado!!!',
      duration: 1100,
      color: 'success'
    });
    toast.present();
  }


  ngOnInit(){
    this.email = this.authSvc.logeado.email;
  }
  
  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmacion',
      message: '<strong>Esta seguro de borrar sus Creditos?</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
      }, 
      {
          text: 'Confirmar',
          handler: () => {
              //Borro Datos
              this.creditoView = 0;
              this.datosUsuario.credito = 0;
              this.datosUsuario.qr10 = 0;
              this.datosUsuario.qr50 = 0;
              this.datosUsuario.qr100 = 0;
              this.BorrarCredito();
        
              //Updateo Al Firebase
              this.actualizarDatosFireStore();
          }
      }
      ]
    });

    

    await alert.present();
  }


  
  onLogout(){        
    this.load = false;

    setTimeout(() => {
      this.load = true;

      localStorage.removeItem('email');
      this.afAuth.signOut();
      this.router.navigateByUrl('/login');  
    }, 500);
  }


  onEscanear(){
    this.scanner.startScanner().then((codigoQR)=>{
        this.scanner.stopScan();
        //this.qrscaneadoresultado = codigoQR;        
        this.verificarDatos(codigoQR);  
    });

    //this.verificarDatos(this.qr10);
    //this.verificarDatos(this.qr50);
    //this.verificarDatos(this.qr100);
  }

  verificarDatos(codigoQR: any){
    let pudo: boolean = false;  

    //verificacion de datos para un ADMIN
    if(this.datosUsuario.usuario == "admin"){      
      if(this.qr10 == codigoQR){
        if(this.datosUsuario.qr10 < 2){
          this.creditoView += 10;                
          this.datosUsuario.qr10++;//Agregar a DatosUsuario el valor a qr10 += 1        
          pudo = true;
        }        
      }else if(this.qr50 == codigoQR){
        if(this.datosUsuario.qr50 < 2){
          this.creditoView += 50;        
          this.datosUsuario.qr50++;//Agregar a DatosUsuario el valor a qr50 += 1
          pudo = true;
        }        
      }else if(this.qr100 == codigoQR){
        if(this.datosUsuario.qr100 < 2){
          this.creditoView +=100;
          this.datosUsuario.qr100++;//Agregar a DatosUsuario el valor a qr100 += 1
          pudo = true;
        }        
      }else{
        this.ErrorToastQR();
      }
    
      if(pudo){
        pudo = false;
        this.SuccessToastQR();        
      }else{
        this.ErrorToastCargaCreditos();
      }
      
    }
    
    
    if(this.datosUsuario.usuario != "admin"){

      if(this.qr10 == codigoQR){
        if(this.datosUsuario.qr10 < 1){
          this.creditoView += 10;        
          this.datosUsuario.qr10++;//Agregar a DatosUsuario el valor a qr10 += 1        
          pudo = true;
        }        
      }else if(this.qr50 == codigoQR){
        if(this.datosUsuario.qr50 < 1){
          this.creditoView += 50;        
          this.datosUsuario.qr50++;//Agregar a DatosUsuario el valor a qr50 += 1
          pudo = true;
        }        
      }else if(this.qr100 == codigoQR){
        if(this.datosUsuario.qr100 < 1){
          this.creditoView +=100;
          this.datosUsuario.qr100++;//Agregar a DatosUsuario el valor a qr100 += 1
          pudo = true;
        }        
      }else{
        this.ErrorToastQR();
      }
    
      if(pudo){
        pudo = false;
        this.SuccessToastQR();        
      }else{
        this.ErrorToastCargaCreditos();
      }

    }

    this.actualizarDatosFireStore();
    
    //Updatear a Firebase
  }


  actualizarDatosFireStore(){
    this.datosUsuario.credito = this.creditoView;
    this.fireStore.modificarQr(this.datosUsuario,this.datosUsuario.id);
  }

  onBorrarCredito(){  
    this.presentAlertConfirm();   
  }
}
