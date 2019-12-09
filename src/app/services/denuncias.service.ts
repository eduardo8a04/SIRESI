import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { DenunciaI } from '../models/denuncia.interface';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DenunciasService {

  private denuncias: Observable<DenunciaI[]>;
  private denunciaCollection: AngularFirestoreCollection<DenunciaI>;
  public filtro:string = "todos";

  constructor(private afs: AngularFirestore) {
    //Establecer coleccion de denuncias
    this.denunciaCollection = afs.collection<DenunciaI>('Denuncias');
    this.setDenuncias();

  }

  setDenuncias(){
    if(this.filtro=="todos"){
      this.denuncias = this.denunciaCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    } else {
      this.denuncias = this.afs.collection<DenunciaI>('Denuncias', ref => ref.where('estatus', '==', this.filtro)).snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
    }
  }

  getDenuncias(): Observable<DenunciaI[]> {
    return this.denuncias;
  }

  getDenuncia(id: string): Observable<DenunciaI> {
    return this.denunciaCollection.doc<DenunciaI>(id).valueChanges().pipe(
      take(1),
      map(denuncia => {
        denuncia.id = id;
        return denuncia
      })
    );
  }

  updateDenuncia(denuncia: DenunciaI): Promise<void> {
    return this.denunciaCollection.doc(denuncia.id).set(
      { 
        titulo: denuncia.titulo, 
        descripcion: denuncia.descripcion,
        tipo:denuncia.tipo,
        comentarios:denuncia.comentarios,
        estatus:denuncia.estatus,
      },
      {merge:true}
    );
  }
 
  deleteDenuncia(id: string): Promise<void> {
    return this.denunciaCollection.doc(id).delete();
  }

  async guardarDenuncia(denuncia: DenunciaI) {
    try{
      await this.denunciaCollection.add(denuncia);
    }catch(error){
      console.log(error);
    }
  }
}
