import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services';
import { ToastService } from 'src/app/components/generic-components/toast';
import { FormValidatorErrors } from 'src/app/utils/validators/errors.validators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public currentYear = new Date();

  public loginForm: FormGroup;
  public loadingLogin: boolean;
  public buttonLogin: string;


  constructor(private fb: FormBuilder,
    private route: Router,
    private authService: AuthService,
    private formValidatorErrors: FormValidatorErrors,
    private toastService: ToastService) {
    this.route.config[0].children[0].redirectTo = 'login'


    if (this.authService.isLoggedIn()) {
      this.route.navigate(['home']);
      return;
    }

  }

  ngOnInit() {

    this.loadingLogin = false;
    this.buttonLogin = 'Entrar';


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public login() {

    this.formValidatorErrors.getFormValidationErrors(this.loginForm);

    if (this.loginForm.valid) {
      this.loadingLogin = true;
      this.buttonLogin = 'Entrando';

      this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe(
          (res) => {
            this.toastService.show({
              text: `Bem vindo, ${res.user.name}`,
              type: 'success'
            });

            this.loadingLogin = false;
            this.buttonLogin = 'Entrar';

            const token: string = JSON.stringify({ token: res.token, timeLogin: new Date().getTime() });
            this.authService.createTokenData(token);
            this.authService.createUserData(JSON.stringify(res.user));

            this.route.navigate(['home']);
          },
          () => {
            this.loadingLogin = false;
            this.buttonLogin = 'Entrar';
          });
    }
  }

  public goToRegister() {
    this.route.navigate(['./register'])
  }

}
