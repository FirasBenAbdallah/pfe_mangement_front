// Import dependencies
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Import Components
import { TeamsService } from "../services/teams.service";
import { ModalComponent } from "../modal/modal.component";
import { CandidatesService } from "../services/candidates.service";

// Component metadata
@Component({
  selector: "app-table-list-candidate",
  templateUrl: "./table-list-candidate.component.html",
  styleUrls: ["./table-list-candidate.component.css"],
})
export class TableListCandidateComponent implements OnInit {
  candidates: any[] = [];
  formData: any = {};
  teamOptions: any[] = [];
  showEditFormRow: boolean = false;
  editCandidate: any = {};
  editForm: FormGroup;
  showPassword: boolean = false;
  teams: any[] = [];

  // New properties to hold the template references
  @ViewChild("addFormTemplate") addFormTemplate: TemplateRef<any>;
  @ViewChild("addFormTitle") addFormTitle: TemplateRef<any>;
  @ViewChild("addFormSaveButton") addFormSaveButton: TemplateRef<any>;
  @ViewChild("editFormTemplate") editFormTemplate: TemplateRef<any>;
  @ViewChild("editFormTitle") editFormTitle: TemplateRef<any>;
  @ViewChild("editFormSaveButton") editFormSaveButton: TemplateRef<any>;

  // Component constructor
  constructor(
    private candidateService: CandidatesService,
    private teamService: TeamsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  // Component initialization logic
  ngOnInit() {
    this.fetchCandidates();
    this.teamService.fetchTeams().subscribe(
      (teams) => {
        this.teams = teams;
      },
      (error) => {
        console.error("Error fetching teams:", error);
      }
    );
  }

  // Fetch all candidates
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

  // Fetch all team options
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

  // Delete candidate by ID
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

  // Initialize the edit form
  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      nom: ["", Validators.required],
      prenom: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      numtel: ["", Validators.required],
      datedebut: ["", Validators.required],
      datefin: ["", Validators.required],
      team_id: ["", Validators.required],
    });
  }

  // Show the edit candidate form
  showEditForm(candidate: any) {
    console.log("Editing candidate:", candidate);
    this.openModal(true);
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
      team_id: candidate.team_id,
    });
  }

  // Reset the form data
  resetFormData() {
    this.formData = {
      firstName: "",
      lastName: "",
      email: "",
      numtel: "",
      datedebut: "",
      datefin: "",
      team_id: "",
    };
  }

  // Submit the form
  onSubmit(isEditing: boolean) {
    let candidateData;

    if (isEditing) {
      const editedCandidate = this.editForm.value;
      this.candidateService.updateCandidate(editedCandidate).subscribe(
        () => {
          console.log(
            `User with ID ${editedCandidate.id} updated successfully.`
          );
          this.showEditFormRow = false;
          this.editCandidate = {};
          this.fetchCandidates();
        },
        (error) => {
          console.error(
            `An error occurred while updating user with ID ${editedCandidate.id}:`,
            error
          );
        }
      );
    } else {
      const numtelAsInt = parseInt(this.formData.numtel, 10);
      const formDataWithIntNumtel = { ...this.formData, numtel: numtelAsInt };

      const teamId = this.formData.team_id ? this.formData.team_id : null;

      candidateData = {
        ...formDataWithIntNumtel,
        team_id: teamId,
      };

      this.candidateService.addCandidate(candidateData).subscribe(
        (response) => {
          console.log("Success:", response);
          this.fetchCandidates();
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
      this.initEditForm();
      modalRef.componentInstance.title = this.editFormTitle;
      modalRef.componentInstance.content = this.editFormTemplate;
      modalRef.componentInstance.saveButton = this.editFormSaveButton;
    } else {
      this.fetchTeamOptions();
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
