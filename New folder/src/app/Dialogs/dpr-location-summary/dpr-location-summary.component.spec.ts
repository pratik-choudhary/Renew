import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DprLocationSummaryComponent } from './dpr-location-summary.component';

describe('DprLocationSummaryComponent', () => {
  let component: DprLocationSummaryComponent;
  let fixture: ComponentFixture<DprLocationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DprLocationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DprLocationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
