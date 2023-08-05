import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class CandidatesService {
  candidates: any[] = [];
  private apiUrlCandidate = "candidates";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchCandidates() {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiUrlCandidate}`);
  }

  addCandidate(formData: any): Observable<any> {
    const candidate = {
      nom: formData.firstName,
      prenom: formData.lastName,
      email: formData.email,
      numtel: formData.numtel,
      datedebut: formData.datedebut,
      datefin: formData.datefin,
      team_id: formData.team_id,
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlCandidate}`, candidate);
  }

  updateCandidate(candidate: any): Observable<any> {
    const candidateId = candidate.id;

    return this.http.patch(
      `${this.apiUrl}/${this.apiUrlCandidate}/${candidateId}`,
      candidate
    );
  }

  deleteCandidate(id: number): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this candidate?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the map operator to return the result of the HTTP delete request
          this.http
            .delete(`${this.apiUrl}/${this.apiUrlCandidate}/${id}`)
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
}
