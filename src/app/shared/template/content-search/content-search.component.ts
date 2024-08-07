import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NzInputGroupComponent } from 'ng-zorro-antd/input';
import { finalize } from 'rxjs/operators';
import { ContentService } from '../../proxy/content/content.service';
import { ContentInterface } from './../../proxy/content/content.interface';

@Component({
  selector: 'app-content-search',
  templateUrl: './content-search.component.html',
  styleUrls: ['./content-search.component.scss'],
  // changeDetection:onCall
})
export class ContentSearchComponent implements OnInit, AfterViewInit {
  contents: ContentInterface[];
  search: any = '';
  @Output() linkClicked = new EventEmitter<boolean>();
  @ViewChild('searchInp') searchInput: ElementRef;
  @ViewChild('searchInpGroup') searchInputGroup: NzInputGroupComponent;
  loading = false;
  
  constructor(private contentService: ContentService, private cdRef: ChangeDetectorRef) { }
  ngOnInit(): void {
  }
  onEnter() {
    this.contents = []
    this.loading = true
    this.contentService.search(this.search).pipe(finalize(() => this.loading = false)).subscribe((contents) => {
      this.contents = contents
    })
  }
  onClick() {
    this.linkClicked.emit(true)
  }
  ngAfterViewInit() {
    this.searchInputGroup.focused = true;
    this.searchInput.nativeElement.focus();
    this.cdRef.detectChanges();
  }
}
