// Import Dependencies
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
// Import Components
import { TeamsService } from "../services/teams.service";
import { ModalComponent } from "../modal/modal.component";
import { SubjectsService } from "app/services/subjects.service";

// Component metadata
@Component({
  selector: "app-table-list-team",
  templateUrl: "./table-list-team.component.html",
  styleUrls: ["./table-list-team.component.css"],
})
export class TableListTeamComponent implements OnInit {
  teams: any[] = [];
  subjects: any[] = [];
  subjectOptions: any[] = [];
  formData: any = {};
  showAddTeamForm: boolean = false; // New property to track if the add user form is visible
  showEditFormRow: boolean = false;
  editTeam: any = {};
  editForm: FormGroup;
  errorMessage: string | null = null;
  inputFieldErrors: { [key: string]: string } = {};
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
    private teamService: TeamsService,
    private subjectService: SubjectsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  // Component initialization logic
  ngOnInit() {
    this.fetchTeams();
    this.initEditForm();
    this.subjectService.fetchSubjects().subscribe(
      (subjects) => {
        this.subjects = subjects;
      },
      (error) => {
        console.error("Error fetching subjects:", error);
      }
    );
  }

  // Fetch teams
  fetchTeams() {
    this.teamService.fetchTeams().subscribe(
      (data) => {
        this.teams = data; // Update the users array with the fetched data
        this.loading = false;
      },
      (error) => {
        console.error("An error occurred while fetching the data:", error);
        this.loading = false;
      }
    );
  }

  // Fetch subject options
  fetchSubjectOptions() {
    this.subjectService.fetchSubjects().subscribe(
      (response) => {
        this.subjectOptions = response;
      },
      (error) => {
        console.error("Error fetching subject options:", error);
      }
    );
  }

  // Delete a team by ID
  deleteTeam(id: number) {
    this.teamService.deleteTeam(id).subscribe(
      (response) => {
        this.teams = this.teams.filter((team) => team.id !== id);
      },
      (error) => {
        console.error("Error deleting team:", error);
      }
    );
  }

  // Initialize the edit form
  initEditForm() {
    this.editForm = this.formBuilder.group({
      id: [""], // Add any other fields you have in the user object
      nom: ["", Validators.required],
      taille: ["", Validators.required],
      subject_id: ["", Validators.required],
    });
  }

  // Show Edit Form
  showEditForm(team: any) {
    this.openModal(true);
    this.showEditFormRow = true;
    this.editTeam = { ...team };
    this.editForm.patchValue({
      id: team.id,
      nom: team.nom,
      taille: team.taille,
      subject_id: team.subject_id,
    }); // Patch the form with the team data
  }

  // Reset the form data
  resetFormData() {
    this.formData = {
      annee: "",
    };
  }

  // Submit the form
  onSubmit(isEditing: Boolean) {
    let teamData;

    if (isEditing) {
      const editedTeam = this.editForm.value;
      this.teamService.updateTeam(editedTeam).subscribe(
        () => {
          this.showEditFormRow = false;
          this.editTeam = {};
          this.fetchTeams();
        },
        (error) => {
          console.error(
            "An error occurred while updating team with ID ${editedTeam.id}:",
            error
          );
        }
      );
    } else {
      const subjectId = this.formData.subject_id
        ? this.formData.subject_id
        : null;

      teamData = {
        ...this.formData,
        subject_id: subjectId,
      };

      this.teamService.addTeam(teamData).subscribe(
        (response) => {
          this.fetchTeams();
          this.errorMessage = null; // Clear any previous error message on success
          this.inputFieldErrors = {};
        },
        (error) => {
          console.error("Error:", error);
          if (error.error.errors && Array.isArray(error.error.errors)) {
            this.errorMessage = error.error.errors; // Set the first error message from the array
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
      this.fetchSubjectOptions();
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
