import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {DenunciasService} from '../services/denuncias.service';
import { DenunciaI } from '../models/denuncia.interface';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  private denuncias: Observable<DenunciaI[]>;
  private filtro:string = 'todos';

  constructor(private authSvc:AuthService, 
    private denunciaSvc:DenunciasService,
    private alertController:AlertController) {
    this.denuncias = denunciaSvc.getDenuncias();
   }

   cerrarSesion(){
     this.authSvc.logout();
   }

   async deleteDenuncia(id:string){
     try{
      await this.denunciaSvc.deleteDenuncia(id);
     } catch(error){
       console.log(error)
       const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al intentar eliminar la denuncia.',
        buttons: ['Aceptar']
      });
  
      await alert.present();
     }
   }

   aplicarFiltro(){
     this.denunciaSvc.filtro = this.filtro;
     this.denunciaSvc.setDenuncias();
     this.denuncias = this.denunciaSvc.getDenuncias();
   }

  ngOnInit() {

  }

}
