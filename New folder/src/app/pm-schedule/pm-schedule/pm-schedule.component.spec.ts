import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PmScheduleComponent } from './pm-schedule.component';

describe('PmScheduleComponent', () => {
  let component: PmScheduleComponent;
  let fixture: ComponentFixture<PmScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PmScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PmScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
