import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit{

  public qrCollectionReference: any;
  public qrLista: Observable<any>;
  
  public qrListaArray: any = [];

  constructor(public FireStore: AngularFirestore, public AngularFS : AngularFireStorage) 
  {
    this.qrCollectionReference = this.FireStore.collection<any>('qr');
    this.qrLista = this.qrCollectionReference.valueChanges({idField: 'id'});
  }

  ngOnInit(){     
    this.traerQrList().subscribe(value=>{  
      this.qrListaArray = value;
    });
  }

  modificarQr(objeto: any, id_objeto: any){
    return this.FireStore.collection('qr').doc(id_objeto).update(objeto);
  }


  traerQrList(){
    return this.qrLista;
  }
}
