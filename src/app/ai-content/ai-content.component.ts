import { AfterViewInit, Component, ElementRef, OnInit, OnChanges, SimpleChanges, ViewChild, DoCheck } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ClipboardService } from 'ngx-clipboard';
import { finalize } from 'rxjs/operators';
import { ToolInterface } from '../shared/proxy/tools/tool.interface';
import { ToolService } from './../shared/proxy/tools/tool.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../shared/proxy/content/content.service';
import { ContentInterface, Datum } from '../shared/proxy/content/content.interface';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThemeConstantService } from '../shared/services/theme-constant.service';
import { ProjectService } from './../shared/proxy/project/project.service';
import LangFormats from 'src/assets/lang.json';
import { FormlyFormOptions } from '@ngx-formly/core';
import { ProjectInterface } from '../shared/proxy/project/project.interface';
import { FeedbackService } from '../shared/proxy/feedback/feeback.service';
@Component({
  selector: 'app-ai-content',
  templateUrl: './ai-content.component.html',
  styleUrls: ['./ai-content.component.scss']
})
export class AiContentComponent implements OnInit, AfterViewInit {
  @ViewChild('mainHeight') elementView: ElementRef;
  inputLanguage: string = "en";
  outputLanguage: string = "en";
  langFormats: any[] = LangFormats;

  emptyContentsMessage: string = 'Input your product details and hit the Generate button to see magic here';
  emptyHistoryMessage(): string {
    return `No previous content history for ${this.details?.name} in ${this.selectedProject?.name} folder.`
  };

  visible = false;
  tab = 0;
  sideBarLoading: boolean = false;
  detailLoading: boolean = false;
  generationLoading: boolean = false;
  historyLoading: boolean = false;
  contentRating: number = 0;
  tooltips = ['Very Bad', 'Bad', 'Average', 'Good', 'Very Good'];
  toolId: string;

  selectedProject: ProjectInterface;

  contents: ContentInterface[];
  history: ContentInterface[];


  details: ToolInterface;
  tools: ToolInterface[];

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  model = {};

  constructor(private clipboardApi: ClipboardService,
    private toolService: ToolService, private contentService: ContentService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sideBarService: ThemeConstantService,
    private projectService: ProjectService,
    private message: NzMessageService,
    private feedBack: FeedbackService) { }

  ngOnInit(): void {
    this.sideBarLoading = true;
    this.toolService.list().pipe(finalize(() => this.sideBarLoading = false)).subscribe(ele => {
      this.tools = ele;
    });
    this.projectService.projectSelectedObservable.subscribe((project => {
      this.selectedProject = project;
      this.tab == 1 && this.loadHistory()
    }));
    this.activatedRoute.params.subscribe(ele => {
      this.contents = null;
      this.history = null;
      this.toolId = ele.id;
      this.visible = false;
      this.tab = 0;
      this.detailLoading = true;
      this.toolService.detail(ele.id).pipe(finalize(() => this.detailLoading = false)).subscribe(ele => {
        if(ele.uuid == null) {
          this.router.navigate(['/tools']);
        } else {
          this.details = ele;
          this.form = new FormGroup({});
          this.model = {};
          this.options = {};
        }
      });
    });
  }

  searchToggle() {
    this.projectService.showDrawer()
  }

  getFlag(val: string) {
    return this.langFormats.find((lang) => lang.code == val).flag
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.sideBarService.isMenuFolded.valueOf()) {
        this.sideBarService.toggleFold(true);
      }
    }, 1000)
  }

  close() {
    this.visible = false;
  }

  copyContent(content) {
    this.clipboardApi.copyFromContent(content)
  }

  submitForm() {
    this.generationLoading = true;
    let data: Datum[] = [];
    for (let key in this.model) {
      data.push({
        key,
        value: this.model[key]
      })
    }
    this.contentService.create({
      input_language: this.inputLanguage,
      output_language: this.outputLanguage,
      project_uuid: this.projectService.projectSelectedSubject.value.uuid,
      tool_uuid: this.toolId,
      template_name: this.details.function_call,
      data
    }).pipe(finalize(() => this.generationLoading = false)).subscribe(ele => {
      this.contents = ele;
    });
  }

  sendFeedback(score: number) {
    this.feedBack.sendFeedback({
      activity_id: this.contents[0].activity_uuid,
      score: score
    }).subscribe(({ message }) => {
      this.message.success(message)
    })
  }

  loadHistory() {
    this.historyLoading = true;
    this.contentService.list(
      {
        projectId: this.selectedProject.uuid,
        toolId: this.toolId
      }
    ).pipe(finalize(() => this.historyLoading = false)).subscribe(ele => {
      this.history = ele;
    })
  }

  removeItem(type: string, uuid: string) {
    switch (type) {
      case 'history':
        this.history = this.history.filter(item => item.uuid !== uuid)
      case 'contents':
        this.contents = this.contents.filter(item => item.uuid !== uuid)
    }
  }
}
