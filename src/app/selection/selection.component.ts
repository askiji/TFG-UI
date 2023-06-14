import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  results: any = [];
  res : any =[];
  isModalOpen = false;
  profesorSelected: any;
  constructor(private _http: HttpClient, private router: Router, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.peticion();
  }
  peticion(){
    this._http.get(`${environment.apiUrl}/profesores/sinasignar`).subscribe(res => {
      console.log(res);
      this.res = res;
    })
  }
  seleccionar(foo :any){
    console.log(foo)
    this._http.post(`${environment.apiUrl}/profesores/asignar`, foo).subscribe((res: any) =>{
      console.log(res)
      this.isModalOpen = false;
      this.cdRef.detectChanges();
      this.router.navigate(['profesor', res.nombre])
    })

  }
  handleInput(event : any) {
    const query = event.target.value.toLowerCase();
    this.results = this.res.filter((d: any) => d.nombre.toLowerCase().indexOf(query) > -1);
  }

  setOpen(isOpen: boolean, profesor?: any) {
    this.isModalOpen = isOpen;
    this.profesorSelected = profesor;
  }
}
