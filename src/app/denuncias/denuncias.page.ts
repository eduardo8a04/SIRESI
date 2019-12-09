import { Component, OnInit } from '@angular/core';
import {DenunciasService} from '../services/denuncias.service';
import { DenunciaI } from '../models/denuncia.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-denuncias',
  templateUrl: './denuncias.page.html',
  styleUrls: ['./denuncias.page.scss'],
})
export class DenunciasPage implements OnInit {

  private denuncias: Observable<DenunciaI[]>;

  constructor(private denunciaSvc:DenunciasService,) { 

    this.denunciaSvc.filtro = "Aceptado";
    this.denunciaSvc.setDenuncias();
    this.denuncias = this.denunciaSvc.getDenuncias();

  }

  ngOnInit() {
  }

}
