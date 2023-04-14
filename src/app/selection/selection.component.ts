import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
  standalone: true,
  imports:[IonicModule,CommonModule]
})
export class SelectionComponent  implements OnInit {

  res : any =[];
  constructor(private _http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.peticion();
  }
  peticion(){
    this._http.get(`${environment.apiUrl}/profesores/sinasignar`).subscribe(res => {
      console.log(res);
      this.res = res;
    })
  }
  selecionar(foo :any){
    console.log(foo.id)
    this._http.post(`${environment.apiUrl}/profesores/asignar`, foo).subscribe((res: any) =>{
      console.log(res)
      this.router.navigateByUrl('/profesor/' + res.nombre)
    })

  }
}
