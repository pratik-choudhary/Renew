import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DprLocationDashboardComponent } from './dpr-location-dashboard.component';

describe('DprLocationDashboardComponent', () => {
  let component: DprLocationDashboardComponent;
  let fixture: ComponentFixture<DprLocationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DprLocationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DprLocationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
