import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductoService } from '../../../../core/services/producto.service';
import { CategoriaService } from '../../../../core/services/categoria.service'; 
import { MarcaService } from '../../../../core/services/marca.service'; 
import { UnidadMedidaService } from '../../../../core/services/unidad.medida.service'; 
import { Producto } from '../../../../core/models/Producto';
import { Categoria } from '../../../../core/models/Categoria';
import { Marca } from '../../../../core/models/Marca';
import { UnidadMedida } from '../../../../core/models/UnidadMedida';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [DatePipe]
})
export class ProductoComponent implements OnInit, AfterViewInit {
  @ViewChild('productoForm', { static: false }) productoForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id_producto', 'nombre', 'precio_compra', 'precio_venta', 'codigo', 'estado', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<Producto>();

  producto: Producto = new Producto(
    '',      // nombre
    0,       // precio_compra
    0,       // precio_venta
    '',      // codigo
    0,       // estock
    0,       // estock_minimo
    0,       // marca
    0,       // categoria
    0,       // unidad_medida
    null,    // descripcion
    true     // estado (por defecto activo)
  );

  categorias: Categoria[] = [];
  marcas: Marca[] = [];
  unidadesMedida: UnidadMedida[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService, // Servicio de categoría
    private marcaService: MarcaService, // Servicio de marca
    private unidadMedidaService: UnidadMedidaService, // Servicio de unidad de medida
    private snack: MatSnackBar,
    private datePipe: DatePipe
) {}

  ngOnInit() {
      this.obtenerProductos();
      this.obtenerCategorias();
      this.obtenerMarcas();
      this.obtenerUnidadesMedida();
  }

  obtenerProductos() {
    this.productoService.getProductoLista().subscribe(productos => {
        this.dataSource.data = productos.map(producto => ({
            ...producto,
            created_at: this.datePipe.transform(producto.created_at, 'yyyy-MM-dd HH:mm'), 
            update_at: this.datePipe.transform(producto.update_at, 'yyyy-MM-dd HH:mm')
        }));
    });
  }

  obtenerCategorias() {
      this.categoriaService.getCategoriaLista().subscribe(categorias => { // Usa el servicio de categoría
          this.categorias = categorias;
      }, error => {
          this.onError('Error al obtener categorías');
      });
  }

  obtenerMarcas() {
      this.marcaService.getMarcaLista().subscribe(marcas => { // Usa el servicio de marca
          this.marcas = marcas;
      }, error => {
          this.onError('Error al obtener marcas');
      });
  }

  obtenerUnidadesMedida() {
      this.unidadMedidaService.getUnidadMedidaLista().subscribe(unidades => { // Usa el servicio de unidad de medida
          this.unidadesMedida = unidades;
      }, error => {
          this.onError('Error al obtener unidades de medida');
      });
  }


  guardarProducto() {
      if (this.productoForm.valid) {
          if (this.producto.id_producto) {
              this.productoService.putActualizarProducto(this.producto.id_producto, this.producto).subscribe({
                  next: () => this.onSuccess('Producto actualizado con éxito'),
                  error: () => this.onError('Error al actualizar el producto')
              });
          } else {
              this.productoService.postAgregarProducto(this.producto).subscribe({
                  next: () => this.onSuccess('Producto guardado con éxito'),
                  error: () => this.onError('Error al guardar el producto')
              });
          }
      } else {
          this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
      }
  }

  eliminarProducto(id: number) {
      this.productoService.eliminarProducto(id).subscribe(() => {
          this.obtenerProductos();
      });
  }

  editarProducto(producto: Producto) {
      this.producto = { ...producto };  // Clonar el objeto producto para evitar referencia directa
      this.abrirModal();  // Abrir el modal con los datos del producto actual
  }

  onSuccess(message: string) {
      Swal.fire('Éxito', message, 'success');
      this.obtenerProductos();
      this.cerrarModal();  // Cerrar el modal después del éxito
  }

  onError(message: string) {
      Swal.fire('Error', message, 'error');
  }

  cancelar() {
      this.producto = new Producto(
          '',      // nombre
          0,       // precio_compra
          0,       // precio_venta
          '',      // codigo
          0,       // estock
          0,       // estock_minimo
          0,       // marca
          0,       // categoria
          0,       // unidad_medida
          null,    // descripcion
          true     // estado (por defecto activo)
      );

      this.productoForm.reset();
  }

  // --------------- venta modal ---------------
  abrirModal() {
      const modalElement = document.getElementById('agregarProductoModal');
      if (modalElement) {
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
          document.body.classList.add('modal-open');
      }
  }

  cerrarModal() {
    const modalElement = document.getElementById('agregarProductoModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.cancelar();  // Limpiar el formulario después de cerrar
    }
  }
  // -------------------------------------------------


  // ------- Mantener el Elementos por Pagina. -------
  ngAfterViewInit() { // Paginacion de la tabla:
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
  // -------------------------------------------------


}
