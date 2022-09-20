import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public splash: any = true;

  constructor(
    private platform: Platform
  ) {
    this.initializeApp();
  }

  initializeApp(){      
    setTimeout(() => {
      SplashScreen.hide({
        fadeOutDuration:500 
      }).then(() =>{
        this.platform.ready().then(() => {
          if(this.splash){
            setTimeout(() =>{        
              this.splash = false;                
            },6000);
          }    
        });
      });
    }, 750);
  }
}
