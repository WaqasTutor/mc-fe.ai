import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions } from '@ngx-formly/core';
import { finalize } from 'rxjs/operators';
import { Datum } from 'src/app/shared/proxy/content/content.interface';
import { ContentService } from 'src/app/shared/proxy/content/content.service';
import { WriteForMe } from 'src/app/shared/proxy/document-editor/document-editor.interface';
import { DocumentEditorService } from 'src/app/shared/proxy/document-editor/document-editor.service';
import { ToolInterface } from 'src/app/shared/proxy/tools/tool.interface';
import { ToolService } from 'src/app/shared/proxy/tools/tool.service';
import { UserInterface } from 'src/app/shared/proxy/user/user.interface';
import { userService } from '../../shared/proxy/user/user.service';
import LangFormats from 'src/assets/lang.json';
interface InterfaceData {
  text: string;
}
@Component({
  selector: 'app-doc-sidebar',
  templateUrl: './doc-sidebar.component.html',
  styleUrls: ['./doc-sidebar.component.scss'],
})
export class DocSidebarComponent implements OnInit, OnChanges {
  inputLanguage: string;
  outputLanguage: string;
  langFormats: any[] = LangFormats;
  navigation: number = 1;
  writeForMe: FormGroup;
  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = {};
  details = {};
  selectedTool: ToolInterface;
  userData: UserInterface;
  selectedProject: string;
  isLoading: boolean = false;
  generationLoading: boolean = false;
  defaultTone: string = 'formal' ;
  contentList = [];
  searchTools: string;
  @Input() wordsCount: number;
  @Input() data: InterfaceData;
  @Input() Tools: ToolInterface[];
  @Input() isThinking: boolean;
  @Output() searchChanged: EventEmitter<string> = new EventEmitter();
  @Output() formData: EventEmitter<any> = new EventEmitter();
  @Output() generatedText: EventEmitter<any> = new EventEmitter();
  @Output() loading: EventEmitter<boolean> = new EventEmitter();
  @Output() writeWithContext: EventEmitter<any> = new EventEmitter();
  @Output() writeForMeData: EventEmitter<any> = new EventEmitter();



  constructor(
    private fb: FormBuilder,
    private toolService: ToolService,
    private contentService: ContentService,
    private documentEditorService: DocumentEditorService,
    private user: userService
  ) {}

  ngOnInit(): void {
    this.setNavigation(0);
    this.writeForMe = this.fb.group({
      topic: ['', Validators.maxLength(100)],
      context: ['', Validators.maxLength(400)],
      keywords: [[], []],
      keyword: ['', Validators.maxLength(100)],
      tone: [''],
      no_of_chars: [50, []],
      creativity: [3, []],
    });

    this.user.getUser().subscribe((resp) => {
      this.userData = resp;
    });

    if (localStorage.getItem('selectedProject')) {
      let selected = JSON.parse(localStorage.getItem('selectedProject'));
      this.selectedProject = selected.project;
    }

    this.writeForMe.valueChanges.subscribe((value) => {
      this.writeForMeData.emit(value)
    });
  }

  onSearch(term): void {
    this.searchChanged.emit(term);
  }

  getFlag(val: string) {
    return this.langFormats.find((lang) => lang.code == val).flag;
  }

  ngOnChanges(): void {
    if (this.data.text) {
      if (this.data.text === 'write_for_me') {
        this.setNavigation(0);
      } else if (this.data.text === 'ai_tools') {
          this.setNavigation(1);
      }
    }
  }

  setNavigation(i: number): void {
    this.navigation = i;
  }

  submitForm(): void {

    if (this.writeForMe.get('context').value.length !== 0) {

      // if content brief is not null then use the service to generate text
      let data: WriteForMe = {
        input_language: 'en',
        output_language: 'en',
        project_uuid: this.selectedProject,
        tool_uuid: '4ee250ec-aa4c-3ef9-bb7c-857b4a3832e2',
        template_name: 'write_for_me',
        data: [
          {
            key: 'topic',
            value: this.writeForMe.controls['topic'].value,
          },
          {
            key: 'context',
            value: this.writeForMe.controls['context'].value,
          },
          {
            key: 'creativity',
            value: `${this.writeForMe.controls['creativity'].value}`,
          },
          {
            key: 'no_of_chars',
            value: `${this.writeForMe.controls['no_of_chars'].value}`,
          },
          {
            key: 'tone',
            value: `${this.writeForMe.controls['tone'].value}`
          },
          {
            key: 'keywords',
            value: `${this.writeForMe.controls['keywords'].value}`
          }
        ],
      };
      this.isLoading = true;
      this.loading.emit(true);
      this.documentEditorService
        .writeForMe(data)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.loading.emit(false);
          })
        )
        .subscribe((resp) => {
          this.isLoading = false;
          if (resp[0].text != '') {
            this.generatedText.emit({ text: resp[0].text, isLoader: true });
          }
        });
    }
    else {
      this.writeWithContext.emit(this.writeForMe.value)
    }
  }

  submitToolForm(): void {
    this.generationLoading = true;
    let data: Datum[] = [];
    for (let key in this.model) {
      data.push({
        key,
        value: this.model[key],
      });
    }
    this.contentService
      .create({
        input_language: this.inputLanguage ? this.inputLanguage : 'en',
        output_language: this.outputLanguage ? this.outputLanguage : 'en',
        project_uuid: this.selectedProject,
        tool_uuid: this.selectedTool.uuid,
        template_name: this.selectedTool.function_call,
        data,
      })
      .pipe(finalize(() => (this.generationLoading = false)))
      .subscribe((ele) => {
        this.setNavigation(3);
        this.contentList = ele;
      });
  }

  onToolClick(tool: ToolInterface): void {
    this.selectedTool = tool;
    this.setNavigation(2);
    this.toolService
      .detail(tool.uuid)
      .pipe(finalize(() => (this.generationLoading = false)))
      .subscribe((ele) => {
        this.details = ele;
        this.form = new FormGroup({});
        this.model = {};
        this.options = {};
      });
  }

  onContentSelected(text: string): void {
    if (text != '') {
      this.generatedText.emit({ text: text, isLoader: false });
    }
  }

  createKeywordTag(data: any) {
    if (data.key == ',') {
      let keywordTags = [...this.writeForMe.value.keywords, ...this.writeForMe.value.keyword.split(',')]
      this.writeForMe.patchValue({
        keywords: keywordTags[keywordTags.length - 1] == '' ? keywordTags.slice(0, keywordTags.length - 1).map((kT) => kT.trim()) : keywordTags,
        keyword: keywordTags[keywordTags.length - 1]
      })
    }
  }

  keywordTagRemove(index: number) {
    this.writeForMe.controls.keywords.setValue(this.writeForMe.value.keywords.filter((j, i) => i !== index))
  }
}
