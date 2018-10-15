import { Component, OnInit, TemplateRef} from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LoginComponent } from './components/login/login.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{  
  modalRef: BsModalRef;
  title = 'Nightlife Coordination Life';    

  constructor(
    private modalService: BsModalService,
    ){}

  ngOnInit(){     
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(LoginComponent);
  }

}
