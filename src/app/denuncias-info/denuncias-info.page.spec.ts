import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DenunciasInfoPage } from './denuncias-info.page';

describe('DenunciasInfoPage', () => {
  let component: DenunciasInfoPage;
  let fixture: ComponentFixture<DenunciasInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DenunciasInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DenunciasInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
