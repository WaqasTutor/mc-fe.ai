import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { userService } from '../../proxy/user/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { UserInterface } from './../../proxy/user/user.interface';
import {filter, map} from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {

  searchVisible: boolean = false;
  quickViewVisible: boolean = false;
  isFolded: boolean;
  isExpand: boolean;
  user: UserInterface;
  isDocumentEditor: boolean = false;
  typeFormOpen = false;
  url = "https://1lz8ahoedmv.typeform.com/to/IAb1KSXH";
  iframeLoading = false;
  constructor(private themeService: ThemeConstantService, private UserService: userService,
    private authenticationService: AuthenticationService, public sanitizer: DomSanitizer, public router: Router,
    private location: Location) {
      this.router.events.subscribe(val => {
        this.isDocumentEditor = this.router.url.includes('documents') && this.router.url.includes('edit')
      })
    }

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
    this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
    this.UserService.getUser()
    this.UserService.currentUser.subscribe(ele => {
      this.user = ele;
    });


    // this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    // map(e => {
    //   console.log('navigation ends')
    // }))
  }

  goBack() {
    this.location.back();
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }
  sensitizeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }

  searchToggle(): void {
    this.searchVisible = !this.searchVisible;
  }

  quickViewToggle(): void {
    this.quickViewVisible = !this.quickViewVisible;
  }
  logout() {
    this.authenticationService.logout();
  }
  ago(date) {
    return moment(date).fromNow()
  }
  notificationList = [
    {
      title: 'You received a new message',
      time: '8 min',
      icon: 'mail',
      color: 'ant-avatar-' + 'blue'
    },
    {
      title: 'New user registered',
      time: '7 hours',
      icon: 'user-add',
      color: 'ant-avatar-' + 'cyan'
    },
    {
      title: 'System Alert',
      time: '8 hours',
      icon: 'warning',
      color: 'ant-avatar-' + 'red'
    },
    {
      title: 'You have a new update',
      time: '2 days',
      icon: 'sync',
      color: 'ant-avatar-' + 'gold'
    }
  ];
  myLoadEvent() {
    console.log('here')
    this.iframeLoading = false;
  }
}
