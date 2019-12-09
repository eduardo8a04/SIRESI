import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DenunciasPage } from './denuncias.page';

describe('DenunciasPage', () => {
  let component: DenunciasPage;
  let fixture: ComponentFixture<DenunciasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenunciasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DenunciasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
