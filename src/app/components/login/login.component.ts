import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { FormGroup, Validators, FormBuilder, ValidatorFn, ValidationErrors} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../interfaces/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor(    
    private modalRef: BsModalRef,
    private fb: FormBuilder,    
    private auth: AuthService,
  ) {}  
  
  user: User;
  error: string;
  errorLogin: string;
  

  ngOnInit() {        
  } 

  passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const cpassword = control.get('cpassword');    
    return password && cpassword && password.value !== cpassword.value ? { 'passwordNotEqual': true } : null;
  };

  // To compare the equality of the passwords we must pass validator not validators (like Google says)
  registerForm = this.fb.group({
    'email': ['', Validators.email],
    'passwords': this.fb.group({
      'password': ['', Validators.required],
      'cpassword': ['', Validators.required],
    },{validator: this.passwordMatchValidator})    
  });

  loginForm = this.fb.group({
    'emailLogin': ['', Validators.email],
    'passwordLogin': ['', Validators.required],    
  });

   

  registerUser(){
    let email = this.registerForm.get('email').value;
    let password = this.registerForm.get('passwords.password').value;        

    this.auth.emailSignup(email,password).then(() => {                  
      this.modalRef.hide();
    })
    .catch(error => {
      this.error = error;      
    }); 
  }

  loginUser(){
    let email = this.loginForm.get('emailLogin').value;
    let password = this.loginForm.get('passwordLogin').value;        
    
    this.auth.login(email,password).then(() => {
      this.modalRef.hide();
    })
    .catch(error => {
      this.errorLogin = error;            
    }); 
  }

  // Necessary for the template to access the values
  get email() { return this.registerForm.get('email'); }
  get emailLogin() { return this.loginForm.get('emailLogin'); }
  get password() { return this.registerForm.get('passwords.password'); }
  get passwordLogin() { return this.loginForm.get('passwordLogin'); }
  get cpassword() { return this.registerForm.get('passwords.cpassword'); }
  get passwords() { return this.registerForm.get('passwords'); } 

}
