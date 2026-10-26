import { Component } from '@angular/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { RodapeComponent } from '../../layout/rodape/rodape.component';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import UIkit from 'uikit';
import { Ad2Component } from '../../layout/ad2/ad2.component';

@Component({
  selector: 'app-datacenter',
  imports: [
    TranslatePipe,
    MenuComponent,
    RodapeComponent,
    CommonModule,
    ReactiveFormsModule,
    Ad2Component
  ],
  templateUrl: './datacenter.component.html',
  styleUrl: './datacenter.component.css'
})
export class DatacenterComponent {
  useLanguage(language: string): void {
      this.translate.use(language);
  }
  
  visitForm: FormGroup;
  constructor(private translate: TranslateService, private fb: FormBuilder, private router: Router) {

    this.visitForm = this.fb.group({
      nome: ['', Validators.required],
     
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)]],
  

    });



  }


  submitForm(event: Event) {
    event.preventDefault();

    this.visitForm.markAllAsTouched();


    if (this.visitForm.invalid) {
      window.alert(this.translate.instant('form_preencha_obrigatorios'));
      return;
    }

      // Redirect to the desired URL if the form is valid
      this.router.navigate(['/angonap2']); // Change to your desired route

       // Close the UIkit modal
  UIkit.modal('#modal-visita').hide();

}   
  


}
