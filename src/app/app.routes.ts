import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthGuard } from './@core/auth-guard';
import { AppComponent } from './app.component';
import { SingupComponent } from './singup/singup.component';


export const routes: Routes = [
  {
    path: 'profesor/:teacher',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'singup',
    loadComponent: () => import('./singup/singup.component').then((m) => m.SingupComponent)
  },
  {
    path: 'selecion',
    loadComponent: () => import('./selection/selection.component').then((m) => {
      return m.SelectionComponent
    })

  },
];
