import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {User} from '../shared/user.class';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user:User = new User();

  constructor(private router:Router, private authSvc:AuthService, private alertController:AlertController
    ,private storage:Storage) {
    
   }

  ngOnInit() {
  }

  async login(){
    const user = await this.authSvc.login(this.user);
    if(user){
      await this.storage.set('isLogged',true)
      this.authSvc.isLogged = true;
      this.router.navigateByUrl('/admin');
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Los datos no coinciden.',
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
  }

}
