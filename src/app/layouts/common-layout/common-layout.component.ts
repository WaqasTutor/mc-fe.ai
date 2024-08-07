import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable } from "rxjs";
import { distinctUntilChanged, filter, map, startWith } from "rxjs/operators";
import { IBreadcrumb } from "../../shared/interfaces/breadcrumb.type";
import { ThemeConstantService } from '../../shared/services/theme-constant.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
})

export class CommonLayoutComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let screenWidth = event.target.innerWidth;
    if (screenWidth > 1024) {
      this.themeService.toggleFold(false)
    } else if (screenWidth <= 1024 && screenWidth > 992) {
      this.themeService.toggleFold(true)
    }
  }

  breadcrumbs$: Observable<IBreadcrumb[]>;
  contentHeaderDisplay: string;
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;
  selectedHeaderColor: string;

  constructor(private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute, private themeService: ThemeConstantService) {
    // const child: ActivatedRoute = this.activatedRoute.firstChild;
    // console.log(child.data.subscribe(ele => {
    //   console.log(ele)
    // }));
    const appTitle = this.titleService.getTitle();

    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {

          const child = this.activatedRoute.firstChild;

          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
    // if (child.snapshot.data['title']) {
    //   this.titleService.setTitle(child.snapshot.data['title']);
    // }
  }

  ngOnInit() {
    if (window.innerWidth <= 1024 && window.innerWidth > 992) {
      this.themeService.toggleFold(true)
    }
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    this.themeService.selectedHeaderColor.subscribe(color => this.selectedHeaderColor = color);
    this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
  }
}
