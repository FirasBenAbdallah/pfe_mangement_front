import { Component, OnInit } from "@angular/core";
import { UsersService } from "../services/users.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
  showPassword: boolean = false; // New property to track if the password is visible
  showAddUserForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false; // New property to track if the edit user form is visible
  showListeUsers: boolean = true; // New property to track if the liste users form is visible
  isTableVisible = false; // To control the visibility of the table
  displayedUser: any; // To store the displayed user data

  constructor(
    private userService: UsersService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchUsers();
    this.initEditForm();
  }

  // Fetch all users
  fetchUsers() {
    this.userService.fetchUsers().subscribe(
      (data) => {
        this.users = data; // Update the users array with the fetched data
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
      }
    );
  }

  // Delete user by ID
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log(`User with ID ${id} deleted successfully.`);
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
      console.log("Invalid input provided. Please enter both prenom and nom.");
      return;
    }

    this.userService.fetchUserByPrenomAndNom(prenom, nom).subscribe(
      (data) => {
        console.log(`User with prenom ${prenom} and nom ${nom}:`, data);
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

  displayUserInTable(user: any) {
    this.isTableVisible = true; // Set the flag to show the table
    this.displayedUser = user; // Store the displayed user data
    this.showListeUsers = false;
  }

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
    console.log("Editing user:", user);
    this.showEditFormRow = true;
    this.editUser = { ...user };
    this.editForm.patchValue(user); // Patch the form with the user data
  }

  // Show the add user form
  showAddForm() {
    this.showAddUserForm = true; // Show the add user form
  }

  // Cancel adding a new user
  cancelAddForm() {
    this.showAddUserForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
    };
  }

  // Cancel editing a user
  cancelEdit() {
    this.showEditFormRow = false;
    this.editUser = {}; // Clear the editUser object when canceling the edit
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Submit the form
  onSubmit() {
    const formData = this.editForm.value;

    if (formData.id) {
      // If the form data has an 'id', it means we are updating an existing user.
      this.userService.updateUser(formData).subscribe(
        () => {
          console.log(`User with ID ${formData.id} updated successfully.`);
          this.showEditFormRow = false;
          this.editUser = {};
          this.fetchUsers(); // Fetch users again to update the table with the latest data
        },
        (error) => {
          console.error(
            `An error occurred while updating user with ID ${formData.id}:`,
            error
          );
        }
      );
    } else {
      // If the form data does not have an 'id', it means we are adding a new user.
      this.userService.addUser(this.formData).subscribe(
        (response) => {
          console.log("Success:", response);
          this.fetchUsers();
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }

    this.cancelAddForm();
  }
}
