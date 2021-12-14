import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;
  lo= 0;

  constructor(public fb: FormBuilder, public alertController: AlertController,
    public navCtrl: NavController) {

    this.formularioLogin = this.fb.group({
      nombre : new FormControl('',Validators.required),
      password : new FormControl('',Validators.required),
    });

  }

  ngOnInit() {
  }

  async ingresar(){
    const f = this.formularioLogin.value;
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if(this.lo===3){
      const alert = await this.alertController.create({
        header: 'Demasiados Intentos',
        message: 'Porfavor espera 10 segundos para intentarlo denuevo',
        buttons: ['ESPERAR 10 SEGUNDOS']
      });
      await alert.present();
      await delay(10000);
      console.log('Pasaron 10s');
      this.lo=0;
    }else if(usuario.nombre === f.nombre && usuario.password === f.password){
      console.log('Ingresar');
      localStorage.setItem('Ingresado','true');
      this.navCtrl.navigateRoot('inicio');
    }else{
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Datos ingresados no son correctos',
        buttons: ['Aceptar']
      });
      if(this.lo<3){
      this.lo=this.lo+1;
      }
      await alert.present();
    }
  }
  async esUser(e){
    const char = String.fromCharCode(e.keyCode);
    if(/^[A-Za-z0-9]+$/.test(char)) {return true;}
    else {e.preventDefault();}
  }
}
const delay = ms => new Promise(res => setTimeout(res, ms));
