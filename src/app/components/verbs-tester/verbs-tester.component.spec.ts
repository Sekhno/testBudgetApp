import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbsTesterComponent } from './verbs-tester.component';

describe('VerbsTesterComponent', () => {
  let component: VerbsTesterComponent;
  let fixture: ComponentFixture<VerbsTesterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbsTesterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbsTesterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
