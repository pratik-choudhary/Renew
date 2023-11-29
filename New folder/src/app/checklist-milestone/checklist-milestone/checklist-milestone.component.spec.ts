import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistMilestoneComponent } from './checklist-milestone.component';

describe('ChecklistMilestoneComponent', () => {
  let component: ChecklistMilestoneComponent;
  let fixture: ComponentFixture<ChecklistMilestoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChecklistMilestoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChecklistMilestoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
