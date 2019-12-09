import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import {AuthService} from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage:Storage,
    private authSvc:AuthService,
    private router:Router,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.get('isLogged').then((isLogged) => {
        this.authSvc.isLogged = isLogged!==null ? isLogged : false;
        if(this.authSvc.isLogged){
          this.router.navigateByUrl('/admin');
        }
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
