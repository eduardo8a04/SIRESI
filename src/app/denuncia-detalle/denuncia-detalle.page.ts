import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {DenunciaI} from '../models/denuncia.interface';
import {DenunciasService} from '../services/denuncias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import * as firebase from 'firebase/app';
declare var google;

@Component({
  selector: 'app-denuncia-detalle',
  templateUrl: './denuncia-detalle.page.html',
  styleUrls: ['./denuncia-detalle.page.scss'],
})
export class DenunciaDetallePage implements OnInit {

  @ViewChild('map',{static: true}) mapElement: ElementRef;
  map: any;

  denuncia:DenunciaI = {
    titulo: '',
    ubicacion:'',
    urlArchivo:'',
    descripcion:'',
    tipo:'',
    estatus:'',
    comentarios:'',
    urlArchivoAnexado:'',
  }

  constructor(private denunciaSvc:DenunciasService,
    private activatedRoute: ActivatedRoute, 
    private alertController:AlertController,
    private router:Router,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder) {

   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.denunciaSvc.getDenuncia(id).subscribe(denuncia => {
        this.denuncia = denuncia;
        this.denuncia.id = id;
        this.denuncia = denuncia;
        
        let latLng = new google.maps.LatLng(this.denuncia.localizacion.latitude, this.denuncia.localizacion.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        this.addMarker();
      });
    }
  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Ubicación</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content){

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  async updateDenuncia(){
    try{
      console.log("Denuncia por parametro ", this.denuncia)
      await this.denunciaSvc.updateDenuncia(this.denuncia);
      const alert = await this.alertController.create({
        header: 'Bien hecho!',
        message: 'El reporte ha sido actualizado satisfactoriamente',
        buttons: ['Aceptar']
      });

      await alert.present().then(() => {
        this.router.navigateByUrl('/admin');
      })
    } catch(error){
      console.log(error);
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error inesperado al actualizar la denuncia',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

}
