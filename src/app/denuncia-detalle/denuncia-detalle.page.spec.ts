import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DenunciaDetallePage } from './denuncia-detalle.page';

describe('DenunciaDetallePage', () => {
  let component: DenunciaDetallePage;
  let fixture: ComponentFixture<DenunciaDetallePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenunciaDetallePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DenunciaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
