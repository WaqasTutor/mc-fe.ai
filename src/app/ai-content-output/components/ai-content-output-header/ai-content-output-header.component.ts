import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProjectInterface } from 'src/app/shared/proxy/project/project.interface';
import { ProjectService } from 'src/app/shared/proxy/project/project.service';
import { ToolService } from 'src/app/shared/proxy/tools/tool.service';

@Component({
  selector: 'app-ai-content-output-header',
  templateUrl: './ai-content-output-header.component.html',
  styleUrls: ['./ai-content-output-header.component.scss']
})
export class AiContentOutputHeaderComponent implements OnInit {
  search: any;
  modalShow: boolean;
  searchVisible: boolean;
  selectedProject: ProjectInterface;
  toolTags = [];
  tools = [];
  @Input() showBtn: boolean;
  @Input() heading: string;
  @Output() modalState: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() searchStr: EventEmitter<any> = new EventEmitter();
  constructor(private projectService: ProjectService, private toolService: ToolService) {
    this.projectService.projectSelectedObservable.subscribe(project => this.selectedProject = project)
    this.projectService.showDrawerObservable.subscribe(state => this.searchVisible = state)
  }

  ngOnInit(): void {
    this.toolService.list().subscribe(ele => {
      this.tools = ele;
      ele.forEach(tool => {
        for (let category of tool.categories) {
          if (!this.toolTags.includes(category.name)) {
            this.toolTags.push(category.name);
          }
        }
      })
    })
  }

  categoryTools(toolTag: string) {
    return this.tools.filter(
      (tool) => {
        for (let category of tool.categories) {
          if (toolTag == category.name) {
            return true;
          }
        }
        return false;
      }
    )
  }

  searchChanged(e) {
    this.searchStr.emit(e);
  }
  btnClick(e) {
    this.modalShow = !this.modalShow;
    this.modalState.emit(e)
  }
  searchToggle(): void {
    if (!this.searchVisible) {
      this.projectService.showDrawer();
    } else {
      this.projectService.hideDrawer();
    }
  }
}
