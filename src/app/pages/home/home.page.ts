import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertController } from '@ionic/angular';
import { NominatimService } from '../../services/nominatim.service';
import { NominationResponse } from '../../interfaces/nominatim-response';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage{

  @ViewChild(IonModal) modal: any;
  map: any;
  public name = '';
  public lastname = '';
  public lat = 0.000;
  public long = 0.000;

  constructor(private alertCtrl: AlertController, private nominatimService: NominatimService) { }

  ionViewDidEnter() {
    this.map = L.map('mapId').setView([18.4511009, -69.6642079], 16.71);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }


  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(null, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.markPoint();
    }
  }

  async markPoint() {
    if(this.name == '' || this.lastname == '' || this.lat == 0 || this.long == 0) {
      this.presentAlert();
      return;
    }
    await this.nominatimService.getDataInfo(this.lat, this.long).subscribe((data: NominationResponse) => {
      this.mapMark(data.address.country);
    });
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      subHeader: 'Campos Vacios',
      message: 'No puedes dejar ningun campo vacio',
      buttons: ['OK'],
    });
    await alert.present();
  }

  mapMark(dataPlace: string){
    const marker = L.marker([this.lat, this.long]).addTo(this.map)
      .bindPopup(`${this.name} ${this.lastname} <br/> <b>${dataPlace}</b>`)
      .openPopup();
    this.map.addLayer(marker)
  }

}
