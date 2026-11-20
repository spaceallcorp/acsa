import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
declare var UIkit: any;

@Component({
  selector: 'app-contacto',
  imports: [TranslatePipe, CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  isSubmitting: boolean = false;

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  contactForm: FormGroup;
  constructor(private translate: TranslateService, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      region: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      message: ['', Validators.required, Validators.minLength(10)],
      angolaCables: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{7,15}$/)]], // telefone obrigatório
    });
  }

  submitForm(event: Event) {
    event.preventDefault();

    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      UIkit.modal('#validation-modal').show();
      return;
    }

    this.isSubmitting = true;
    UIkit.modal('#loading-modal').show();

    const formData = this.contactForm.value;

    emailjs
      .send(
        environment.emailjs.contacto.serviceId,
        environment.emailjs.contacto.templateId,
        formData,
        {
          publicKey: environment.emailjs.contacto.publicKey,
        }
      )
      .then(() => {
        console.log('SUCESSO');
        window.alert('Mensagem enviada com sucesso! 🎉');
        this.contactForm.reset();
      })
      .catch((error: EmailJSResponseStatus) => {
        console.error('Falhou...', error.text);
        window.alert('Não foi possível enviar sua candidatura.');
      });
  }
}
