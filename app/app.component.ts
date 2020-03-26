import { Component, OnInit, VERSION } from "@angular/core";
import { AppService } from "./app.service";
import { ProgressiveLoader } from "./progressive-loader";
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styles: [
    `
      ngb-progressbar {
        margin-top: 5rem;
      }
    `
  ]
})
export class AppComponent implements OnInit {
  version = "Angular: v" + VERSION.full;

  dispatchAreas = [];

  govArray = [];

  loader: ProgressiveLoader;

  page = 1;
  pageSize = 10;
  collectionSize = this.govArray.length;

  constructor(private appService: AppService) {
    this.loader = new ProgressiveLoader(this.appService);
  }

  ngOnInit() {
    const obs = this.loader.loadDataForAllDispatchAreas()
    obs.subscribe(govData => {
      const records = govData["records"] || [];
      this.govArray = this.govArray.concat(records);
    });
  }

  get dataArray(): any[] {
    return this.govArray
      .map((data, i) => ({id: i + 1, ...data}))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }
}

// https://reqres.in/api/unknown
