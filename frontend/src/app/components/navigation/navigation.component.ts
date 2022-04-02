import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  items: MenuItem[];

  constructor(private router: Router) {
    this.items = [
      {
        label: 'Posts',
        icon: 'pi pi-fw pi-file',
        routerLink: [''],
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        routerLink: ['/profile/me'],
        routerLinkActiveOptions: { exact: false, },
      },
      {
        label: 'Notifications',
        icon: 'pi pi-fw pi-bell',
        routerLink: ['/notifications'],
        routerLinkActiveOptions: { exact: false, },
      }
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

}
