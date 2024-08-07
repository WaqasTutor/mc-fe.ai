import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})

export class MaintenanceComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.url.pipe(map(url => this.mode = url.join(''))).subscribe()
  }

  mode: string = modeTypes.MAINTENANCE;
}

enum modeTypes {
    MAINTENANCE = 'maintenance',
    EARLY_ACCESS = 'early-access'
}