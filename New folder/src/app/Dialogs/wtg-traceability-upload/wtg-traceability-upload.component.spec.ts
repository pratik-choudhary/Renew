import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WtgTraceabilityUploadComponent } from './wtg-traceability-upload.component';

describe('WtgTraceabilityUploadComponent', () => {
  let component: WtgTraceabilityUploadComponent;
  let fixture: ComponentFixture<WtgTraceabilityUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WtgTraceabilityUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WtgTraceabilityUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
