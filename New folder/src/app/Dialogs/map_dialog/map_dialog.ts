import { ElementRef, ViewChild, Component, Inject, EventEmitter, Output } from '@angular/core';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
import { ApiService } from 'app/services/api.service';
import { forEach } from '@angular/router/src/utils/collection';
//declare var google: any;
declare let L;
@Component({
    selector: 'map_dialog',
    templateUrl: './map_dialog.html',
    styleUrls: ['./map_dialog.scss']
})

export class MapDialog {
    lat: number = 20.5937;
    lng: number = 78.9629;
    // labelOptions = {
    //     color: '#CC0000',
    //     fontFamily: '',
    //     fontSize: '14px',
    //     fontWeight: 'bold',
    //     text: 'Some Text',
    //     }
    locations = [];
    constructor(
        public dialogRef: MdDialogRef<MapDialog>,
        @Inject(MD_DIALOG_DATA) public data: any,
        private api_service: ApiService) {
        this.locations = data;
        var lat_lng_locations = this.locations.filter(x => x.location.latitude != "" && x.location.longitude != "" && x.location.latitude != null && x.location.longitude != null);
        if (lat_lng_locations.length > 0) {
            this.lat = parseFloat(lat_lng_locations[0].location.latitude);
            this.lng = parseFloat(lat_lng_locations[0].location.longitude);
        }
        for (var i = 0; i < this.locations.length; i++) {
            if (this.locations[i].location.latitude != null && this.locations[i].location.latitude != "" && this.locations[i].location.longitude != null && this.locations[i].location.longitude != '') {
                this.locations[i].location.latitude = parseFloat(this.locations[i].location.latitude);
                this.locations[i].location.longitude = parseFloat(this.locations[i].location.longitude);
            }
            else {
                this.locations[i].location.latitude = 0;
                this.locations[i].location.longitude = 0;
            }
        }
    }

    ngOnInit() {
        let image_url = 'assets/images/stageDefault.png';
        let satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });
        let street = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
        });
        // Create the map
        var default_coordinates_location = this.locations.filter(x => x.location.latitude != 0 && x.location.longitude != 0)
        var map = null;
        if (default_coordinates_location.length > 0) {
            map = L.map('map', {
                center: [default_coordinates_location[0].location.latitude, default_coordinates_location[0].location.longitude],
                zoom: 12,
                layers: [satelite, street]
            });
        }
        else {

            map = L.map('map', {
                center: [19.0760, 72.8777],
                zoom: 3,
                layers: [satelite, street]
            });
        }

        var baseMaps = {
            "<span style='color: gray'>Satellite</span>": satelite,
            "Map": street
        };
        L.control.layers(baseMaps).addTo(map);
        for (let i of this.locations) {
            let location_name = i.location.name;
            let stage_name = '';
            if (i.current_stage) {
                stage_name = i.current_stage.stage.name;
                if (i.current_stage.stage.id === 1) {
                    image_url = 'assets/images/stage_1.gif';
                }
                else if (i.current_stage.stage.id === 3) {
                    image_url = 'assets/images/stage_2.gif';
                } else if (i.current_stage.stage.id === 4) {
                    image_url = 'assets/images/stage_3.gif';
                } else if (i.current_stage.stage.id === 5) {
                    image_url = 'assets/images/stage_4.gif';
                } else if (i.current_stage.stage.id === 6) {
                    image_url = 'assets/images/stage_5.gif';
                } else if (i.current_stage.stage.id === 7) {
                    image_url = 'assets/images/stage_6.gif';
                } else if (i.current_stage.stage.id === 8) {
                    image_url = 'assets/images/stage_7.gif';
                } else if (i.current_stage.stage.id === 9) {
                    image_url = 'assets/images/stage_8.gif';
                } else if (i.current_stage.stage.id === 10) {
                    image_url = 'assets/images/stage_9.gif';
                }
            } else {
                stage_name = 'Not started';
                image_url = 'assets/images/stage_0.gif';
            }
            let customer = 'Unknown';
            if (i.location.customer != null) {
                customer = i.location.customer.name;
            }
            let model_name = 'Unknown';
            if (i.location.model != null) {
                model_name = i.location.model.name;
            }
            let greenIcon = L.icon({
                iconUrl: image_url,
                iconSize: [100, 100],
                iconAnchor: [40, 60]
            });
            if (i.location.latitude && i.location.longitude) {
                let mark = L.marker([i.location.latitude, i.location.longitude], { icon: greenIcon }).addTo(map);
                mark.bindPopup("Location Name :<b>" + location_name + "</b><br>Stage Name : <b>" + stage_name + "</b><br>Customer Name :<b>" + customer + "</b><br>Model name:<b>" + model_name + "</b>");
            }
        }
    }
    closeDialog() {
        this.dialogRef.close(false);
    }
}
