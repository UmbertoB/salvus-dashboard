import { Component, OnInit } from '@angular/core';
import { EnvironmentsService } from 'src/app/services/entities/enviroments.service';
import { collapse } from 'src/app/utils/animations/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormValidatorErrors } from 'src/app/utils/validators/errors.validators';
import { ShareDataService } from 'src/app/services';
import { WebSocketService } from 'src/app/services/webksocket/websocket.service';

@Component({
  selector: 'app-client-environments',
  templateUrl: './client-environments.component.html',
  styleUrls: ['./client-environments.component.css'],
  animations: [collapse]
})
export class ClientEnvironmentsComponent implements OnInit {

  public clientId: number;

  public createEnvironmentToggle: boolean;
  public creatingEnvironment: boolean;

  public environmentForm: FormGroup;

  public environments: any[];

  constructor(
    private shareDataService: ShareDataService,
    private environmentsService: EnvironmentsService,
    private fb: FormBuilder,
    private webSocket: WebSocketService,
    private FormValidationErrors: FormValidatorErrors) {

    this.clientId = this.shareDataService.client.id;
    this.environments = this.shareDataService.client.environments;

    this.environments.forEach(environment => environment.status = 0)

  }

  ngOnInit() {

    this.environmentForm = this.fb.group({
      title: ['', [Validators.required]],
      update_time: ['', [Validators.required]]
    });

  }

  public submitEnvironment(): void {

    this.FormValidationErrors.getFormValidationErrors(this.environmentForm);

    if (this.environmentForm.valid) {

      this.creatingEnvironment = true;

      const formControls = this.environmentForm.controls;

      const environmentData = {
        title: formControls.title.value,
        clientId: this.clientId
      }


      this.environmentsService.post(environmentData)
        .subscribe(
          res => {
            this.environments.push(res.new_environment);
            this.environmentForm.reset();
            this.creatingEnvironment = false;
            this.createEnvironmentToggle = false;

            this.webSocket.newEnvironmentEmitter.next(res.new_environment);


          },
          () => {
            this.creatingEnvironment = false;
          }
        );

    };

  }

  public deleteEnvironment(environment: any): void {

    this.environmentsService.delete(environment.id).subscribe(
      res => {

        this.environments.splice(this.environments.indexOf(environment), 1);

        this.webSocket.deletedEnvironmentEmitter.next(res.deleted_environment);

      });

  }

}
