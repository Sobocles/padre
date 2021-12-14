import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  formularioRegistro: FormGroup;
  errorNombre = '';
  constructor(public fb: FormBuilder, public alertController: AlertController,
    public navCtrl: NavController) {
    this.formularioRegistro = this.fb.group({
      nombre: new FormControl('',Validators.required),
      password: new FormControl('',Validators.required),
      confirmacionPassword: new FormControl('',Validators.required)
    });
  }

  ngOnInit() {
  }

  async guardar(){
    const f = this.formularioRegistro.value;
    if(this.formularioRegistro.invalid){
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Tienes que llenar el formulario',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }


    const usuario = {
      nombre: f.nombre,
      password: f.password,
      confirmacionPassword: f.confirmacionPassword
    };

    if(usuario.password !== usuario.confirmacionPassword)
    {
      this.avisarlerta2();
      return;
    }
    localStorage.setItem('usuario',JSON.stringify(usuario));
    localStorage.setItem('Ingresado','true');
    this.avisarlerta();
  };

  async avisarlerta(){
    const alert = await this.alertController.create({
      header: 'Registro Completo',
      message: 'Estos seran tus datos de inicio de sesion',
      buttons: ['Continuar']
    });

    await alert.present();
  }

  async avisarlerta2(){
    const alert = await this.alertController.create({
      header: 'Las contraseñas no coinciden',
      message: 'Asegurate de escribir lo mismo en ambas casillas',
      buttons: ['Aceptar']
    });

    await alert.present();
  }
  async esUser(e){
    const char = String.fromCharCode(e.keyCode);
    if(/^[A-Za-z0-9]+$/.test(char)) {return true;}
    else {e.preventDefault();}
  }
}
