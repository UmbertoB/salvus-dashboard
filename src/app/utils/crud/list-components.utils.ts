import { MatPaginator, PageEvent } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TableHeaders, TableMetaData } from 'src/app/utils/typings/table.typing';


export class ListComponent {

    @ViewChild(MatPaginator) pagination: MatPaginator;

    protected resource: any;
    protected resourceFunction;
    protected filterCriteria;
    protected shareDataService;
    protected urlOptions;

    protected tableData: any[];
    protected tableHeaders: TableHeaders[];
    protected tableMetaData: TableMetaData;

    private sortedByHeader;
    private sortChanges = 0;


    // Pagination
    public status: string;
    public length: number;
    public page = 1;
    public selectedSize = 15;
    public pageSizeOptions: number[] = [5, 10, 15, 25, 50];
    public searchableFields: string[];
    public pageEvent: PageEvent;


    public constructor() { }


    /**
     * @TODO Adicionar comentário
     */
    loadData(): Observable<any> {

        this.shareDataService.activateLoadingScreen(true);

        return this.resource[this.resourceFunction ? this.resourceFunction : 'get']({ url: this.urlOptions || '', query: this.filterCriteria ? this.filterCriteria.params : {} }).subscribe(
            (res) => {
                if (res.data) this.tableData = res.data;
                if (res.meta) this.tableMetaData = res.meta;
                this.shareDataService.activateLoadingScreen(false);


            },
            () => {
                this.shareDataService.activateLoadingScreen(false);
            }
        );

    }

    public changeSort(tableHead): void {

        if (this.sortedByHeader && this.sortedByHeader.value !== tableHead.value) {
            this.sortedByHeader.sorted = null;
            this.sortChanges = 0;
        }

        if (this.sortedByHeader && this.sortedByHeader.value === tableHead.value || !tableHead.sorted) this.sortChanges += 1;

        this.sortedByHeader = tableHead;

        if (this.sortChanges === 3) {
            tableHead.sorted = null;
            this.filterCriteria.addParam('orderBy', 'id');
            this.filterCriteria.addParam('sortedBy', 'desc');
            this.sortChanges = 0;
        } else {
            tableHead.sorted = tableHead.sorted === 'asc' ? 'desc' : 'asc';
            this.filterCriteria.addParam('orderBy', tableHead.value); // tableHead.value.toString().replace(',', '.')
            this.filterCriteria.addParam('sortedBy', this.filterCriteria.params.sortedBy === 'asc' ? 'desc' : 'asc');
        }

        this.loadData();
    }


  public limitChange(newLimit) {
    this.selectedSize = newLimit;
    this.filterCriteria.addParam('limit', newLimit);
    this.filterCriteria.addParam('page', 1);
    this.loadData();
  }

  public paginationChange(newPage) {
    this.filterCriteria.addParam('page', newPage);
    this.loadData();
  }
  
}
