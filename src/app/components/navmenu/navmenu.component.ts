import { Component, OnInit, TemplateRef } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { LoginComponent } from 'src/app/components/login/login.component';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  modalRef: BsModalRef;
  user: User;

  constructor(
    private modalService: BsModalService,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.auth.navState$.subscribe( (user)=> {
      this.user = user;             
    });   

    this.afAuth.user.subscribe((state) => {            
      if (state && !this.user){        
        this.user = {id: state.uid, email: state.email};
        this.auth.navStateSource.next(this.user);
      }            
    })    
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(LoginComponent);
  }

  logOut(){
    this.auth.logout();
  }


}
