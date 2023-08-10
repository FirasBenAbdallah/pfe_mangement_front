import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TableListCandidateComponent } from '../../table-list-candidate/table-list-candidate.component';
import { TableListTeamComponent } from '../../table-list-team/table-list-team.component';
import { TableListSchoolYearComponent } from '../../table-list-school-year/table-list-school-year.component';
import { TableListSubjectComponent } from '../../table-list-subject/table-list-subject.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { LogoutComponent } from 'app/logout/logout.component';
// import { ModalComponent } from 'app/modal/modal.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TableListCandidateComponent,
    TableListTeamComponent,
    TableListSchoolYearComponent,
    TableListSubjectComponent,
    LogoutComponent,
    // ModalComponent
  ]
})

export class AdminLayoutModule {}
