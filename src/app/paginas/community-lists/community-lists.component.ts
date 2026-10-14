import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MenuComponent } from '../../layout/menu/menu.component';
import { RodapeComponent } from '../../layout/rodape/rodape.component';

@Component({
  selector: 'app-community-lists',
  imports: [MenuComponent, RodapeComponent, TranslatePipe, RouterLink],
  templateUrl: './community-lists.component.html',
  styleUrl: './community-lists.component.css'
})
export class CommunityListsComponent {}
