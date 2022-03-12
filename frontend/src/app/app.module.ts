import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UploadComponent } from './components/upload/upload.component';
import { SignInComponent } from './components/signIn/signIn.component';
import { RegisterComponent } from './components/register/register.component';
import { NavigationComponent } from './components/navigation/navigation.component';

import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SignInComponent,
    HomeComponent,
    RegisterComponent,
    NavigationComponent,
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
    MenubarModule,
    ApolloModule,
    DynamicDialogModule,
    InputTextareaModule,
    FormsModule,
  ],
  providers: [
    MessageService,
    DialogService,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        return {
          cache: new InMemoryCache(),
          link: new ApolloLink((opp, forward) => {
            const token = localStorage.getItem('token');
            if (token) {
              opp.setContext({
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            }
            return forward(opp);
          }).concat(
            httpLink.create({
              uri: 'http://localhost:3000/graphql',
          })),
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
