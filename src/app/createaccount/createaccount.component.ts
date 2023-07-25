import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-createaccount',
  templateUrl: './createaccount.component.html',
  styleUrls: ['./createaccount.component.css']
})
export class CreateaccountComponent implements OnInit {

  ngOnInit(): void {
  }

  formData: any = {}; // Replace with your desired form data structure

  constructor(private http: HttpClient) {}

  onSubmit() {
    console.log(this.formData);
    this.http
      .post('http://127.0.0.1:8000/user/new', { nom: this.formData.firstName, prenom:this.formData.lastName, email:this.formData.email, password:this.formData.password, role:this.formData.type})
      .subscribe(
        (response) => {
          console.log('Success:', response);
          // Perform additional success logic if needed
        },
        (error) => {
          console.error('Error:', error);
          // Perform additional error handling if needed
        }
      );
  }

}
