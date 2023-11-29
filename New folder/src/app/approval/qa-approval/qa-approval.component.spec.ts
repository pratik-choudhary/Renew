import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QAApprovalComponent } from './qa-approval.component';

describe('QAApprovalComponent', () => {
  let component: QAApprovalComponent;
  let fixture: ComponentFixture<QAApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QAApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QAApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
