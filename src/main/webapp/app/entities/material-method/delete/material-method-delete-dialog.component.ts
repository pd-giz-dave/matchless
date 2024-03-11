import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IMaterialMethod } from '../material-method.model';
import { MaterialMethodService } from '../service/material-method.service';

@Component({
  standalone: true,
  templateUrl: './material-method-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class MaterialMethodDeleteDialogComponent {
  materialMethod?: IMaterialMethod;

  constructor(
    protected materialMethodService: MaterialMethodService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.materialMethodService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
