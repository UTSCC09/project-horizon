// Angular Core
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, Operation, RequestHandler } from '@apollo/client/core';
import { extractFiles } from "extract-files";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { onError } from 'apollo-link-error';

// Components
import { UploadComponent } from './components/upload/upload.component';
import { SignInComponent } from './components/signin/signin.component';
import { RegisterComponent } from './components/register/register.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { CommentComponent } from './components/comment/comment.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NewPostComponent } from './components/new-post/new-post.component';

// Pipes
import { FileSizePipe } from './pipes/file-size.pipe';
import { NgPipesModule } from 'ngx-pipes';

// External Modules
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { environment } from 'src/environments/environment';
import { PostComponent } from './components/post/post.component';
import { MenuModule } from 'primeng/menu';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ColorPickerModule } from 'primeng/colorpicker';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SliderModule } from 'primeng/slider';

// External Libraries
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    SignInComponent,
    HomeComponent,
    RegisterComponent,
    NavigationComponent,
    PostListComponent,
    ProfileComponent,
    PostComponent,
    FileSizePipe,
    UserListComponent,
    CommentComponent,
    CommentListComponent,
    LoaderComponent,
    NewPostComponent,
  ],
  imports: [
    AutoCompleteModule,
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    DialogModule,
    HttpClientModule,
    ButtonModule,
    NgbModule,
    ToastModule,
    BrowserAnimationsModule,
    TagModule,
    ReactiveFormsModule,
    MenubarModule,
    ApolloModule,
    DynamicDialogModule,
    InputTextareaModule,
    FormsModule,
    MenuModule,
    SelectButtonModule,
    FontAwesomeModule,
    TooltipModule,
    TableModule,
    ColorPickerModule,
    TabViewModule,
    CheckboxModule,
    DataViewModule,
    ProgressSpinnerModule,
    NgPipesModule,
    OverlayPanelModule,
    SliderModule,
  ],
  providers: [
    MessageService,
    DialogService,
    FileSizePipe,
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
              uri: `${environment.apiUrl}/graphql`,
              extractFiles,
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
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
