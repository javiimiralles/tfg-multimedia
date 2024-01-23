import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent  implements OnInit {

  currentStep: number = 3;
  totalSteps: number = 7;
  progressValue: number = this.currentStep/this.totalSteps;
  buttonDisabled: boolean = true;

  selectedSexo: string;

  step1Form = this.formBuilder.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    repeatPassword: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private toastService: ToastService) {}

  ngOnInit() {}

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.progressValue = this.currentStep / this.totalSteps;
    }
  }

  previousStep() {
    this.currentStep--;
    this.progressValue = this.currentStep / this.totalSteps;
  }

  selectSexo(sexo: string) {
    this.selectedSexo = sexo;
  }

  validate() {
    switch(this.currentStep) {
      case 1:
        this.validateStep1();
        break;
      case 2:
        if(this.selectedSexo != null) this.nextStep();
        break;
      default:
        return;
    }

  }

  validateStep1() {
    const email = this.step1Form.get('email').value;
    const password = this.step1Form.get('password').value;
    const repeatPassword = this.step1Form.get('repeatPassword').value;

    if(password !== repeatPassword) {
      this.toastService.presentToast('Las contraseñas no coinciden', 'danger');
      return;
    }

    this.usuariosService.getUserByEmail(email).subscribe(res => {
      if(res['usuario'] != null) {
        this.toastService.presentToast('El email ya está en uso', 'danger');
        return;
      } else {
        this.nextStep();
      }
    }, (err) => {
      console.log(err);
      const msg: string = err.error.msg || err.error.errores.email.msg || 'Ha ocurrido un error, inténtelo de nuevo';
      this.toastService.presentToast(msg, 'danger');
    })
  }

}
