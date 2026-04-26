/**
 * Utility function to configure CKEditor paste behavior
 * This strips formatting from pasted content, allowing only plain text
 */
export class CKEditorPasteUtil {
  
  /**
   * Configures an CKEditor instance to strip formatting on paste
   * Call this method in the (ready) event of ckeditor components
   * @param editor - The CKEditor instance
   */
  static configurePasteBehavior(editor: any): void {
    // Listen for paste events and strip formatting
    editor.editing.view.document.on('paste', (evt: any, data: any) => {
      // Get the plain text content without formatting
      const plainText = data.dataTransfer.getData('text/plain');
      
      if (plainText) {
        // Prevent the default paste behavior
        evt.stop();
        
        // Insert plain text without formatting
        editor.model.change((writer: any) => {
          const insertPosition = editor.model.document.selection.getFirstPosition();
          writer.insertText(plainText, insertPosition);
        });
      }
    }, { priority: 'high' });
  }
}
