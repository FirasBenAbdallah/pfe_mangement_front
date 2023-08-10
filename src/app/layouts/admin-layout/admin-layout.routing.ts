import { Routes } from "@angular/router";

import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { TableListComponent } from "../../table-list/table-list.component";
import { TableListCandidateComponent } from "../../table-list-candidate/table-list-candidate.component";
import { TableListTeamComponent } from "../../table-list-team/table-list-team.component";
import { TableListSchoolYearComponent } from "../../table-list-school-year/table-list-school-year.component";
import { TableListSubjectComponent } from "../../table-list-subject/table-list-subject.component";
import { LogoutComponent } from "app/logout/logout.component";

export const AdminLayoutRoutes: Routes = [
  { path: "dashboard", component: DashboardComponent },
  { path: "user-profile", component: UserProfileComponent },
  { path: "table-list", component: TableListComponent },
  { path: "table-list-candidate", component: TableListCandidateComponent },
  { path: "table-list-team", component: TableListTeamComponent },
  { path: "table-list-school-year", component: TableListSchoolYearComponent },
  { path: "table-list-subject", component: TableListSubjectComponent },
  { path: "logout", component: LogoutComponent},
];
