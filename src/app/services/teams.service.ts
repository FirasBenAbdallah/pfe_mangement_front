import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  teams: any[] = [];
  private apiUrlTeam = "teams";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchTeams() {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiUrlTeam}`);
  }

  addTeam(formData: any): Observable<any> {
    const team = {
      nom: formData.nom,
      taille: formData.taille,
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlTeam}`, team);
  }

  updateTeam(team: any): Observable<any> {
    const teamId = team.id;

    return this.http.patch(`${this.apiUrl}/${this.apiUrlTeam}/${teamId}`, team);
  }

  deleteTeam(id: number): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this user?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the map operator to return the result of the HTTP delete request
          this.http
            .delete(`${this.apiUrl}/${this.apiUrlTeam}/${id}`)
            .pipe(
              map((response) => {
                // Resolve the observer with the response data
                observer.next(response);
                observer.complete();
              })
            )
            .subscribe();
        } else {
          // If deletion was cancelled, throw an error
          observer.error(new Error("Deletion Cancelled"));
        }
      });
    });
  }

  fetchTeamByName(nom: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${this.apiUrlTeam}/${nom}`
    );
  }
}
