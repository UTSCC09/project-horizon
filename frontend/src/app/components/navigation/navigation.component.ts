import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/models/post.model';
import { AuthApiService } from 'src/app/services/api/auth-api.service';
import { UserApiService } from 'src/app/services/api/user-api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  items: MenuItem[];
  results: string[] = [];
  query: string = '';

  constructor(
    private router: Router,
    private userApi: UserApiService,
    private authService: AuthApiService,
  ) {
    this.items = [
      {
        label: 'Posts',
        icon: 'pi pi-fw pi-file',
        routerLink: [''],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Discover',
        icon: 'pi pi-fw pi-search',
        routerLink: ['/discover'],
        routerLinkActiveOptions: { exact: false, },
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/profile/me'],
        routerLinkActiveOptions: { exact: false, },
      },
    ];
  }

  activeRoute(route: string): boolean {
    return this.router.url === route;
  }

  logOut() {
    this.authService.logout()
      .subscribe(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.router.navigate(['/login']);
      });
  }

  search(event: any) {
    this.userApi.searchUser(event.query)
      .subscribe(({data}: any) => {
        const { search } = JSON.parse(JSON.stringify(data));
        this.results = search.map((u: User) => {
          return {
            ...u,
            label: `${u.firstName} ${u.lastName} - ${u.email}`,
          }
        });
      });
  }

  select(event: any) {
    this.router.navigate(['/profile', event.id]);
    this.query = '';
  }
}
