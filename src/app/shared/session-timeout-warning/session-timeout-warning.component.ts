import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-session-timeout-warning',
  templateUrl: './session-timeout-warning.component.html',
  styleUrl: './session-timeout-warning.component.scss'
})
export class SessionTimeoutWarningComponent implements OnDestroy {
  visible = false;
  isClosing = false;
  countdown: number = 60;

  private intervalId: any;

  @Output() stayLoggedIn = new EventEmitter<void>();
  @Output() timeoutReached = new EventEmitter<void>();


  show(warningTimeInMs: any) {
    this.visible = true;
    this.isClosing = false;
    this.countdown = Math.round(warningTimeInMs / 1000);
    this.startCountdown();
  }

  hide(): void {
    this.isClosing = true;
    // Wait for fade-out animation (0.5s)
    setTimeout(() => {
      this.visible = false;
      this.isClosing = false;
      this.clearCountdown();
    }, 500);
  }

  private startCountdown(): void {
    this.clearCountdown();

    this.intervalId = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {        
        this.clearCountdown();
        this.timeoutReached.emit();
      }
    }, 1000);
  }


  private clearCountdown(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  onStay(): void {
    this.hide();
    this.stayLoggedIn.emit();
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }
}
