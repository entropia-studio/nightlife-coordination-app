import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.css']
})
export class ModalContentComponent implements OnInit {

  title: string;
  closeBtnName: string;
  userList: any[] = [];

  constructor(public bsModalRef: BsModalRef) { }  

  ngOnInit() {    
  }

}
