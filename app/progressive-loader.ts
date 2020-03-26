import { Observable, of, fromEvent, from, pipe, empty } from 'rxjs';
import { map, delay, concat, tap, switchMap, bufferCount, catchError } from "rxjs/operators";
import { DispatchArea } from "./dispatch-area";
import { AppService } from "./app.service";

export class ProgressiveLoader {
  progressStatus = "warning";
  dispatchAreas = [];
  loadedDispatchAreas = [];
  errorsDispatchAreas = [];
  progressValue = 0;
  observables: Array<Observable<DispatchArea>> = [];
  arrayData = [];

  constructor(private appService: AppService) {
  }

  public loadDataForAllDispatchAreas() {
    const that = this
    this.setProgress();
    const obs = this.appService.getDispatchAreas()
    .pipe(
      tap(data => {
        this.dispatchAreas = data['data'];
        this.setProgress();
        return this.dispatchAreas;
      }),
      map(d => this.getObservables()),
      switchMap(_ => empty()
        .pipe(
          concat(...this.observables)
        )
      ),
      
    );
    return obs;
  }

  public onSuccess(dispatchArea) {
    this.loadedDispatchAreas.push(dispatchArea);
    this.setProgress();
  }

  public onError(dispatchArea) {
    this.errorsDispatchAreas.push(dispatchArea);
    this.setProgress();
  }

  private getObservables() {
    this.observables = [];
    for (const dispatchArea of this.dispatchAreas) {
      this.observables.push(this.appService.getData(dispatchArea, this));
    }
  }

  private setProgress() {
    const numberOfDispatchAreasProcessed =
      this.loadedDispatchAreas.length + this.errorsDispatchAreas.length;
    if (numberOfDispatchAreasProcessed === this.dispatchAreas.length) {
      this.progressValue = 100;
      this.setProgressStatus();
    } else {
      this.progressValue = Math.round(
        (numberOfDispatchAreasProcessed / this.dispatchAreas.length) * 100
      );
      this.setProgressStatus();
    }
  }

  private setProgressStatus() {
    if (this.loadedDispatchAreas.length === 0 && this.errorsDispatchAreas.length === 0) {
       this.progressStatus = 'warning';
    } else if (this.errorsDispatchAreas.length == 0) {
       this.progressStatus = 'success';
    } else {
      this.progressStatus = 'danger';
    }
  }
}
