import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DqrReportComponent } from './dqr-report.component';

describe('DqrReportComponent', () => {
  let component: DqrReportComponent;
  let fixture: ComponentFixture<DqrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DqrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DqrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
