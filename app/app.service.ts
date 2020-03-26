import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { DispatchArea } from "./dispatch-area";
import { ProgressiveLoader } from "./progressive-loader";

@Injectable({ providedIn: "root" })
export class AppService {
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  };

  constructor(private http: HttpClient) {}

  /** GET heroes from the server */
  getDispatchAreas(): Observable<DispatchArea[]> {
    return this.http.get<DispatchArea[]>("https://reqres.in/api/unknown").pipe(
      tap(_ => console.log("fetched DispatchArea")),
      catchError(this.handleError<DispatchArea>(`getDispatchAreas`))
    );
  }

  getData(
    dispatchArea: DispatchArea,
    loader: ProgressiveLoader
  ): Observable<any[]> {
    const url =
      "https://api.data.gov.in/resource/3fd7957b-4071-4548-9d3c-89f461e0bce4?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&offset=" +
      10 * (dispatchArea.id - 1) +
      "&limit=10";
    return this.http.get<any[]>(url).pipe(
      tap(_ => {
        loader.onSuccess(dispatchArea);
        return _;
      }),
      catchError((operation = "operation", result) => {
        return (error: any) => {
          loader.onError(dispatchArea);
          // TODO: send the error to remote logging infrastructure
          console.error(error); // log to console instead

          // TODO: better job of transforming error for user consumption
          console.error(`${operation} failed: ${error.message}`);

          // Let the app keep running by returning an empty result.
          return of(result);
        };
      })
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
