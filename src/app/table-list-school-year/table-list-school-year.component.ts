// Import dependencies
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Import Components
import { ModalComponent } from "../modal/modal.component";
import { SchoolyearsService } from "../services/schoolyears.service";

// Component metadata
@Component({
  selector: "app-table-list-school-year",
  templateUrl: "./table-list-school-year.component.html",
  styleUrls: ["./table-list-school-year.component.css"],
})
// Component class
export class TableListSchoolYearComponent implements OnInit {
  schoolyears: any[] = [];
  formData: any = {};
  showEditFormRow: boolean = false;
  editSchoolYear: any = {};
  editForm: FormGroup;

  // New properties to hold the template references
  @ViewChild("addFormTemplate") addFormTemplate: TemplateRef<any>;
  @ViewChild("addFormTitle") addFormTitle: TemplateRef<any>;
  @ViewChild("addFormSaveButton") addFormSaveButton: TemplateRef<any>;
  @ViewChild("editFormTemplate") editFormTemplate: TemplateRef<any>;
  @ViewChild("editFormTitle") editFormTitle: TemplateRef<any>;
  @ViewChild("editFormSaveButton") editFormSaveButton: TemplateRef<any>;

  // Component constructor
  constructor(
    private schoolyearService: SchoolyearsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  // Component initialization logic
  ngOnInit() {
    this.fetchSchoolYears();
    this.initEditForm();
  }

  // Fetch all users
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

  // Delete user by ID
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

  // Initialize the edit form
  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      annee: ["", Validators.required],
    });
  }

  // Show the edit form
  showEditForm(schoolyear: any) {
    console.log("Editing School Year:", schoolyear);
    this.openModal(true);
    this.showEditFormRow = true;
    this.editSchoolYear = { ...schoolyear };
    this.editForm.patchValue(schoolyear); // Patch the form with the user data
  }

  // Reset the form data
  resetFormData() {
    this.formData = {
      annee: "",
    };
  }

  // On form submit
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

    this.resetFormData();
    this.closeModal();
  }

  // Open the modal
  openModal(modal: Boolean) {
    const modalRef = this.modalService.open(ModalComponent);
    if (modal) {
      modalRef.componentInstance.title = this.editFormTitle;
      modalRef.componentInstance.content = this.editFormTemplate;
      modalRef.componentInstance.saveButton = this.editFormSaveButton;
    } else {
      this.showEditFormRow = false;
      modalRef.componentInstance.title = this.addFormTitle;
      modalRef.componentInstance.content = this.addFormTemplate;
      modalRef.componentInstance.saveButton = this.addFormSaveButton;
    }
  }

  // Close the modal
  closeModal() {
    this.modalService.dismissAll();
  }
}
