import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {User} from '../shared/user.class';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLogged: any = false;
  public logeado: any;
  
  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => (this.isLogged = user));
  }

  //Login
  async onLogin(user:User){
    try {
      return await this.afAuth.signInWithEmailAndPassword(user.email, user.password);      
    } catch (error) {
      console.log('Error. Al Iniciar el Usuario',error);
    }
  }

  //Register
  async onRegister(user:User){
    try {
      return await this.afAuth.createUserWithEmailAndPassword(user.email, user.password);
    } catch (error) {
      console.log('Error. Al Registrar el Usuario',error);
    }
  }
}
