import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelTransactionDialogComponent } from './cancel-transaction-dialog.component';

describe('CancelTransactionDialogComponent', () => {
  let component: CancelTransactionDialogComponent;
  let fixture: ComponentFixture<CancelTransactionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelTransactionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelTransactionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
