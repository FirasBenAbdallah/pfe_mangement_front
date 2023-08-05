import { Component, OnInit } from "@angular/core";
import { TeamsService } from "../services/teams.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-table-list-team",
  templateUrl: "./table-list-team.component.html",
  styleUrls: ["./table-list-team.component.css"],
})
export class TableListTeamComponent implements OnInit {
  teams: any[] = [];
  formData: any = {};
  showAddTeamForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editTeam: any = {};
  editForm: FormGroup;

  constructor(
    private teamService: TeamsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchTeams();
    this.initEditForm();
  }

  fetchTeams() {
    this.teamService.fetchTeams().subscribe(
      (data) => {
        this.teams = data; // Update the users array with the fetched data
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
      }
    );
  }

  deleteTeam(id: number) {
    this.teamService.deleteTeam(id).subscribe(
      (response) => {
        console.log("Deletion successful:", response);
        this.teams = this.teams.filter((team) => team.id !== id);
      },
      (error) => {
        console.error("Error deleting team:", error);
      }
    );
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      nom: ["", Validators.required],
      taille: ["", Validators.required],
    });
  }

  showEditForm(team: any) {
    console.log("Editing team:", team);
    this.showEditFormRow = true;
    this.editTeam = { ...team };
    this.editForm.patchValue(team); // Patch the form with the user data
  }

  cancelEdit() {
    this.showEditFormRow = false;
    this.editTeam = {}; // Clear the editUser object when canceling the edit
  }

  showAddForm() {
    this.showAddTeamForm = true; // Show the add user form
  }

  cancelAddForm() {
    this.showAddTeamForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      nom: "",
      taille: "",
    };
  }

  onSubmit() {
    const formData = this.editForm.value;

    if (formData.id) {
      // If the form data has an 'id', it means we are updating an existing team.
      this.teamService.updateTeam(formData).subscribe(
        () => {
          console.log(`Team with ID ${formData.id} updated successfully.`);
          this.showEditFormRow = false;
          this.editTeam = {};
          this.fetchTeams(); // Fetch teams again to update the table with the latest data
        },
        (error) => {
          console.error(
            `An error occurred while updating team with ID ${formData.id}:`,
            error
          );
        }
      );
    } else {
      // If the form data does not have an 'id', it means we are adding a new user.
      this.teamService.addTeam(this.formData).subscribe(
        (response) => {
          console.log("Success:", response);
          this.fetchTeams();
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }

    this.cancelAddForm();
  }
}
