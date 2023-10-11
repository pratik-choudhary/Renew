import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueRegisterComponent } from './issue-register.component';

describe('IssueRegisterComponent', () => {
  let component: IssueRegisterComponent;
  let fixture: ComponentFixture<IssueRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
