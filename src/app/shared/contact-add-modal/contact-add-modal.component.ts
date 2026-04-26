import { Component, Input, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';
import { ContactDetails } from '../../pages/school-performance/types/school-info';

@Component({
  selector: 'app-contact-add-modal',
  templateUrl: './contact-add-modal.component.html',
  styleUrls: ['./contact-add-modal.component.scss']
})
export class ContactAddModalComponent implements OnInit {
  @Input() title: string = '';
  @ViewChild('contactForm') contactForm!: NgForm;

  contact: ContactDetails = {
    name: '',
    email: '',
    phone: '',
  };

  constructor(
    public activeModal: NgbActiveModal,
    public translate: TranslateService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    // Set RTL direction if current language is Arabic
    if (this.translate.currentLang === 'ar') {
      this.setRTLDirection();
    }
  }

  private setRTLDirection(): void {
    // Set direction on the modal dialog element
    const modalDialog = this.elementRef.nativeElement.closest('.modal-dialog');
    if (modalDialog) {
      this.renderer.setAttribute(modalDialog, 'dir', 'rtl');
      this.renderer.addClass(modalDialog, 'rtl-layout');
    }

    // Set direction on the modal content
    const modalContent = this.elementRef.nativeElement.closest('.modal-content');
    if (modalContent) {
      this.renderer.setAttribute(modalContent, 'dir', 'rtl');
      this.renderer.addClass(modalContent, 'rtl-layout');
    }

    // Set direction on the host element
    this.renderer.setAttribute(this.elementRef.nativeElement, 'dir', 'rtl');
    this.renderer.addClass(this.elementRef.nativeElement, 'rtl-layout');
  }

  get isRTL(): boolean {
    return this.translate.currentLang === 'ar';
  }

  onSave(): void {
    if (this.isValid()) {
      // Generate a unique ID for the contact if not provided
      const contactData: ContactDetails = {
        ...this.contact,
        //id: this.contact.id || Date.now() // Use timestamp as simple unique ID
      };
      
      // Close modal and return the contact data
      this.activeModal.close(contactData);
    }
  }

  onCancel(): void {
    this.activeModal.dismiss();
  }

  isValid(): boolean {
    const basicValidation = this.contact.name.trim() !== '' && 
                           this.contact.phone.trim() !== '';
    
    // Check form validation if form is available
    const formValidation = this.contactForm ? (this.contactForm.valid ?? true) : true;
    
    // If email is provided, it should be valid
    const emailValidation = this.contact.email.length === 0 || this.isValidEmail(this.contact.email);
    
    return basicValidation && formValidation && emailValidation;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
} 