import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors} from '@angular/forms';




interface User{
  email: string,
  password: string,
  cpassword?: string
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(    
    private modalRef: BsModalRef,
    private fb: FormBuilder
  ) {}

  public user: User = {      
    email: '',
    password: '',
    cpassword: ''
  };

  ngOnInit() {        
  } 

  passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const cpassword = control.get('cpassword');    
    return password && cpassword && password.value !== cpassword.value ? { 'passwordNotEqual': true } : null;
  };

  registerForm = this.fb.group({
    'email': ['', Validators.email],
    'passwords': this.fb.group({
      'password': ['', Validators.required],
      'cpassword': ['', Validators.required],
    },{validator: this.passwordMatchValidator})    
  });

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('passwords.password'); }
  get cpassword() { return this.registerForm.get('passwords.cpassword'); }
  get passwords() { return this.registerForm.get('passwords'); }  

  save(f: User, isValid: boolean) {

  }

}
