import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
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
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlCandidate}`, candidate);
  }

  /* updateCandidate(candidate: any): Promise<any> {
    const candidateId = candidate.id; // Assuming you have an 'id' field in the user object

    return this.http
      .patch(`${this.apiUrl}/${this.apiUrlCandidate}/${candidateId}`, candidate)
      .toPromise();
  } */

  updateCandidate(candidate: any): Observable<any> {
    const candidateId = candidate.id; 

    return this.http.patch(`${this.apiUrl}/${this.apiUrlCandidate}/${candidateId}`, candidate);
  }

  deleteCandidate(id: number): Promise<any> {
    // Change the return type to Promise<any>
    return Swal.fire({
      // Return the Swal.fire as a Promise
      title: "Confirm Delete",
      text: "Are you sure you want to delete this candidate?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        return this.http
          .delete(`${this.apiUrl}/${this.apiUrlCandidate}/${id}`)
          .toPromise(); // Use toPromise() to convert Observable to Promise
      }
      throw new Error("Deletion Cancelled"); // Throw an error to indicate that deletion was cancelled
    });
  }
}
