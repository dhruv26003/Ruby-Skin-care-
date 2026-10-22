import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly router = inject(Router);
  public readonly isAdminRoute = signal<boolean>(false);

  constructor() {
    this.updateRoute(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateRoute(event.urlAfterRedirects || event.url);
      }
    });
  }

  private updateRoute(url: string): void {
    const isAdm = !!url && (url.startsWith('/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')));
    this.isAdminRoute.set(isAdm);
  }
}
