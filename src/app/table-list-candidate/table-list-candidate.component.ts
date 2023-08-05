import { Component, OnInit } from "@angular/core";
import { CandidatesService } from "../services/candidates.service";
import { TeamsService } from "../services/teams.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-table-list-candidate",
  templateUrl: "./table-list-candidate.component.html",
  styleUrls: ["./table-list-candidate.component.css"],
})
export class TableListCandidateComponent implements OnInit {
  candidates: any[] = [];
  formData: any = {};
  teamOptions: any[] = [];
  showAddCandidateForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editCandidate: any = {};
  editForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private candidateService: CandidatesService,
    private teamService: TeamsService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.fetchCandidates();
    this.initEditForm();
  }

  fetchCandidates() {
    this.candidateService.fetchCandidates().subscribe(
      (data) => {
        this.candidates = data; // Update the users array with the fetched data
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
      }
    );
  }

  fetchTeamOptions() {
    this.teamService.fetchTeams().subscribe(
      (response) => {
        this.teamOptions = response;
        console.log("Team options:", this.teamOptions);
      },
      (error) => {
        console.error("Error fetching team options:", error);
      }
    );
  }

  deleteCandidate(id: number) {
    this.candidateService.deleteCandidate(id).subscribe(
      () => {
        console.log(`Candidate with ID ${id} deleted successfully.`);
        this.candidates = this.candidates.filter(
          (candidate) => candidate.id !== id
        );
      },
      (error) => {
        console.error("Error deleting candidate:", error);
        // Handle error here
      }
    );
  }

  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      numtel: ["", Validators.required],
      datedebut: ["", Validators.required],
      datefin: ["", Validators.required],
    });
  }

  showEditForm(candidate: any) {
    console.log("Editing candidate:", candidate);
    this.showEditFormRow = true;
    this.editCandidate = { ...candidate };

    // Custom function to format dates without time
    const formatDateWithoutTime = (date: any) => {
      if (!(date instanceof Date)) {
        date = new Date(date); // Convert to Date object if it's not already
      }

      if (isNaN(date.getTime())) {
        return ""; // Return an empty string for invalid dates
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Format the dates using the custom function
    const formattedStartDate = formatDateWithoutTime(candidate.datedebut);
    const formattedEndDate = formatDateWithoutTime(candidate.datefin);

    this.editForm.patchValue({
      id: candidate.id,
      nom: candidate.nom,
      prenom: candidate.prenom,
      email: candidate.email,
      numtel: candidate.numtel,
      datedebut: formattedStartDate,
      datefin: formattedEndDate,
    });
  }

  cancelEdit() {
    this.showEditFormRow = false;
    this.editCandidate = {}; // Clear the editUser object when canceling the edit
  }

  showAddForm() {
    this.showAddCandidateForm = true; // Show the add user form
    this.fetchTeamOptions();
  }

  cancelAddForm() {
    this.showAddCandidateForm = false; // Hide the add user form
    // Reset the form data if needed
    this.formData = {
      firstName: "",
      lastName: "",
      email: "",
      numtel: "",
      datedebut: "",
      datefin: "",
    };
  }

  onSubmit() {
    const editedCandidate = this.editForm.value;

    this.candidateService.updateCandidate(editedCandidate).subscribe(
      () => {
        console.log(`User with ID ${editedCandidate.id} updated successfully.`);
        this.showEditFormRow = false;
        this.editCandidate = {};
        this.fetchCandidates(); // Fetch users again to update the table with the latest data
      },
      (error) => {
        console.error(
          `An error occurred while updating user with ID ${editedCandidate.id}:`,
          error
        );
      }
    );
  }

  onSubmit1() {
    const numtelAsInt = parseInt(this.formData.numtel, 10);
    const formDataWithIntNumtel = { ...this.formData, numtel: numtelAsInt };

    // Extract the selected team ID from the form data
    const teamId = this.formData.team_id ? this.formData.team_id : null;

    // Include the selected team ID in the candidate data
    const candidateData = {
      ...formDataWithIntNumtel,
      team_id: teamId,
    };

    console.log(candidateData);

    this.candidateService.addCandidate(candidateData).subscribe(
      (response) => {
        console.log("Success:", response);
        this.fetchCandidates();
      },
      (error) => {
        console.error("Error:", error);
      }
    );

    this.cancelAddForm();
  }
}
