import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule,ReactiveFormsModule],
})
export class AdminComponent  implements OnInit {

  results: any = [];
  isModalOpen = false;
  profesorSeleccionado : any;
  passwordForm: FormGroup;

  constructor(private router: Router,
    private _http: HttpClient,
    private _router: Router,
    ) { this.passwordForm = new FormGroup({

      'password': new FormControl(null, Validators.required)
    })}

  ngOnInit() {
    this.peticion();

  }

  peticion(){
    // esto alomejor lo he duplicado
    this._http.get(`${environment.apiUrl}/admin`).subscribe(results => {
      console.log(results);
      this.results = results;
    })
  }
  onIonInfinite(ev : any) {
    // this.peticion();
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 500);
  }
  setOpen(isOpen: boolean , profesor? : any) {
    this.isModalOpen = isOpen;
    this.profesorSeleccionado = profesor;
    debugger
  }
  onSubmit() {
    const url = `${environment.apiUrl}/api/auth/cambio`
    console.log(this.passwordForm.value , this.profesorSeleccionado);
    debugger
    this._http.post(url ,{ password: this.passwordForm.value.password, profesor: this.profesorSeleccionado}).subscribe(() => {
      this.isModalOpen = false;
    })
  }
  cerrarSesion(){
    const url = `${environment.apiUrl}/api/auth/signout`
    this._http.post(url , this.profesorSeleccionado ).subscribe(    response => {
      console.log('La sesión ha sido cerrada con éxito');
      // Aquí puedes realizar acciones luego de un cierre de sesión exitoso, como redirigir al usuario a la página de inicio.
      this._router.navigateByUrl('/login')
    },
    error => {
      console.error('Hubo un error al intentar cerrar la sesión', error);
      // Aquí puedes manejar los errores, por ejemplo mostrando un mensaje de error al usuario.
    });
  }
}
