import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';

import { AppService } from './app.service';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, NgbModule, NgbPaginationModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers: []
})
export class AppModule { }
