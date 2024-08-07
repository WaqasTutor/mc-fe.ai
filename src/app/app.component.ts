import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Beamer_pID, crispID, environment, Google_mID, hotJarID, hotJarSV, MIXPANEL_PROJECT_TOKEN } from 'src/environments/environment';
import { MixpanelService } from './shared/services/mixpanel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private mixpanel: MixpanelService) { }
  ngOnInit(): void {
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
    this.crispInit(window, document);
    this.beamerInit(window, document);
    this.mixpanel.init(MIXPANEL_PROJECT_TOKEN, {debug: true, ignore_dnt: true});
    if (environment.production) {
      this.gaInit(window, document);
      this.hotJarInit(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
    }
    var myVar = setInterval(() => {
      if ((document.getElementsByClassName('cc-unoo')[0] as HTMLElement)) {
        (document.getElementsByClassName('cc-unoo')[0] as HTMLElement).setAttribute('style', "display:none !important");
        clearInterval(myVar)
      }
    }, 1000);
  }

  crispInit(w, d) {
    w.$crisp = [];
    w.CRISP_WEBSITE_ID = crispID;
    let s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  }

  beamerInit(w, d) {
    let s = d.createElement("script");
    s.src = "https://app.getbeamer.com/js/beamer-embed.js";
    s.defer = true;
    d.getElementsByTagName("head")[0].appendChild(s);
    w.beamer_config = {
      product_id: Beamer_pID,
    };
  }

  gaInit(w, d) {
    let a = d.getElementsByTagName('head')[0];
    let r = d.createElement('script'); r.async = 1;
    r.src = "https://www.googletagmanager.com/gtag/js?id=" + Google_mID;
    a.appendChild(r);
    w.dataLayer = w.dataLayer || [];
    w.gtag = (...args) => { w.dataLayer.push(args); }
    w.gtag('js', new Date());
    w.gtag('config', Google_mID);
  }

  hotJarInit(h, o, t, j) {
    h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
    h._hjSettings = { hjid: hotJarID, hjsv: hotJarSV };
    let a = o.getElementsByTagName('head')[0];
    let r = o.createElement('script'); r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  }
}
