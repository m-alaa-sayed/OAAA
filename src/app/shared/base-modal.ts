import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';

export class BaseModal {
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
  };

  closeResult: string = '';
  constructor(public modalService: NgbModal) {}

  close() {
    this.modalService.dismissAll();
  }

  open(content: any) {
    this.modalService.open(content, this.ngbModalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
