import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular';
import * as ClassicEditor from 'src/app/document-editor/document-editor-custom-build/build/ckeditor.js';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import * as moment from 'moment';
import { WriteForMe, WriteForMeFormInterface } from '../shared/proxy/document-editor/document-editor.interface';
import { DocumentEditorService } from '../shared/proxy/document-editor/document-editor.service';
import { finalize, tap } from 'rxjs/operators';
import { jsPDF } from "jspdf";
import { userService } from '../shared/proxy/user/user.service';
import { UserInterface } from '../shared/proxy/user/user.interface';
import { Router } from '@angular/router';
import { ToolService } from '../shared/proxy/tools/tool.service';
import { ToolInterface } from '../shared/proxy/tools/tool.interface';

import { NzModalService } from 'ng-zorro-antd/modal';
import { VideoModalComponent } from './video-modal/video-modal.component';

@Component({
  selector: 'app-document-editor', templateUrl: './document-editor.component.html', styleUrls: ['./document-editor.component.scss'],
})
export class DocumentEditorComponent implements OnInit, AfterViewInit {
  editor: any;
  selectedText: string = '';
  editorLines: string[] = ['Hello, world!'];
  wordsCount: number = 0;
  visible: boolean = false;
  data: string = '';
  isSmallScreen: boolean = false;
  selectedProject: string;
  isThinking: boolean = false;
  userData: UserInterface;
  userUsage: any;
  documentData: any;
  editorText: string;
  toolsList: ToolInterface[];
  dupList: ToolInterface[];
  lastSaved = {
    view: '',
    value: `${moment().format()}`
  }
  lastSavedHidden: boolean = true;
  config = {
    toolbar: {
      items: [
        'selectAll',
        'undo',
        'redo', 'bold', 'italic', 'blockQuote', 'link', 'heading', 'imageTextAlternative', 'indent', 'outdent', 'numberedList', 'bulletedList', 'downloadDropdown', 'customDropdown'
      ]
    },
    balloonToolbar: {
      items: [
        'bold',
        'italic',
        'heading',
        'link',
        '|',
        'aiShortcuts'
      ]
    },
    image: {
      toolbar: [
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side',
        '|',
        'toggleImageCaption',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    autosave: {
      save(editor) {
        let event: any = new CustomEvent("autoSave");
        event.saveData = editor.getData();
        window.dispatchEvent(event);
      }
    },
    language: 'en',
    removePlugins: [],
  };
  writeForMeForm: WriteForMeFormInterface = {
    topic: '',
    context: '',
    keywords: [],
    tone: '',
    no_of_chars: 50,
    creativity: 3,
  };

  editorInstance: any;
  @ViewChild('title') Title: ElementRef;

  constructor(private breakpointOberver: BreakpointObserver, private viewContainerRef: ViewContainerRef, private modal: NzModalService, private documentEditorService: DocumentEditorService, private toolService: ToolService,
    private user: userService, private router: Router) {}

  @HostListener('window: CustomDropdown', ['$event'])
  onCustomDropdown(e: any) {
    this.data = e.selectedText;
    if (this.isSmallScreen) {
      this.openDrawer();
    }
  }

  @HostListener('window: AIShortcuts', ['$event'])
  onAIShortcuts(e: any) {
    this.performAction(e.selectedText.text);
  }

  @HostListener('window: autoSave', ['$event'])
  onAutoSave(e: any) {
    this.updateDocument();
  }

  @HostListener('window: textSelectionDone', ['$event'])
  onTextSelection(e: any) {
    if (this.selectedText !== e.selectedText.text) {
      this.selectedText = e.selectedText.text;
    }
  }

  @HostListener('window: totalWords', ['$event'])
  totalWords(e: any) {
    this.wordsCount = e.stats.words;
  }

  @HostListener('window: DownloadDropdown', ['$event'])
  downladData(e: any) {
    let doc = new jsPDF();
    doc.html(e.selectedText.html[0]).then((resp) => {
      doc.save('downloadPdf.pdf');
    });
  }

  ngAfterViewInit() { }

  ngOnInit() {
    if (localStorage.getItem('selectedProject')) {
      let selected = JSON.parse(localStorage.getItem('selectedProject'));
      this.selectedProject = selected.project;
    }

    let parts = this.router.url.split('/');

    this.documentEditorService.getDocument(parts[2]).subscribe((resp) => {
      if(resp.uuid == null) {
        this.router.navigate(['/documents']);
      } else {
        this.documentData = resp;
      }
    });

    this.toolService.list().subscribe((resp) => {
      this.toolsList = resp;
      this.dupList = resp;
    });

    this.breakpointOberver.observe(['(max-width: 768px)', '(max-width: 425px)', '(max-width: 375px)', '(max-width: 320px)',]).subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.isSmallScreen = true;
      } else {
        this.isSmallScreen = false;
      }
    });

