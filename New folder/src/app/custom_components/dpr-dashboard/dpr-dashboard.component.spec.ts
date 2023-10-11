import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DprDashboardComponent } from './dpr-dashboard.component';

describe('DprDashboardComponent', () => {
  let component: DprDashboardComponent;
  let fixture: ComponentFixture<DprDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DprDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DprDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
