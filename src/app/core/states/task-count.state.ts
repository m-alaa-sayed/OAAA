import { BehaviorSubject } from 'rxjs';

export class TaskCountState {
  private static taskCountState: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  static getTaskCountState(): BehaviorSubject<number> {
    return this.taskCountState;
  }

  static setTaskCountState(count: number): void {
    this.taskCountState.next(count);
  }
}