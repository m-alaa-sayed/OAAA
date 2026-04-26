import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-custom-ckeditor',
  templateUrl: './custom-ckeditor.component.html',
  styleUrls: ['./custom-ckeditor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomCkeditorComponent),
      multi: true
    }
  ]
})
export class CustomCkeditorComponent implements ControlValueAccessor {
  @Input() language: 'ar' | 'en' = 'ar';
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() config?: any; // Custom editor configuration from parent component

  public Editor = ClassicEditor;
  public editorData: string = '';

  // ControlValueAccessor callbacks
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // Get editor configuration based on language
  get editorConfig() {
    // If custom config is provided, merge it with default config
    const defaultConfig = {
      toolbar: [
        'heading',
        '|',
        // allow users to apply styling manually after paste cleaning
        'bold', 'italic', 'underline',
        '|',
        'bulletedList', 'numberedList',
        '|',
        'undo', 'redo'
      ],
      language: {
        content: this.language
      },
      contentsLangDirection: this.language === 'ar' ? 'rtl' : 'ltr',
      // Keep styling plugins enabled so users can format text; still remove table plugins
      removePlugins: ['Table', 'TableToolbar', 'TableProperties', 'TableCellProperties'],
      // Fix dropdown positioning issues
      ui: {
        poweredBy: {
          position: 'inside',
          side: 'right'
        }
      },
      // Ensure proper positioning context for dropdowns
      balloonToolbar: {
        shouldNotGroupWhenFull: true
      }
    };

    // Merge custom config with default config if provided
    return this.config ? { ...defaultConfig, ...this.config } : defaultConfig;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.editorData = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Handle editor data changes
  onEditorChange(data: string): void {
    this.editorData = data;
    this.onChange(data);
    this.onTouched();
  }

  // Handle CKEditor ready event
  onEditorReady(editor: any): void {
    // Configure paste behavior via ClipboardPipeline to strip styling but keep structure
    const clipboard = editor.plugins.get('ClipboardPipeline');
    clipboard.on('inputTransformation', (evt: any, data: any) => {
      const htmlContent = data.dataTransfer?.getData('text/html');
      const textContent = data.dataTransfer?.getData('text/plain');

      let sanitizedHtml = '';
      if (htmlContent) {
        sanitizedHtml = this.cleanPastedContent(htmlContent);
      } else if (textContent) {
        sanitizedHtml = this.textToHtml(textContent);
      }

      if (sanitizedHtml) {
        // Use the current data processor to convert HTML string to a view document fragment
        const viewFragment = editor.data.processor.toView(sanitizedHtml);
        data.content = viewFragment;
      }
    }, { priority: 'high' });

    // Fix dropdown positioning by ensuring proper DOM attachment
    setTimeout(() => {
      const toolbarElement = editor.ui.view.toolbar.element;
      if (toolbarElement) {
        toolbarElement.style.position = 'relative';
        toolbarElement.style.zIndex = '1000';
      }
    }, 100);
  }

  /**
   * Clean pasted HTML content by removing unwanted elements and attributes
   * while preserving structure like paragraphs, lists, and line breaks
   */
  private cleanPastedContent(html: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove HTML comments and non-content nodes like MS Office conditional comments
    this.removeComments(tempDiv);

    // Remove disallowed/unsafe tags entirely to avoid leaking CSS/JS into text
    this.removeDisallowedTags(tempDiv);

    // Step 1: Remove table elements completely
    this.removeTables(tempDiv);
    
    // Step 2: Convert pseudo-bullets (middle dots, dashes, asterisks) to proper lists
    this.convertPseudoBulletsToLists(tempDiv);
    
    // Step 3: Normalize block elements (headings/div) to plain paragraphs to keep structure without styling
    this.convertBlocksToParagraphs(tempDiv);

    // Step 4: Clean attributes from all elements (removes inline styles/classes/etc.)
    this.cleanElementAttributes(tempDiv);
    
    // Step 5: Keep only structural tags and unwrap any formatting tags (bold/italic/underline etc.)
    this.filterAllowedTags(tempDiv);
    
    return tempDiv.innerHTML;
  }

  /**
   * Remove all table-related elements and convert their content to text
   */
  private removeTables(container: HTMLElement): void {
    const tableElements = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption', 'colgroup', 'col'];
    
    tableElements.forEach(tag => {
      const elements = container.querySelectorAll(tag);
      elements.forEach((element: Element) => {
        const htmlElement = element as HTMLElement;
        const textContent = (htmlElement.innerText || htmlElement.textContent || '').trim();
        if (textContent) {
          const textNode = document.createTextNode(textContent + '\n');
          element.replaceWith(textNode);
        } else {
          element.remove();
        }
      });
    });
  }

  /**
   * Remove HTML comments recursively
   */
  private removeComments(node: Node): void {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT, null);
    const toRemove: Comment[] = [];
    let current = walker.nextNode();
    while (current) {
      toRemove.push(current as Comment);
      current = walker.nextNode();
    }
    toRemove.forEach(c => c.remove());
  }

