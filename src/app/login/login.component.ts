import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    const url = 'http://localhost:8080/api/auth/signin';
    this.http.post<{username: string}>(url, this.loginData).subscribe((res) => {
      if (res.username) {
        this.router.navigateByUrl(`/profesor/${res.username}`);
      }
    }, (error) => {
      console.log(error);
    });
  }
registro(){
  const url= "http://localhost:8080/api/auth/singup";
  this.router.navigateByUrl('/singup');
 
}
  ngOnInit() {}

}

