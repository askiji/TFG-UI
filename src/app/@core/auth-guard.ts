import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private http: HttpClient
    ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    // Aquí puedes agregar la lógica para determinar si el usuario tiene acceso o no a la ruta protegida
    this.http.get(`${environment.apiUrl}/expired`).subscribe(() => {}, () => {
      return this.router.navigateByUrl('/login');
    });

    return true;
  }
}
