import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLevelHeaderFooterComponent } from './site-level-header-footer.component';

describe('SiteLevelHeaderFooterComponent', () => {
  let component: SiteLevelHeaderFooterComponent;
  let fixture: ComponentFixture<SiteLevelHeaderFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SiteLevelHeaderFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SiteLevelHeaderFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
