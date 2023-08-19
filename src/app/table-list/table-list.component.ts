// Import dependencies
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Import Components
import { UsersService } from "../services/users.service";
import { ModalComponent } from "../modal/modal.component";

// Component metadata
@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
  users: any[] = [];
  formData: any = {};
  editUser: any = {};
  editForm: FormGroup;
  errorMessage: string | null = null;
  inputFieldErrors: { [key: string]: string } = {};
  showPassword: boolean = false; // New property to track if the password is visible
  showEditFormRow: boolean = false; // New property to track if the edit user form is visible
  showListeUsers: boolean = true; // New property to track if the liste users form is visible
  isTableVisible = false; // To control the visibility of the table
  displayedUser: any; // To store the displayed user data
  loading: boolean = true;

  // New properties to hold the template references
  @ViewChild("addFormTemplate") addFormTemplate: TemplateRef<any>;
  @ViewChild("addFormTitle") addFormTitle: TemplateRef<any>;
  @ViewChild("addFormSaveButton") addFormSaveButton: TemplateRef<any>;
  @ViewChild("editFormTemplate") editFormTemplate: TemplateRef<any>;
  @ViewChild("editFormTitle") editFormTitle: TemplateRef<any>;
  @ViewChild("editFormSaveButton") editFormSaveButton: TemplateRef<any>;

  // Component constructor
  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  // Component initialization logic
  ngOnInit() {
    this.fetchUsers();
    this.initEditForm();
  }

  // Fetch all users
  fetchUsers() {
    this.userService.fetchUsers().subscribe(
      (data) => {
        this.users = data; // Update the users array with the fetched data
        this.loading = false;
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
        this.loading = false;
      }
    );
  }



  // Delete user by ID
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      () => {
        // Optionally, you can remove the deleted item from the local array
        this.users = this.users.filter((user) => user.id !== id);
      },
      (error) => {
        console.error(error.message); // Handle the error if deletion was cancelled
      }
    );
  }

  // Search for a user by prenom and nom
  onSearchFormSubmit(searchValue: string) {
    const searchParts = searchValue.trim().split(" ");
    const prenom = searchParts[0];
    const nom = searchParts.slice(1).join(" ");

    if (!prenom || !nom) {
      return;
    }

    this.userService.fetchUserByPrenomAndNom(prenom, nom).subscribe(
      (data) => {
        this.displayUserInTable(data); // Call the function to display the user in the table
      },
      (error) => {
        console.error(
          `An error occurred while fetching user with prenom ${prenom} and nom ${nom}:`,
          error
        );
      }
    );
  }

  // Display the user in the search results table
  displayUserInTable(user: any) {
    this.isTableVisible = true; // Set the flag to show the table
    this.displayedUser = user; // Store the displayed user data
    this.showListeUsers = false;
  }

  // Close the search results table
  onCancel() {
    this.isTableVisible = false; // Hide the table when cancel button is clicked
    this.displayedUser = null; // Clear the displayed user data
    this.showListeUsers = true;
  }

  // Initialize the edit form
  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      role: ["", Validators.required],
    });
  }

  // Show the edit user form
  showEditForm(user: any) {
    this.openModal(true);
    this.showEditFormRow = true;
    this.editUser = { ...user };
    this.editForm.patchValue(user); // Patch the form with the user data
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Reset the form data
  resetFormData() {
    this.formData = {
      annee: "",
    };
  }

  // Submit the form
  onSubmit(isEditing: boolean) {
    const formData = this.editForm.value;

    if (/* formData.id */ isEditing) {
      // If the form data has an 'id', it means we are updating an existing user.
      this.userService.updateUser(formData).subscribe(
        () => {
          this.showEditFormRow = false;
          this.editUser = {};
          this.fetchUsers(); // Fetch users again to update the table with the latest data
          this.closeModal();
        },
        (error) => {
          console.error(
            `An error occurred while updating user with ID ${formData.id}:`,
            error
          );
          this.errorMessage = error.error.message;
        }
      );
    } else {
      // If the form data does not have an 'id', it means we are adding a new user.
      this.userService.addUser(this.formData).subscribe(
        (response) => {
          this.fetchUsers();
          this.errorMessage = null; // Clear any previous error message on success
          this.inputFieldErrors = {};
          this.resetFormData();
          this.closeModal();
        },
        (error) => {
          console.error("Error:", error);
          if (error.error.errors && Array.isArray(error.error.errors)) {
            this.errorMessage = error.error.errors; // Set the first error message from the array
            for (let i = 0; i < this.errorMessage.length; i++) {
              alert(this.errorMessage[i]);
            }
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
          }
        }
      );
    }
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
