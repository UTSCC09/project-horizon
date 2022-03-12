import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';


import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UploadComponent } from './components/upload/upload.component';
import { SigninComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';

import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InMemoryCache } from '@apollo/client';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SigninComponent,
    HomeComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    HttpClientModule,
    ButtonModule,
    NgbModule,
    ToastModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ApolloModule,

  ],
  providers: [
    MessageService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: InMemoryCache,
          link: httpLink.create({
            uri: 'http://localhost:4000/graphql',
          }),
        };
      },
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
