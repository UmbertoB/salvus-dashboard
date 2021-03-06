import { FormGroup, FormBuilder } from '@angular/forms';
import { ShareDataService, ClientsService } from 'src/app/services';
import { FilterCriteria } from 'src/app/utils/crud/filter-criteria';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListComponent } from 'src/app/utils/crud/list-components.utils';
import { collapse } from 'src/app/utils/animations/animations';

@Component({
  selector: 'app-test',
  templateUrl: './clients-list.component.html',
  styleUrls: ['./clients-list.component.css'],
  animations: [collapse]
})
export class ClientsListComponent extends ListComponent implements OnInit {

  public filterForm: FormGroup;
  public clearFiltersBtn: boolean;
  public currentListStatus: number;


  public tableHeaders = [
    { title: 'Nome', value: 'name', sortable: true },
    { title: 'Contato', value: 'contact', sortable: false },
    { title: 'Ambientes', value: 'environments', sortable: false },
    { title: 'Criado', value: 'created_at', sortable: true }
  ];

  public TABS = [
    { title: 'Ativos',   value: 1 },
    { title: 'Inativos', value: 2 },
    { title: 'De Alta',  value: 3 },
  ];

  constructor(private clientsService: ClientsService,
    private shareData: ShareDataService,
    private router: Router,
    private fb: FormBuilder) {
    super();

    this.filterCriteria = new FilterCriteria();
    this.resource = this.clientsService;
    this.shareDataService = this.shareData;
  }

  ngOnInit() {

    this.filterForm = this.fb.group({
      search: [''],
      health_insurance: ['']
    });

    this.filterCriteria.addListParams();
    this.filterCriteria.addParam('patient_status', 1);
    this.currentListStatus = 1;

    this.loadData();
  }

  public submitFilters() {

    const controls = this.filterForm.controls;
    let countFilters = 0;

    if (controls.health_insurance.value) {
      this.filterCriteria.addParam('health_insurance', this.filterForm.controls.health_insurance.value);
      countFilters += 1;
    } else {
      this.filterCriteria.removeParam('health_insurance');
    }

    if (controls.search.value) {
      this.filterCriteria.addParam('search', this.filterForm.controls.search.value);
      countFilters += 1;

    } else {
      this.filterCriteria.removeParam('search');
    }

    if (countFilters > 0) this.clearFiltersBtn = true;
    else this.clearFiltersBtn = false;

    this.loadData();

  }

  public clearFilters() {
    this.filterCriteria.clearParams();
    this.filterCriteria.addListParams();

    this.filterForm.reset();

    this.clearFiltersBtn = false;

    this.loadData();
  }

  changeListStatus(status): void {
    if (this.currentListStatus !== status) {
      this.currentListStatus = status;
      switch (status) {
        case 1: this.filterCriteria.addParam('patient_status', 1); break;
        case 2: this.filterCriteria.addParam('patient_status', 2); break;
        case 3: this.filterCriteria.addParam('patient_status', 3); break;
      }

      this.loadData();
    }
  }


  /**
   * Direciona para a rota de detalhes do paciente
   * @param id (number)
   */
  public show(id: number) {
    this.router.navigate([`home/clients/show/${id}`]);
  }

  /**
   * Exclui um paciente
   * @param id (number)
   */
  public delete(id: number) {
    this.clientsService.delete(id).subscribe(
      () => {
        this.loadData();

      }
    );
  }

}
