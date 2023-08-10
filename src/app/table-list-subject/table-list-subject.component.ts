import { Component, OnInit } from '@angular/core';
import { SubjectsService } from "../services/subjects.service";
import { SchoolyearsService } from "../services/schoolyears.service";
import { UsersService } from "../services/users.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-table-list-subject',
  templateUrl: './table-list-subject.component.html',
  styleUrls: ['./table-list-subject.component.css']
})
export class TableListSubjectComponent implements OnInit {
  subjects: any[] = [];
  formData: any = {};
  schoolyearOptions: any[] = [];
  userOptions: any[] = [];
  showAddSubjectForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editSubject: any = {};
  editForm: FormGroup;
  showPassword: boolean = false;
  schoolyears: any[] = [];
  users: any[] = [];


  constructor(
    private subjectService: SubjectsService,
    private schoolyearService: SchoolyearsService,
    private userService: UsersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchSubjects();
    this.schoolyearService.fetchSchoolYears().subscribe(
      (schoolyears) => {
        this.schoolyears = schoolyears;
      },
      (error) => {
        console.error('Error fetching school years:', error);
      }
    );
    this.userService.fetchUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchSubjects() {
    this.subjectService.fetchSubjects().subscribe(
      (data) => {
        this.subjects = data; // Update the users array with the fetched data
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
      }
    );
  }

  fetchSchoolYearOptions() {
    this.schoolyearService.fetchSchoolYears().subscribe(
      (response) => {
        this.schoolyearOptions = response;
        console.log("Schoolyear options:", this.schoolyearOptions);
      },
      (error) => {
        console.error("Error fetching schoolyear options:", error);
      }
    );
  }

  fetchUserOptions() {
    this.userService.fetchUsers().subscribe(
      (response) => {
        this.userOptions = response;
        console.log("User options:", this.userOptions);
      },
      (error) => {
        console.error("Error fetching user options:", error);
      }
    );
  }

  deleteSubject(id: number) {
    this.subjectService.deleteSubject(id).subscribe(
      () => {
        console.log(`Subject with ID ${id} deleted successfully.`);
        this.subjects = this.subjects.filter(
          (subject) => subject.id !== id
        );
      },
      (error) => {
        console.error("Error deleting subject:", error);
        // Handle error here
      }
    );
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      libelle: ["", Validators.required],
      competences: ["", Validators.required],
    });
  }

  showEditForm(subject: any) {
    console.log("Editing subject:", subject);
    this.showEditFormRow = true;
    this.editSubject= { ...subject };
    this.editForm.patchValue(subject); // Patch the form with the user data
  }

  cancelEdit() {
    this.showEditFormRow = false;
    this.editSubject = {}; // Clear the editUser object when canceling the edit
  }

  showAddForm() {
    this.showAddSubjectForm = true; // Show the add user form
    this.fetchSchoolYearOptions();
    this.fetchUserOptions();
  }

  cancelAddForm() {
    this.showAddSubjectForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      libelle: "",
      competences: "",
    };
  }

  /* onSubmit() {
    const editedSubject = this.editForm.value;

    this.subjectService.updateSubject(editedSubject).subscribe(
      () => {
        console.log(`User with ID ${editedSubject.id} updated successfully.`);
        this.showEditFormRow = false;
        this.editSubject = {};
        this.fetchSubjects(); // Fetch users again to update the table with the latest data
      },
      (error) => {
        console.error(
          `An error occurred while updating user with ID ${editedSubject.id}:`,
          error
        );
      }
    );
  }

  onSubmit1() {
    // const formData = this.formData.value;

    // Extract the selected team ID from the form data
    const schoolyearId = this.formData.schoolyear_id ? this.formData.schoolyear_id : null;

     // Extract the selected team ID from the form data
     const userId = this.formData.user_id ? this.formData.user_id : null;

    // Include the selected team ID in the candidate data
    const subjectData = {
      // ...formData,
      libelle: this.formData.libelle,
      competences: this.formData.competences,
      schoolyear_id: schoolyearId,
      user_id: userId,
    };

    console.log(subjectData);

    this.subjectService.addSubject(subjectData).subscribe(
      (response) => {
        console.log("Success:", response);
        this.fetchSubjects();
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    this.cancelAddForm();
  } */

  onSubmit(isEditing: boolean) {
    let subjectData;
  
    if (isEditing) {
      const editedSubject = this.editForm.value;
      this.subjectService.updateSubject(editedSubject).subscribe(
        () => {
          console.log(`Subject with ID ${editedSubject.id} updated successfully.`);
          this.showEditFormRow = false;
          this.editSubject = {};
          this.fetchSubjects();
        },
        (error) => {
          console.error(
            `An error occurred while updating user with ID ${editedSubject.id}:`,
            error
          );
        }
      );
    } else {
      // Extract the selected team ID from the form data
    const schoolyearId = this.formData.schoolyear_id ? this.formData.schoolyear_id : null;

    // Extract the selected team ID from the form data
    const userId = this.formData.user_id ? this.formData.user_id : null;

    // Include the selected team ID in the candidate data
    const subjectData = {
      // ...formData,
      libelle: this.formData.libelle,
      competences: this.formData.competences,
      schoolyear_id: schoolyearId,
      user_id: userId,
    };

    console.log(subjectData);

    this.subjectService.addSubject(subjectData).subscribe(
      (response) => {
        console.log("Success:", response);
        this.fetchSubjects();
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    this.cancelAddForm();
    }
  }
}
