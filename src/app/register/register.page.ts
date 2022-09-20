import { Component, OnInit } from '@angular/core';

import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user.class';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: User = new User();

  constructor(private authSvc:AuthService, private router: Router) { }

  ngOnInit() {
  }

  async onRegister(){

    if(this.user.email == undefined && this.user.password == undefined){
      alert('Ingrese el E-mail y la Password!!!');
    }else{
      const user = await this.authSvc.onRegister(this.user);
      if(user){
        console.log('Registracion con Exito!!!');
        this.router.navigateByUrl('/');
      }
    }
  }

}
