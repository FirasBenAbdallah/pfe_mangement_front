import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent {
  @Input() content: any;
  @Input() title: any;
  @Input() saveButton: any;

  constructor(public activeModal: NgbActiveModal) {}
}
