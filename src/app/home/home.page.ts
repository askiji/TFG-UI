import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { FormsModule } from '@angular/forms'; // Importa el módulo FormsModule
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})

export class HomePage implements OnInit {
  header: any[][]=[
    [' ', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
  ];
  data: any = [];
  datosProfesores: any = {};
  showCalendar = false;
  fechaAusencia! : any;
  altura = '600px';
  isModalOpen = false;
  profesoresDeGuardia= "";
  guardiastTemp:any= [];
  guardiasDeProfesores : any =[];
  realName: string = '';


  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createCalendar();
    this.queryTeacher();
    this.getProofesores();
  }
  getProofesores(){
    this.http.get( `${environment.apiUrl}/profesor/guardias`).subscribe((res : any) => {
      console.log(res);
      this.datosProfesores = res.data;
    } );
  }
  asegurarGuardia(guardia : any){
    if(guardia.nombreSuplente ){
      this.eliminarGuardia(guardia);
      return;
    }
    this.http.post(`${environment.apiUrl}/ausencia/update`, guardia).subscribe(() => {
      this.presentToast("Se le ha asignado como suplente")
      this.isModalOpen = false;
      guardia.nombreSuplente = this.route.snapshot.paramMap.get('teacher');
    });


  }
  eliminarGuardia(guardia : any){
    guardia.nombreSuplente = null;
    this.http.post(`${environment.apiUrl}/ausencia/update`, guardia).subscribe(() => {
      this.presentToast("Se le ha desasignado como suplente")
      this.isModalOpen = false;
    });

  }
  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  getHeight() {
    setTimeout(() => {
      if (document.body.scrollHeight > 0) {
        this.altura = document.body.scrollHeight + 'px';
      }

    }, 500);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(event.target.innerWidth);
    this.altura = document.body.scrollHeight + 'px';
  }

  queryTeacher() {
    const nombre = this.route.snapshot.paramMap.get('teacher');

    this.http.get<{nombre: string, data: any; id: string}>(`${environment.apiUrl}/profesores/${nombre}`).subscribe(result => {
      if(result){

        this.realName = Object.keys(result.data)[0];
        Object.keys(result.data).forEach((element, index) => {
          if (index == 0) {
            this.mapHorario(result, element)
          }

          this.mapAsignaturas(result, element, index);
          this.getHeight();

        });
      }
      else{
        this.router.navigateByUrl(`/selecion`)
      }

    })
  }

  mapHorario(result: any, element: any) {
    for(let k =0 ; k < Object.keys(result.data[element]).length; k++){
      //if(!this.data[k][0]) this.data[k][0] ="recreo"
      if(k!=0) {
        this.data[k-1][0] = result.data[element][k] ? result.data[element][k] : 'recreo';
      }
    }
  }

  esElProfesor(str1: string) {
    let str2 = str1.split(" ");
    let str3 =this.realName.split(" ");
    let count = 0;
    str2.forEach(element => {
      if(str3.includes(element)){
        count++;

      }
    });

    return count >2 ;
  }

  mapAsignaturas(result: any, element: any, i: number) {
    const map: any = {
      "Lunes": 1,
      "Martes": 2,
      "Miércoles": 3,
      "Jueves": 4,
      "Viernes": 5
    }


    Object.keys(result.data[element]).forEach((asignature, j) => {
      if(j==0) return;
      this.data[j-1][map[element]] = result.data[element][asignature]
      if (this.data[j-1][map[element]] && this.data[j-1][map[element]].toLowerCase().indexOf('guardia') > -1) {
        this.http.get<any>(`${environment.apiUrl}/ausencia/${map[element]}`).subscribe(ausencias => {
          console.log('asencias', ausencias);

          if(ausencias.length > 0){
            var text :any ="";
            ausencias.forEach((element : any) => {

              if (this.guardiastTemp[j-1][i]) {
                this.guardiastTemp[j-1][i].push({
                  id: element.id,
                  fecha: element.fecha,
                  nombre: element.nombre,
                  clase: element.clases[j-1],
                  nombreSuplente : element.nombreSuplente
                });
              } else {
                this.guardiastTemp[j-1][i] = [{
                  id: element.id,
                  fecha: element.fecha,
                  nombre: element.nombre,
                  clase: element.clases[j-1],
                  nombreSuplente : element.nombreSuplente
                }];
                debugger
              }

              console.log('gg', this.guardiastTemp);
              text = text + element.clases[j-1] + `${element.nombreSuplente ? ' (' + element.nombreSuplente + ')' : ''}`;

            });
            if(text != 'null'){

              const cell = `<div class="click" style="background-color: greenyellow !important; color: black; " >${text}</div>`;
              this.data[j-1][map[element]] = this.sanitizer.bypassSecurityTrustHtml(cell);
            }
          }
        });
      }
    })
  }

  show(cell?: any, i?: any, j?:any) {

    if (cell.changingThisBreaksApplicationSecurity && cell.changingThisBreaksApplicationSecurity.toString().indexOf('click') > -1) {
      const map : any ={
        "1":"LUNES",
        "2" :"MARTES",
        "3" :"MIÉRCOLES",
        "4" : "JUEVES",
        "5": "VIERNES"
      }
      this.profesoresDeGuardia = this.datosProfesores[map[j]][i].split(")").filter((profe:string) => profe.length > 1);
      console.log();

      this.guardiasDeProfesores= this.guardiastTemp[i][j]
      this.setOpen(true);
    }

  }

  createCalendar() {
    for (let i =0 ; i < 17 ; i++){
      this.data.push([])
      this.guardiastTemp.push([])
      for(let j = 0 ; j< 6; j++ ){
        this.data[i][j]="-";
      }
    }
  }

  calendario() {
    this.showCalendar = !this.showCalendar;

  }
  onFechaAusenciaChange(event: any){

    console.log('Fecha seleccionada:', event);

  }
  onCancel() {
    console.log('Se hizo clic en el botón de Cancelar');
    this.showCalendar = !this.showCalendar;
  }
  onChange(event : any) {
    console.log('Se seleccionó la fecha:', event.detail.value);
    this.fechaAusencia= event.detail.value;
    this.showCalendar = !this.showCalendar;
    this.enviarFecha();
  }
  enviarFecha(){
    const daysOfWeek = ['Domingo', '1', '2', '3', '4', '5', 'Sábado'];
    const today = new Date(this.fechaAusencia);
    const dayOfWeekName = daysOfWeek[today.getDay()];
    console.log(dayOfWeekName);
    let classes: any = [];
    this.data.forEach((elem : any, index: any) => {classes.push(this.data[index][dayOfWeekName])})
    console.log(classes)
    this.http.post(`${environment.apiUrl}/ausencia`, {
      nombre: this.route.snapshot.paramMap.get('teacher'),
      fecha : new Date(this.fechaAusencia).getTime(),
      clases: classes
    }).subscribe((res) => {
      this.presentToast('Su asuencia OK')
    }, (err) => {
      this.presentToast('No se ha podido guardar la ausencia');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
      position: 'middle'
    });

    await toast.present();
  }
}
