import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFormComponent } from '././column-form.component';

describe('ColumnFormComponent', () => {
  let component: ColumnFormComponent;
  let fixture: ComponentFixture<ColumnFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ColumnFormComponent]
    });
    fixture = TestBed.createComponent(ColumnFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
