import { Component, OnInit } from "@angular/core";
import { UsersService } from "../services/users.service";
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: "app-table-list",
  templateUrl: "./table-list.component.html",
  styleUrls: ["./table-list.component.css"],
})
export class TableListComponent implements OnInit {
  users: any[] = [];
  formData: any = {};
  showAddUserForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editUser: any = {};
  editForm: FormGroup;
  showPassword: boolean = false;

  constructor(private userService: UsersService, private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.fetchUsers();
    this.initEditForm();
  }

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

  deleteUser(id: number) {
    this.userService
      .deleteUser(id)
      .then(() => {
        console.log(`User with ID ${id} deleted successfully.`);
        // Optionally, you can remove the deleted item from the local array
        this.users = this.users.filter((user) => user.id !== id);
      })
      .catch((error) => {
        console.error(error.message); // Handle the error if deletion was cancelled
      });
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [''], // Add any other fields you have in the user object
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  showEditForm(user: any) {
    console.log('Editing user:', user);
    this.showEditFormRow = true;
    this.editUser = { ...user };
    this.editForm.patchValue(user); // Patch the form with the user data
  }  

  cancelEdit() {
    this.showEditFormRow = false;
    this.editUser = {}; // Clear the editUser object when canceling the edit
  }

  showAddForm() {
    this.showAddUserForm = true; // Show the add user form
  }

  cancelAddForm() {
    this.showAddUserForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: ''
    };
  }

  onSubmit() {
    const formData = this.editForm.value;

    if (formData.id) {
      // If the form data has an 'id', it means we are updating an existing user.
      this.userService
        .updateUser(formData)
        .subscribe(
          () => {
            console.log(`User with ID ${formData.id} updated successfully.`);
            this.showEditFormRow = false;
            this.editUser = {};
            this.fetchUsers(); // Fetch users again to update the table with the latest data
          },
          (error) => {
            console.error(`An error occurred while updating user with ID ${formData.id}:`, error);
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

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  /* onSubmit() {
    const editedUser = this.editForm.value;

    this.userService
      .updateUser(editedUser)
      .subscribe(
        () => {
          console.log(`User with ID ${editedUser.id} updated successfully.`);
          this.showEditFormRow = false;
          this.editUser = {};
          this.fetchUsers(); // Fetch users again to update the table with the latest data
        },
        (error) => {
          console.error(`An error occurred while updating user with ID ${editedUser.id}:`, error);
        }
      );
  }

  onSubmit1() {
    console.log(this.formData);

    this.userService.addUser(this.formData).subscribe(
      (response) => {
        console.log("Success:", response);
        this.fetchUsers();
      },
      (error) => {
        console.error("Error:", error);
      }
    );
    this.cancelAddForm();
  }

   */
}
