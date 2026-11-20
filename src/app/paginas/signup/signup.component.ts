import { Component, OnInit } from '@angular/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import emailjs,  {type EmailJSResponseStatus } from '@emailjs/browser';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-signup',
  imports: [MenuComponent, CommonModule, ReactiveFormsModule, RodapeComponent, TranslatePipe],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  translations: any;

  useLanguage(language: string): void {
    this.translate.use(language);
    this.translations.use(language);
}

  partnershipForm: FormGroup;
  selectedPartnership: string = '';

    

  constructor(private fb: FormBuilder, private translate: TranslateService) {

    

    this.partnershipForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{9,15}$/)]],
      potCliente: ['' ],
      numColab: [''],
      numeroColaboradores: [''],
      receitaAnual: [''],
      volVendas: [''],
      subsidiariaEscolhida: [''],
      partnershipType: [''],
      paisForm: [''],
      tipoEmpresa: [''],
      nomeEmpresa: [''],
      equipaVendas: [''],
      servicoInteress: [''],
      anosOperacoes: [''],
      businessIndicatorDetails: this.fb.group({
        referralCount: [''],
        keyIndustries: [''],
      }),
      authorizedAgentDetails: this.fb.group({
        region: [''],
        experienceYears: [''],
      }),
      resellerDetails: this.fb.group({
        storeName: [''],
        productSpecialty: [''],
      }),
    });

    this.partnershipForm.get('partnershipType')?.valueChanges.subscribe(value => {
      this.selectedPartnership = value;
    });
  }


  submitForm(event: Event) {
    event.preventDefault();

    this.partnershipForm.markAllAsTouched();


    if (this.partnershipForm.invalid) {
      window.alert('Por favor, preencha correctamente todos os campos obrigatórios.');
      return;
    }

    const formData = this.partnershipForm.value;

    emailjs.send(
      environment.emailjs.signup.serviceId,
      environment.emailjs.signup.templateId,
      formData,
      {
        publicKey: environment.emailjs.signup.publicKey
      }
    )
    .then(() => {
      console.log('SUCESSO');
      window.alert('Registo solicitado com sucesso! 🎉');
      this.partnershipForm.reset();
    })
    .catch((error: EmailJSResponseStatus) => {
      console.error('Falhou...', error.text);
      window.alert('Não foi possível enviar sua candidatura.');
    });
  }
}   

