import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataBase } from '../in-memory-database';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataBase), // required animations module
  ],
  exports: [
    //SharedModules
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule,
  ]
})
export class CoreModule { }
