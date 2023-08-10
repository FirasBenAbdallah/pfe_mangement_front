import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import Swal from "sweetalert2";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class SchoolyearsService {
  schoolyears: any[] = [];
  private apiUrlSchoolYear = "school/years";
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  fetchSchoolYears() {
    return this.http.get<any[]>(`${this.apiUrl}/${this.apiUrlSchoolYear}`);
  }

  addSchoolYear(formData: any): Observable<any> {
    const schoolyear = {
      annee: formData.annee,
    };

    return this.http.post(`${this.apiUrl}/${this.apiUrlSchoolYear}`, schoolyear);
  }

  updateSchoolYear(schoolyear: any): Observable<any> {
    const schoolyearId = schoolyear.id;

    return this.http.patch(`${this.apiUrl}/${this.apiUrlSchoolYear}/${schoolyearId}`, schoolyear);
  }

  deleteSchoolYear(id: number): Observable<any> {
    return new Observable((observer) => {
      Swal.fire({
        title: "Confirm Delete",
        text: "Are you sure you want to delete this School Year?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.isConfirmed) {
          // Use the map operator to return the result of the HTTP delete request
          this.http
            .delete(`${this.apiUrl}/${this.apiUrlSchoolYear}/${id}`)
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

  fetchSchoolYearByYear(annee: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/${this.apiUrlSchoolYear}/${annee}`
    );
  }
}
