import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
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

interface Address {
  title: string;
  address: string;
  phone?: string;
}

@Component({
  selector: 'app-contacto',
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    CommonModule,
    MenuComponent,
    RodapeComponent,
  ],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css',
})
export class ContactoComponent {
  isSubmitting: boolean = false;

  useLanguage(language: string): void {
    this.translate.use(language);
  }

  selectedCountry: string = 'Angola';

  countries = [
    { name: 'Angola', value: '0' },
    { name: 'África do Sul', value: '1' },
    { name: 'Nigéria', value: '2' },
    { name: 'Portugal', value: '3' },
    { name: 'Brasil', value: '4' },
  ];

  addresses: Record<string, Address[]> = {
    Angola: [
      {
        title: 'Sede',
        address:
          'Condomínio Rosalinda, Edifício 11-A,<br> Estr. da Samba, Luanda, Angola.',
        phone: '+244 227 360 006',
      },
      {
        title: 'Data Center - AngoNAP Luanda',
        address:
          'Avenida Pedro Castro Van Dúnem Loy<br>Talatona, Luanda Sul, Angola',
      },
      {
        title: 'Estação Sangano',
        address: 'Praia de Sangano, Município da Kissama, <br> Bengo, Angola',
      },
    ],
    'África do Sul': [
      {
        title: 'Johannesburg',
        address:
          'Suite 1, The Pivot, Block E <br> 1 Montecasino Boulevard, Fourways<br> 2191 - Gauteng, South Africa',
        phone: '+27 (0) 10 005 5865',
      },
    ],
    Nigéria: [
      {
        title: 'Lagos Headquarters',
        address:
          '5 Jeremiah Ugwu Street, Off Babatunde Anjous<br>Lekki Phase 1,<br>Lagos, Nigeria',
      },
    ],
    Portugal: [
      {
        title: 'Lisboa',
        address: 'Avenida da Liberdade, 245, 5º <br> 1250-143 Lisboa, Portugal',
      },
    ],
    Brasil: [
      {
        title: 'São Paulo',
        address:
          'Rua Irmã Gabriela, 51 <br>Brooklin <br>CEP 04571-130 – São Paulo',
      },
      {
        title: 'Data Center  AngonaNAP Fortaleza',
        address:
          'Avenida Trajano de Medeiros, 1851 <br> Praia do Futuro I – Fortaleza – Ce <br>CEP 04571-130 – São Paulo <br> CEP 60.182-325',
        phone: '+55 85 99645-4143',
      },
    ],
    Europa: [
      {
        title: 'Escritório - Portugal',
        address:
          'Rua da Alfândega, n.º 64, 5.º andar,<br> 9000 059 FUNCHAL <br> Madeira – Portugal',
      },
    ],
  };

  onCountryChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedCountry = select.value;
  }

  getCountryAddresses(country: string): Address[] {
    return (
      this.addresses[country] || [
        {
          title: 'Contact Support',
          address: 'Please contact us for address information in this country',
          phone: '+244 927 686 206',
        },
      ]
    );
  }

  contactForm: FormGroup;
  constructor(private translate: TranslateService, private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    phone: [
    '', 
    [
      Validators.required, // <-- make phone required
      Validators.pattern(/^\+[0-9()\-]+$/), // Must start with +
      Validators.minLength(6) // Minimum reasonable length including +
    ]
  ],
      region: ['', Validators.required],
      department: ['', Validators.required], // Added department field
      companyName: [''], // Added companyName field, not required
      companyPosition: [''], // Added companyPosition field, not required
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
        ],
      ],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  // Updated character blocking
  blockInvalidPhoneChars(event: KeyboardEvent) {
    const phoneControl = this.contactForm.get('phone');
    const currentValue = phoneControl?.value || '';

    // Always allow navigation/control keys
    const controlKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    if (controlKeys.includes(event.key)) {
      return;
    }

    // First character must be +
    if (currentValue.length === 0 && event.key !== '+') {
      event.preventDefault();
      return;
    }

    // Subsequent characters must be 0-9, -, (, )
    const allowedChars = /[0-9\-()]/;
    if (currentValue.length > 0 && !allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }

  // Updated input sanitization
  sanitizePhoneInput() {
    const phoneControl = this.contactForm.get('phone');
    if (!phoneControl) return;

    let value = phoneControl.value;

    // Ensure it starts with +
    if (value.length > 0 && !value.startsWith('+')) {
      value = '+' + value.replace(/[^0-9]/g, '');
    }

    // Remove any remaining invalid characters
    value = value.replace(/[^0-9+()-]/g, '');

    // Update control value
    phoneControl.setValue(value, { emitEvent: false });
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
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#success-modal').show();
        this.contactForm.reset();
        this.isSubmitting = false;
      })
      .catch((error: EmailJSResponseStatus) => {
        console.error('Falhou...', error.text);
        UIkit.modal('#loading-modal').hide();
        UIkit.modal('#error-modal').show();
        this.isSubmitting = false;
      });
  }
}
