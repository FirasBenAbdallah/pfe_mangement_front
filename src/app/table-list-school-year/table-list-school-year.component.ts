import { Component, OnInit } from "@angular/core";
import { SchoolyearsService } from "../services/schoolyears.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ModalComponent } from "../modal/modal.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-table-list-school-year",
  templateUrl: "./table-list-school-year.component.html",
  styleUrls: ["./table-list-school-year.component.css"],
})
export class TableListSchoolYearComponent implements OnInit {
  schoolyears: any[] = [];
  formData: any = {};
  showAddSchoolYearForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editSchoolYear: any = {};
  editForm: FormGroup;

  constructor(
    private schoolyearService: SchoolyearsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.fetchSchoolYears();
    this.initEditForm();
  }

  fetchSchoolYears() {
    this.schoolyearService.fetchSchoolYears().subscribe(
      (data) => {
        this.schoolyears = data; // Update the users array with the fetched data
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
      }
    );
  }

  deleteSchoolYear(id: number) {
    this.schoolyearService.deleteSchoolYear(id).subscribe(
      (response) => {
        console.log("Deletion successful:", response);
        this.schoolyears = this.schoolyears.filter(
          (schoolyear) => schoolyear.id !== id
        );
      },
      (error) => {
        console.error("Error deleting School Year:", error);
      }
    );
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      annee: ["", Validators.required],
    });
  }

  showEditForm(schoolyear: any) {
    console.log("Editing School Year:", schoolyear);
    this.showEditFormRow = true;
    this.editSchoolYear = { ...schoolyear };
    this.editForm.patchValue(schoolyear); // Patch the form with the user data
  }

  cancelEdit() {
    this.showEditFormRow = false;
    this.editSchoolYear = {}; // Clear the editUser object when canceling the edit
  }

  showAddForm() {
    this.showAddSchoolYearForm = true; // Show the add user form
  }

  cancelAddForm() {
    this.showAddSchoolYearForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      annee: "",
    };
  }

  onSubmit(isEditing: boolean) {
    const formData = this.editForm.value;

    if (isEditing) {
      // If the form data has an 'id', it means we are updating an existing team.
      this.schoolyearService.updateSchoolYear(formData).subscribe(
        () => {
          console.log(
            `School Year with ID ${formData.id} updated successfully.`
          );
          this.showEditFormRow = false;
          this.editSchoolYear = {};
          this.fetchSchoolYears(); // Fetch teams again to update the table with the latest data
        },
        (error) => {
          console.error(
            `An error occurred while updating school year with ID ${formData.id}:`,
            error
          );
        }
      );
    } else {
      // If the form data does not have an 'id', it means we are adding a new user.
      this.schoolyearService.addSchoolYear(this.formData).subscribe(
        (response) => {
          console.log("Success:", response);
          this.fetchSchoolYears();
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }

    this.cancelAddForm();
  }

  openModal() {
    const modalRef = this.modalService.open(ModalComponent, { centered: true });
  }
}
