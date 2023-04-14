import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
})

export class SingupComponent  implements OnInit {

  // username: any ='';
  // password: any ='';
  // email: any ='';
  registroForm: FormGroup;
  
  constructor(private formBuilder: FormBuilder) {
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
    console.log(this.registroForm.value)
    // Aquí puedes agregar la lógica para enviar los datos del formulario al servidor
  }

  ngOnInit() {}

}
