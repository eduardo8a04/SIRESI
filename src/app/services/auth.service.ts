import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../shared/user.class';
import { Storage } from '@ionic/storage';
import {Router} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Con esta variable podemos saber si el admin esta logeado
  public isLogged: any = false;

  constructor(public afAuth:AngularFireAuth, private storage:Storage,private router:Router) {
    afAuth.authState.subscribe(user => (this.isLogged = user));
   }

   //Login
   async login(user:User){
     try{
       return await this.afAuth.auth.signInWithEmailAndPassword(user.email,user.password);
     } catch(error){
       console.log(error)
     }
   }

   async logout(){
    this.afAuth.auth.signOut()
    this.isLogged = false;
    await this.storage.set('isLogged',false);
    this.router.navigateByUrl('/home');
   }

   /* 
   this.afAuth.auth.signOut();
   */

}
