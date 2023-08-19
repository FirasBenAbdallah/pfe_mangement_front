import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TeamsService {
  teams: any[] = [];
  private apiUrlTeam = "teams";

  constructor(private http: HttpClient) {}

  fetchTeams() {
    return this.http.get<any[]>(`${environment.apiUrl}/${this.apiUrlTeam}`);
  }

  addTeam(formData: any): Observable<any> {
    const team = {
      nom: formData.nom,
      taille: formData.taille,
      subject_id: formData.subject_id,
    };

    return this.http
      .post(`${environment.apiUrl}/${this.apiUrlTeam}`, team)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Team added successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error adding team:", error);
          throw error;
        })
      );
  }

  updateTeam(team: any): Observable<any> {
    const teamId = team.id;

    return this.http
      .patch(`${environment.apiUrl}/${this.apiUrlTeam}/${teamId}`, team)
      .pipe(
        tap(() => {
          // Display success message
          Swal.fire({
            icon: "success",
            title: "Team updated successfully",
            showConfirmButton: false,
            timer: 2000, // Display for 2 seconds
          });
        }),
        catchError((error) => {
          // Handle error if needed
          console.error("Error updating team:", error);
          throw error;
        })
      );
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
            .delete(`${environment.apiUrl}/${this.apiUrlTeam}/${id}`)
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
      `${environment.apiUrl}/${this.apiUrlTeam}/${nom}`
    );
  }
}
