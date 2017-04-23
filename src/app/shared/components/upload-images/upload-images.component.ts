import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToursService} from "../../services/tours.service";
import * as firebase from "firebase"

@Component({
  selector: 'app-upload-images',
  templateUrl: './upload-images.component.html',
  styleUrls: ['./upload-images.component.scss']
})
export class UploadImagesComponent implements OnInit {
  public fileForm:FormGroup;
  mainPhotoFile;
  file;

  constructor(public fb:FormBuilder,
              public toursService:ToursService) { }

  ngOnInit() {

  }

  onUploadfFile(event) {
    console.log("event",event);
    this.mainPhotoFile = event;
    this.file = event.srcElement.files[0]

  }

  saveFiles(){
    firebase.storage().ref('firstFile/Fav-(Star).png').getDownloadURL().then((resp)=>{
      console.log('resp',resp)
    })
    // this.toursService.saveFile().ref('firstFile').child(this.file.name).put(this.file).then(function(snapshot) {
    //   // console.log('snapshot',snapshot.a.fullPath)
    // });

  }

}
