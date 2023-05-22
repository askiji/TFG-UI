import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule,],
})

export class SingupComponent  implements OnInit {

  // username: any ='';
  // password: any ='';
  // email: any ='';
  registroForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,private toastController: ToastController,private _router: Router) {
    this.registroForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      roles: [ ['user']]
    });
  }
  // constructor(){

  // }
  submitForm() {
    // console.log(this.username , this.email , this.password);
    const url = 'http://localhost:8080/api/auth/signup'
    console.log(this.registroForm.value);
    this.http.post(url ,this.registroForm.value).subscribe(res => {
      this.presentToast('middle' ,"Se ha registrado correctamente")
      this._router.navigateByUrl('/login')
    },
    err => {
this.presentToast('middle', 'No se ha podido registrar')
    });
    // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
  }

  ngOnInit() {}
  async presentToast(position: 'top' | 'middle' | 'bottom' , mensage :any) {
    const toast = await this.toastController.create({
      message: mensage,
      duration: 1500,
      position: position
    });

    await toast.present();
  }
}
