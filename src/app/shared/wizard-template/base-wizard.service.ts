export abstract class BaseWizardService {
  protected abstract submit(formData: any): any;
  public abstract getCancelUrl(): string;
}
