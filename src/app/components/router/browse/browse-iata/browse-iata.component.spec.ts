import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseIataComponent } from './browse-iata.component';

describe('BrowseIataComponent', () => {
  let component: BrowseIataComponent;
  let fixture: ComponentFixture<BrowseIataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseIataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseIataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
