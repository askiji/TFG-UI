import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class LoginComponent  implements OnInit {
  loginData: any = {
    username: '',
    password: ''
  };
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login() {
    const url = `${environment.apiUrl}/api/auth/signin`;
    this.http.post<{username: string}>(url, this.loginData).subscribe((res) => {
      // tengo que sacarle el tipo de usuario para que se meta por lo del admin
      if(res.username === 'admin'){
        this.router.navigateByUrl('/admin')
      }
    else if (res.username) {
        this.router.navigateByUrl(`/profesor/${res.username}`);
      }
    }, (error) => {
      console.log(error);
    });
  }
registro(){
  const url= `${environment.apiUrl}/api/auth/singup`;
  this.router.navigateByUrl('/singup');

}
  ngOnInit() {}

}

