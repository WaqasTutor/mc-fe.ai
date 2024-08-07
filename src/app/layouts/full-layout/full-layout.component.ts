import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { ThemeConstantService } from 'src/app/shared/services/theme-constant.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: './full-layout.component.html'
})

export class FullLayoutComponent {
  fullLayout: boolean = false;
  fullLayoutRoutes = ['Payment Unsuccessful', 'Onboarding', 'Subscription', 'Update Payment Details', 'Maintenance', 'Early Access']
  constructor(private router: Router, private titleService: Title, private activatedRoute: ActivatedRoute, private themeService: ThemeConstantService) {
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
        // TODO remove this. The title should not be used for this
        this.fullLayout = this.fullLayoutRoutes.includes(ttl)
        this.titleService.setTitle(ttl);
      });
  }
}
