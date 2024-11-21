import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Auditoria } from '../../core/models/Auditoria';
import { AuditoriaService } from '../../core/services/auditoria.service';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrl: './auditoria.component.css',
  providers: [DatePipe]
})
export class AuditoriaComponent {

  @ViewChild('auditoriaForm', { static: false }) auditoriaForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['codigoAu', 'usuarioAu', 'tabla', 'accion', 'registro', 'nombre', 'descripcion', 'fechaHora'];
  dataSource = new MatTableDataSource<Auditoria>();

  constructor(
    private auditoriaService: AuditoriaService,
    private snack: MatSnackBar,
    private datePipe: DatePipe
  ) {}


  
  ngOnInit() {
    this.obtenerAuditoria();
  }
  
  obtenerAuditoria() {
    this.auditoriaService.getAuditoriaLista().subscribe(auditorias => {
      this.dataSource.data = auditorias.map(auditoria => ({
        ...auditoria,
      }));
    });
  }

  // -------------- Mantener el Elementos por Pagina. --------------
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.paginator.pageSize = this.getPageSize();
    this.paginator.page.subscribe(() => {
        this.setPageSize(this.paginator.pageSize);
    });
  }
  getPageSize(): number {
    const pageSize = localStorage.getItem('pageSize');
    return pageSize ? +pageSize : 5; // Valor por defecto 5
  }

  setPageSize(size: number) {
      localStorage.setItem('pageSize', size.toString());
  }
  // ------------------------------------------

}