    this.user.getUser().subscribe((ele) => {
      this.userData = ele;
      this.user.getUserUsage(ele.uuid).subscribe((ele: any) => {
        ele.subscription_plan.name = ele.subscription_plan.name.split('_').join(' ');
        ele.billing_cycle_renewal = moment.utc(new Date(ele.billing_cycle_renewal)).local().fromNow();
        this.userUsage = ele;
        this.editor = ClassicEditor;
        //if (this.userUsage.subscription_plan.name == 'starter') {

        this.config.removePlugins.push('DownloadDropdown');
        //}
      });
    });

    this.createVideoModal() ;
  }

  get charFromPos(): string {
    let CurrentNode = this.editorInstance.model.document.selection.getLastPosition();
    var rangeItems = [];
    var currentItems = []
    CurrentNode.root._children._nodes.filter((n) => n.index < CurrentNode.parent.index).forEach((n) => n._children._nodes.length !== 0 ? n._children._nodes.forEach(ch => rangeItems.push(ch.data)) : rangeItems.push(''))
    CurrentNode.root._children._nodes.filter((n) => n.index == CurrentNode.parent.index).forEach((n) => n._children._nodes.length !== 0 ? n._children._nodes.forEach(ch => currentItems.push(ch.data)) : currentItems.push(''))
    rangeItems.push(currentItems.join('\\n').substring(0, CurrentNode.offset))
    return rangeItems.join(' \\n ').replace('  ', ' ')
  }
  updateDocument(): void {
    let data = { ...this.documentData };
    data.text = this.editorText;
    if (data.last_updated == null) {
      data.last_updated = '';
    }
    this.documentEditorService.updateDocument(data).pipe(tap(() => (this.lastSavedHidden = false))).subscribe(() => {
      if (this.lastSaved.view === '' && this.documentData.text) {
        this.lastSaved.view = moment.utc(new Date()).local().fromNow();
      } else {
        this.lastSaved.view = moment.utc(new Date(this.lastSaved.value)).local().fromNow();
      } setTimeout(() => {
        this.lastSavedHidden = true;
      }, 2000);
    });
  }

  onChange({ editor }: ChangeEvent) {
    this.editorText = editor.getData();
  }

  writeForMe(data: WriteForMe, type): void {
    this.isThinking = true;
    this.documentEditorService.writeForMe(data).pipe(finalize(() => this.isThinking = false)).subscribe((resp) => {
      let charsLen = resp[0].text.split('');
      let x = 0;
      let writtenOnce = false;
      let interval = setInterval(() => {

        // new logic for appending new data after the end of selected text for write_about_this
        if (type !== 'write_about_this') {
          const viewFragment = this.editorInstance.data.processor.toView(``);
          const modelFragment = this.editorInstance.data.toModel(viewFragment);
          this.editorInstance.model.insertContent(modelFragment);
        }
        this.editorInstance.model.change((writer) => {
          if (type === 'write_about_this') {

            if (x == 0){
              // set new selection with cursor at the end of the current selection
              writer.setSelection( writer.createPositionAt( this.editorInstance.model.document.selection.getLastPosition() ) );
              writer.insertText(' ', this.editorInstance.model.document.selection.getLastPosition());
            }
            writer.insertText(charsLen[x], this.editorInstance.model.document.selection.getLastPosition());
          } else {
            writer.insertText(charsLen[x], this.editorInstance.model.document.selection.getFirstPosition());
          }
          const selection = this.editorInstance.model.document.selection;
          selection.getLastRange();
        });
        ++x;
        if (x == charsLen.length) {
          window.clearInterval(interval);
        }
      }, 50);
    });
  }
  performAction(type: string): void {
    let data: WriteForMe = {
      input_language: 'en',
      output_language: 'en',
      project_uuid: `${this.selectedProject}`,
      tool_uuid: '',
      template_name: 'write_about_this',
      data: [],
    };
    if (type === 'write_about_this') {

      data.tool_uuid = '4ee250ec-aa4c-3ef9-bb7c-857b4a3832e2';
      data.data = [
        {
          key: 'starter',
          value: this.selectedText
        },
        {
          key: 'no_of_chars',
          value: `${this.writeForMeForm.no_of_chars}`
        },
        {
          key: 'creativity',
          value: `${this.writeForMeForm.creativity}`
        },
        {
          key: 'keywords',
          value: `${this.writeForMeForm.keywords.join(',')}`
        },
        {
          key: 'tone',
          value: this.writeForMeForm.tone,
        },
        {
          key: 'brief',
          value: `${this.writeForMeForm.context}`
        },
        {
          key: 'document_title',
          value: this.documentData.name
        }
      ]

      //if (this.documentData.name !== 'Untitled document'.trim()) {
      // data.data[0].value = this.documentData.name + '\n\n' + data.data[0].value;
      //}
      this.writeForMe(data, type);
    } else if (type === 'summarize') {
      data.tool_uuid = '45883eb4-4c7c-3e5b-abb9-35839ca74692';
      data.template_name = 'summary';
      data.data = [{
          key: 'text',
          value: this.selectedText
        }
      ];
      this.writeForMe(data, type);
    } else {
      data.tool_uuid = 'adee9452-81a8-39ba-8098-7666b93a5700';
      data.template_name = 'rewrite_content';
      data.data = [{
          key: 'text_to_rewrite',
          value: this.selectedText
        },
        {
          key: 'keywords',
          value: "",
        },
        {
          key: 'tone',
          value: this.writeForMeForm.tone,
        },
      ];
      this.writeForMe(data, type);
    }
  }
  onwriteWithContext(event: any) {

    let topic = '' ;
    if (this.documentData.name.trim() !== 'Untitled document' && this.documentData.name.trim() !== '') {
      topic = this.documentData.name ;
    }
    let data: WriteForMe = {
      input_language: 'en',
      output_language: 'en',
      project_uuid: `${this.selectedProject}`,
      tool_uuid: '4ee250ec-aa4c-3ef9-bb7c-857b4a3832e2',
      template_name: 'write_for_me',
      data: [
        {
          key: 'topic',
          value: topic
        },
        {
          key: 'context',
          value: this.writeForMeForm.context
        },
        {
          key: 'keywords',
          value: this.writeForMeForm.keywords.join(',')
        },
        {
          key: 'starter_text',
          value: this.charFromPos
        },
        {
          key: 'no_of_chars',
          value: `${this.writeForMeForm.no_of_chars}`
        },
        {
          key: 'creativity',
          value: `${this.writeForMeForm.creativity}`
        },
        {
          key: 'tone',
          value: `${this.writeForMeForm.tone}`
        },
      ],
    };
    this.writeForMe(data, 'write_for_me')
  }
  onFormDataChange(FormData: WriteForMeFormInterface) {
    this.writeForMeForm = FormData;
  }


  ongeneratedText(event: any): void {
    if (event.isLoader) {
      this.isThinking = false;
    }
    this.editorInstance.editing.view.focus();
    let charsLen = event.text.split("");
    let x = 0;
    let interval = setInterval(() => {
      const viewFragment = this.editorInstance.data.processor.toView(``);
      const modelFragment = this.editorInstance.data.toModel(viewFragment);
      this.editorInstance.model.insertContent(modelFragment);
      this.editorInstance.model.change(writer => {
        writer.insertText(charsLen[x], this.editorInstance.model.document.selection.getFirstPosition());
        const selection = this.editorInstance.model.document.selection;
        selection.getLastRange();
      });
      ++x;
      if (x == charsLen.length) {
        window.clearInterval(interval)
      }
    }, 50);
  }

  onThinking(ev: boolean): void {
    this.isThinking = ev;
  }

  onTitleChange(): void {
    if (this.documentData.name.trim() !== '') {
      this.updateDocument();
    }
  }

  onReady(editor) {
    this.editorInstance = editor;
    if (this.documentData.name !== '') {
      editor.editing.view.focus();
    } else {
      this.Title.nativeElement.focus();
    }
  }

  open(): void {
    this.visible = true;
  }

  close(): void {
    this.visible = false;
  }

  openDrawer(): void {
    if (this.isSmallScreen) {
      this.open();
    }
  }

  openChat() {
    (document.getElementsByClassName('cc-unoo')[0] as HTMLElement).click();
      var myVar = setInterval(() => {
        if ((document.getElementsByClassName('cc-1asz')[0] as HTMLElement)) {
          (document.getElementsByClassName('cc-1asz')[0] as HTMLElement).onclick = () => {
            (document.getElementsByClassName('cc-unoo')[0] as HTMLElement).setAttribute('style', "display:none !important");
          }
          clearInterval(myVar)
        }
      }, 1000);
  }

  onSearch(term): void {
    this.toolsList = this.dupList.filter((tool) => {
      return (
        tool.description.toLowerCase().includes(term) ||
        tool.name.toLowerCase().includes(term)
      );
    });
  }

  createVideoModal(): void {
    const modal = this.modal.create({
      nzClosable: false,
      nzCentered: true,
      nzWidth: "70vw",
      nzFooter: null,
      nzWrapClassName: 'content-modal',
      nzBodyStyle: {'padding': '0'},
      nzContent: VideoModalComponent,
      nzAutofocus: null,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
      },
    });
    modal.afterClose.subscribe((result) => {
    });

  }

}
