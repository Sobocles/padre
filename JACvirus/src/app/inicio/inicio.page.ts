import { Component, NgZone, OnInit } from '@angular/core';
import { CallbackID, Capacitor, Plugins} from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController,  } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit{
  coordinate: any;
  watchCoordinate: any;
  watchId: any;
  velme=80; // velocidad en kiloemtros por hora
  km=12.2; //distancia en kilometros
  kilom=0;
  constructor(private zone: NgZone, private alertCtrl: AlertController) { }

  async ngOnInit() {
    await LocalNotifications.requestPermissions();
  }

  async scheduleBasic(){
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'El tren esta a ' + Math.trunc((this.km*1000)/(this.velme*(1000/3600))/60) + ' minutos.  ( ' + this.km + ' )  Km',
          body: 'Atraviesa la via ferrea con precaucion',
          id: 1,
          extra: {
            data: 'Cuidado!'
          },
          iconColor: '#0000FF'
        }
      ]
    });
  }

  async distanciaentre2(){
    const R = 6371.0710;
    const punto1Lat =  -33.37092353976393 * (Math.PI/180);
    const punto1Lon =  -70.69080476199517 * (Math.PI/180);
    const punto2Lat =  -33.445226647486976 * (Math.PI/180);
    const punto2Lon =  -70.6122113969047 * (Math.PI/180);
    const deltaLat = punto2Lat - punto1Lat;
    const deltaLon = punto2Lon - punto1Lon;
    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(deltaLat/2)*Math.sin(deltaLat/2)+Math.cos(punto1Lat)*Math.cos(punto2Lat)*
    Math.sin(deltaLon/2)*Math.sin(deltaLon/2)));
    alert('Esta a ' + Math.trunc(d) + ' Kilometros de distancia.');
    return d;
  }

  async requestPermissions() {
    const permResult = await Geolocation.requestPermissions();
    console.log('Resultado del permiso: ', permResult);
  }

  getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Geolocalizacion no disponible');
      return;
    }
    Geolocation.getCurrentPosition().then(data => {
      this.coordinate = {
        latitude: data.coords.latitude,
        longitude: data.coords.longitude,
        accuracy: data.coords.accuracy
      };
    }).catch(err => {
      console.error(err);
    });
  }

  watchPosition() {
    try {
      this.watchId = Geolocation.watchPosition({}, (position, err) => {
        console.log('Watch', position);
        this.zone.run(() => {
          this.watchCoordinate = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        });
      });
    } catch (e) {
      console.error(e);
    }
  }

  clearWatch() {
    if (this.watchId != null) {
      Geolocation.clearWatch({ id: this.watchId });
    }
  }
}
