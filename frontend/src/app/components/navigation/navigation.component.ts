import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/models/post.model';
import { UserApiService } from 'src/app/services/api/user-api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  items: MenuItem[];
  results: string[] = [];

  constructor(
    private router: Router,
    private userApi: UserApiService
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

  ngOnInit(): void {
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
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
  }
}