  /**
   * Remove tags that should never appear in editor content (style/script/meta/link/head/body/etc.)
   */
  private removeDisallowedTags(container: HTMLElement): void {
    const selectors = [
      'style', 'script', 'meta', 'link', 'title', 'head', 'html', 'body', 'iframe', 'object', 'embed', 'noscript', 'svg'
    ];
    container.querySelectorAll(selectors.join(',')).forEach(el => el.remove());

    // Remove namespaced/office-specific elements like o:p, v:*, w:*
    container.querySelectorAll('*').forEach((el) => {
      if (el.tagName.includes(':')) {
        el.remove();
      }
    });
  }

  /**
   * Remove unwanted styling attributes from all elements
   */
  private cleanElementAttributes(container: HTMLElement): void {
    const elements = container.querySelectorAll('*');
    const attributesToRemove = ['style', 'class', 'id', 'width', 'height', 'align', 'valign', 'bgcolor', 'color'];
    
    elements.forEach((element: Element) => {
      attributesToRemove.forEach(attr => element.removeAttribute(attr));
    });
  }

  /**
   * Convert pseudo-bullets (middle dots, dashes, asterisks) to proper HTML lists
   */
  private convertPseudoBulletsToLists(container: HTMLElement): void {
    const paragraphs = container.querySelectorAll('p, div');
    const bulletGroups: HTMLElement[][] = [];
    let currentGroup: HTMLElement[] = [];

    paragraphs.forEach((p: Element) => {
      const htmlP = p as HTMLElement;
      const text = (htmlP.textContent || '').trim();
      
      // Check if this paragraph starts with bullet-like characters
      if (/^[·•\-\*]\s+/.test(text)) {
        currentGroup.push(htmlP);
      } else {
        // End current group if we have one
        if (currentGroup.length > 0) {
          bulletGroups.push([...currentGroup]);
          currentGroup = [];
        }
      }
    });

    // Don't forget the last group
    if (currentGroup.length > 0) {
      bulletGroups.push(currentGroup);
    }

    // Convert each group to a proper <ul>
    bulletGroups.forEach(group => {
      if (group.length === 0) return;

      const ul = document.createElement('ul');
      
      group.forEach(p => {
        const text = (p.textContent || '').trim();
        const itemText = text.replace(/^[·•\-\*]\s+/, '');
        
        if (itemText) {
          const li = document.createElement('li');
          li.textContent = itemText;
          ul.appendChild(li);
        }
      });

      // Insert the ul where the first paragraph was, then remove all paragraphs in group
      if (group[0].parentNode && ul.children.length > 0) {
        group[0].parentNode.insertBefore(ul, group[0]);
      }
      
      // Remove the original paragraphs after inserting the list
      group.forEach(p => p.remove());
    });
  }

  /**
   * Convert block-level styled elements to plain paragraphs to preserve line separation
   */
  private convertBlocksToParagraphs(container: HTMLElement): void {
    const blockSelectors = ['h1','h2','h3','h4','h5','h6','div'];
    container.querySelectorAll(blockSelectors.join(',')).forEach((el: Element) => {
      const p = document.createElement('p');
      p.innerHTML = (el as HTMLElement).innerHTML;
      el.replaceWith(p);
    });
  }

  /**
   * Keep only structural tags and unwrap others (remove formatting like bold/italic/underline)
   */
  private filterAllowedTags(container: HTMLElement): void {
    // Only preserve structural/content tags; remove all formatting tags by unwrapping
    const allowedTags = ['p', 'br', 'ul', 'ol', 'li'];
    const elements = container.querySelectorAll('*');

    elements.forEach((element: Element) => {
      const tagName = element.tagName.toLowerCase();

      if (!allowedTags.includes(tagName)) {
        // If this is a disallowed container (style/script/etc.), remove entirely
        if (['style','script','meta','link','title','head','html','body','iframe','object','embed','noscript','svg'].includes(tagName) || tagName.includes(':')) {
          element.remove();
          return;
        }
        // unwrap element: replace it with its child nodes
        const fragment = document.createDocumentFragment();
        // Use Array.from to correctly spread NodeList into the fragment
        Array.from(element.childNodes).forEach((child) => fragment.appendChild(child));
        element.replaceWith(fragment);
      }
    });
  }

  /**
   * Convert plain text (with new lines) to minimal HTML preserving paragraphs and bullet-like lines.
   */
  private textToHtml(text: string): string {
    // Normalize line endings
    const lines = (text || '').replace(/\r\n?/g, '\n').split('\n');

    const htmlParts: string[] = [];
    let listOpen = false;

    const openList = () => { if (!listOpen) { htmlParts.push('<ul>'); listOpen = true; } };
    const closeList = () => { if (listOpen) { htmlParts.push('</ul>'); listOpen = false; } };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.length) {
        // blank line denotes paragraph break
        closeList();
        htmlParts.push('<p><br></p>');
        continue;
      }

      // Detect common bullet markers: •, -, *
      if (/^(•|-|\*)\s+/.test(trimmed)) {
        openList();
        const itemText = trimmed.replace(/^(•|-|\*)\s+/, '');
        htmlParts.push(`<li>${this.escapeHtml(itemText)}</li>`);
      } else {
        closeList();
        htmlParts.push(`<p>${this.escapeHtml(trimmed)}</p>`);
      }
    }

    closeList();
    return htmlParts.join('');
  }

  private escapeHtml(s: string): string {
    return (s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
