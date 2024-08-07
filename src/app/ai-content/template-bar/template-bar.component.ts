import { Component, Input, OnInit } from '@angular/core';
import { SearchPipe } from 'src/app/shared/pipes/search.pipe';
import { ToolInterface } from 'src/app/shared/proxy/tools/tool.interface';

@Component({
  selector: 'app-template-bar',
  templateUrl: './template-bar.component.html',
  styleUrls: ['./template-bar.component.scss'],
  providers: [SearchPipe]
})
export class TemplateBarComponent implements OnInit {
  search: string = '';
  toolTags: string[] = [];
  tTags: string[] = [];
  actived: boolean = false;
  @Input() tools: ToolInterface[];
  @Input() toolId: string;
  constructor(private searchPipe: SearchPipe) { }

  ngOnInit(): void {
    this.tools.forEach(tool => {
      for (let category of tool.categories) {
        if (!this.toolTags.includes(category.name)) {
          this.toolTags.push(category.name);
        }
      }
      this.tTags = this.toolTags
    })
  }

  tFilter(search: string) {
    this.actived = false;
    this.toolTags = search ? this.tTags.filter(tTag =>
      this.searchPipe.transform(this.categoryTools(tTag), 'name', search).length !== 0) :
      this.tTags;
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
  checkActive(toolTag: string) {
    let t = this.tools.find((tool) => tool.uuid === this.toolId).categories.map(({ name }) => name).includes(toolTag);
    if (t && !this.actived) { this.actived = true }
    return t
  }
}
