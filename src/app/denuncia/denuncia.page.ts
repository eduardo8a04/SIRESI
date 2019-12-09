import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import {DenunciaI} from '../models/denuncia.interface';
import {DenunciasService} from '../services/denuncias.service';
import { AlertController, Platform,ActionSheetController } from '@ionic/angular';
import {Router} from '@angular/router';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import * as firebase from 'firebase/app';
declare var google;

@Component({
  selector: 'app-denuncia',
  templateUrl: './denuncia.page.html',
  styleUrls: ['./denuncia.page.scss'],
})
export class DenunciaPage implements OnInit {

  @ViewChild('map',{static: true}) mapElement: ElementRef;
  map: any;

  archivoSeleccionado:any = null;
  cargando:boolean = false;
  urlImagen:string = "";
  lat:any;
  lng:any;

  denuncia:DenunciaI = {
    titulo: '',
    ubicacion:'',
    urlArchivo:'',
    descripcion:'',
    tipo:'Alumbrado',
    estatus:'Pendiente',
    comentarios:'',
    urlArchivoAnexado:'',
  }
  
  constructor(private denunciaService:DenunciasService,
    private alertController: AlertController,
    private router: Router,
    private camera: Camera, private file: File,
    private filePath: FilePath ,
    private platform: Platform, private actionSheetController:ActionSheetController,
    private webview:WebView,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder
    ) { 

  }

  ngOnInit() {
    console.log("Ng on init")
      let latLng = new google.maps.LatLng(18.403299993821527, -88.37791275300238);
      let mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())


  }

  loadMap() {
    this.geolocation.getCurrentPosition().then((resp) => {

      let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      
 
      this.getAddressFromCoords(resp.coords.latitude, resp.coords.longitude);
 
      
 
      /*this.map.addListener('tilesloaded', () => {
        console.log('accuracy',this.map);
        this.getAddressFromCoords(this.map.center.lat(), this.map.center.lng())
      });*/
 
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  async setLocation(){
    this.getAddressFromCoords(this.map.center.lat(),this.map.center.lng());
    const alert = await this.alertController.create({
      header: 'Bien hecho!',
      message: 'La ubicación ha sido añadida',
      buttons: ['Aceptar']
    });

    await alert.present()
  }
 
  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords "+lattitude+" "+longitude);
    this.lat = lattitude;
    this.lng = longitude;
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
 
    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderReverseResult[]) => {

      })
      .catch((error: any) =>{ 
        //this.address = "Dirección no disponible";
      });
 
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
        header: "Seleccionar imagen",
        buttons: [{
                text: 'Cargar desde la galería',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
                }
            },
            {
                text: 'Usar la cámara',
                handler: () => {
                    this.takePicture(this.camera.PictureSourceType.CAMERA);
                }
            },
            {
                text: 'Cancelar',
                role: 'cancel'
            }
        ]
    });
    await actionSheet.present();
}
 
takePicture(sourceType: PictureSourceType) {
    var options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        saveToPhotoAlbum: false,
        correctOrientation: true
    };
 
    this.camera.getPicture(options).then(imagePath => {
        if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(imagePath)
                .then(filePath => {
                    let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                    let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
                    this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
                });
        } else {
            var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
            var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        }
    });
 
}

readFile(file: any) {
  const reader = new FileReader();
  reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
          type: file.type
      });

    // The storage path
    const path = `Archivos/${new Date().getTime()}_${this.archivoSeleccionado.name}`;
    const fileRef = firebase.storage().ref().child(path);
    const uploadTask = fileRef.put(imgBlob);

    uploadTask.on('state_changed', snapshot => {
    },  error => {
      console.log(error);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        this.guardar(downloadURL)
      });
    
    });

      
      
      //formData.append('file', imgBlob, file.name);
      
  };
  reader.readAsArrayBuffer(file);
}

copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
    let name = newFileName;
    let filePath = this.file.dataDirectory + name;
    let resPath = this.pathForImage(filePath);

    this.archivoSeleccionado = {
      name: name,
      path: resPath,
      filePath: filePath
    };

    //this.guardarDenuncia();
  }, error => {
      console.log(error)
      this.archivoSeleccionado = null;
  });
}

pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    let converted = this.webview.convertFileSrc(img);
    return converted;
  }
}

createFileName() {
  var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
  return newFileName;
}

  

  uploadFile(event: FileList) {
    console.log("Event ", event)
    // The File object
    const file = event.item(0)
 
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'image') { 
     console.error('Archivo no soportado')
     this.archivoSeleccionado = null;
     return;
    }
 
    this.archivoSeleccionado = file;
  }

  async guardarDenuncia(){
    if(this.archivoSeleccionado===null || this.denuncia.titulo=="" || this.denuncia.descripcion==""){
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Para guardar una denuncia es necesario tener un titulo, descripción y archivo seleccionado',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    this.cargando = true;
    this.file.resolveLocalFilesystemUrl(this.archivoSeleccionado.filePath)
        .then(entry => {
            ( < FileEntry > entry).file(file => this.readFile(file))
        })
        .catch(error => {
            this.archivoSeleccionado = null;
        });
  }
/*
  async guardarDenuncia(){

    if(this.archivoSeleccionado===null || this.denuncia.titulo=="" || this.denuncia.nombre==""){
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Para guardar una denuncia es necesario tener un titulo, nombre y archivo seleccionado',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    this.cargando = true;

    const file = this.archivoSeleccionado;
    // The storage path
    const path = `Archivos/${new Date().getTime()}_${file.name}`;
    const fileRef = firebase.storage().ref().child(path);
    const uploadTask = fileRef.put(file);

    uploadTask.on('state_changed', snapshot => {
    },  error => {
      console.log(error);
    }, () => {
      uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
        this.guardar(downloadURL)
      });
    
    });

  }
  */

  async guardar(urlImagen:string = ''){
    try{
      this.denuncia.urlArchivo = urlImagen;
      this.denuncia.localizacion = new firebase.firestore.GeoPoint(this.lat,this.lng);
      await this.denunciaService.guardarDenuncia(this.denuncia);
      this.cargando = false;
      const alert = await this.alertController.create({
        header: 'Bien hecho!',
        message: 'La denuncia ha sido guardada correctamente.',
        buttons: ['Aceptar']
      });

      await alert.present().then(() => {
        this.router.navigateByUrl('/home');
      })
    }
    catch(error){

      console.log(error)
      this.cargando = false;
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ocurrió un error al intentar guardar la denuncia.',
        buttons: ['Aceptar']
      });

      await alert.present();

    }
  }



}


/*guardarDenuncia(){

    const file = this.archivoSeleccionado;

    this.isUploading = true;
    this.isUploaded = false;


    console.log("Guardar denuncia ")
 
    this.fileName = file.name;
 
    // The storage path
    const path = `archivos/${new Date().getTime()}_${file.name}`;
 
    // Totally optional metadata
    const customMetadata = { app: 'Freaky Image Upload Demo' };
 
    //File reference
    const fileRef = this.storage.ref(path);
 
    // The main task
    this.task = this.storage.upload(path, file, { customMetadata });
 
    // Get file progress percentage
    this.percentage = this.task.percentageChanges();

    console.log("Percentage ", this.percentage)

    this.snapshot = this.task.snapshotChanges().pipe(
      
      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        console.log("Resp antes de guardar ", this.UploadedFileURL)
        
        this.UploadedFileURL.subscribe(resp=>{
          console.log("RESP QUE MANDA ", resp)
          this.guardar(resp);
          this.isUploading = false;
          this.isUploaded = true;
        },error=>{
          console.error(error);
        })
      }),
      tap(snap => {
          this.fileSize = snap.totalBytes;
      })
    )
  }*/