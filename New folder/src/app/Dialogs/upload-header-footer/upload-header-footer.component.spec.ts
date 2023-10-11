import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHeaderFooterComponent } from './upload-header-footer.component';

describe('UploadHeaderFooterComponent', () => {
  let component: UploadHeaderFooterComponent;
  let fixture: ComponentFixture<UploadHeaderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadHeaderFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
