// Import dependencies
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Import Components
import { UsersService } from "../services/users.service";
import { ModalComponent } from "../modal/modal.component";
import { SubjectsService } from "../services/subjects.service";
import { SchoolyearsService } from "../services/schoolyears.service";

// Component metadata
@Component({
  selector: "app-table-list-subject",
  templateUrl: "./table-list-subject.component.html",
  styleUrls: ["./table-list-subject.component.css"],
})
export class TableListSubjectComponent implements OnInit {
  subjects: any[] = [];
  formData: any = {};
  schoolyearOptions: any[] = [];
  userOptions: any[] = [];
  errorMessage: string | null = null;
  inputFieldErrors: { [key: string]: string } = {};
  showEditFormRow: boolean = false;
  editSubject: any = {};
  editForm: FormGroup;
  schoolyears: any[] = [];
  users: any[] = [];

  // New properties to hold the template references
  @ViewChild("addFormTemplate") addFormTemplate: TemplateRef<any>;
  @ViewChild("addFormTitle") addFormTitle: TemplateRef<any>;
  @ViewChild("addFormSaveButton") addFormSaveButton: TemplateRef<any>;
  @ViewChild("editFormTemplate") editFormTemplate: TemplateRef<any>;
  @ViewChild("editFormTitle") editFormTitle: TemplateRef<any>;
  @ViewChild("editFormSaveButton") editFormSaveButton: TemplateRef<any>;

  // Component constructor
  constructor(
    private subjectService: SubjectsService,
    private schoolyearService: SchoolyearsService,
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  // Component initialization logic
  ngOnInit() {
    this.fetchSubjects();
    this.fetchSchoolyearsUsers();
  }

  // Fetch all subjects
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

  // Fetch all schoolyears and users
  fetchSchoolyearsUsers() {
    this.schoolyearService.fetchSchoolYears().subscribe(
      (schoolyears) => {
        this.schoolyears = schoolyears;
      },
      (error) => {
        console.error("Error fetching school years:", error);
      }
    );
    this.userService.fetchUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  // Fetch all schoolyear and user options
  fetchSchoolYearAndUserOptions() {
    this.schoolyearService.fetchSchoolYears().subscribe(
      (response) => {
        this.schoolyearOptions = response;
        console.log("Schoolyear options:", this.schoolyearOptions);
      },
      (error) => {
        console.error("Error fetching schoolyear options:", error);
      }
    );
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

  // Delete a subject by ID
  deleteSubject(id: number) {
    this.subjectService.deleteSubject(id).subscribe(
      () => {
        console.log(`Subject with ID ${id} deleted successfully.`);
        this.subjects = this.subjects.filter((subject) => subject.id !== id);
      },
      (error) => {
        console.error("Error deleting subject:", error);
        // Handle error here
      }
    );
  }

  // Initialize the form data
  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""],
      libelle: ["", Validators.required],
      competences: ["", Validators.required],
      schoolyear_id: ["", Validators.required],
      user_id: ["", Validators.required],
    });
  }

  // Show Edit Form
  showEditForm(subject: any) {
    console.log("Editing subject:", subject);
    this.openModal(true);
    this.showEditFormRow = true;
    this.editSubject = { ...subject };
    this.editForm.patchValue({
      id: subject.id,
      libelle: subject.libelle,
      competences: subject.competences,
      schoolyear_id: subject.schoolyear_id,
      user_id: subject.user_id,
    }); // Patch the form with the user data
  }

  // Reset the form data
  resetFormData() {
    this.formData = {
      annee: "",
    };
  }

  // On Submit
  onSubmit(isEditing: boolean) {
    if (isEditing) {
      const editedSubject = this.editForm.value;
      this.subjectService.updateSubject(editedSubject).subscribe(
        () => {
          console.log(
            `Subject with ID ${editedSubject.id} updated successfully.`
          );
          this.showEditFormRow = false;
          this.editSubject = {};
          this.fetchSubjects();
          this.closeModal();
        },
        (error) => {
          console.error(
            `An error occurred while updating user with ID ${editedSubject.id}:`,
            error
          );
          this.errorMessage = error.error.message;
        }
      );
    } else {
      // Extract the selected team ID from the form data
      const schoolyearId = this.formData.schoolyear_id
        ? this.formData.schoolyear_id
        : null;

      // Extract the selected team ID from the form data
      const userId = this.formData.user_id ? this.formData.user_id : null;

      // Include the selected team ID in the candidate data
      const subjectData = {
        libelle: this.formData.libelle,
        competences: this.formData.competences,
        schoolyear_id: schoolyearId,
        user_id: userId,
      };

      this.subjectService.addSubject(subjectData).subscribe(
        (response) => {
          console.log("Success:", response);
          this.fetchSubjects();
          this.errorMessage = null; // Clear any previous error message on success
          this.inputFieldErrors = {};
          this.resetFormData();
          this.closeModal();
        },
        (error) => {
          console.error("Error:", error);
          if (error.error.errors && Array.isArray(error.error.errors)) {
            this.errorMessage = error.error.errors; // Set the first error message from the array
            console.log("Error message:", this.errorMessage);
            this.inputFieldErrors = error.error.errors.reduce(
              (acc, errorMessage) => {
                if (errorMessage.propertyPath) {
                  acc[errorMessage.propertyPath] = errorMessage.message;
                }
                return acc;
              },
              {}
            );
          } else {
            this.errorMessage = "An error occurred during form submission."; // Fallback error message
            console.log("Error message:", this.errorMessage);
          }
        }
      );
    }
  }

  // Open the modal
  openModal(modal: Boolean) {
    const modalRef = this.modalService.open(ModalComponent);
    if (modal) {
      this.initEditForm();
      modalRef.componentInstance.title = this.editFormTitle;
      modalRef.componentInstance.content = this.editFormTemplate;
      modalRef.componentInstance.saveButton = this.editFormSaveButton;
    } else {
      this.fetchSchoolYearAndUserOptions();
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
