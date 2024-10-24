import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ProductoService } from '../../../core/services/producto.service';
import { CategoriaService } from '../../../core/services/categoria.service'; 
import { MarcaService } from '../../../core/services/marca.service'; 
import { UnidadMedidaService } from '../../../core/services/unidad.medida.service'; 
import { Producto } from '../../../core/models/Producto';
import { Categoria } from '../../../core/models/Categoria';
import { Marca } from '../../../core/models/Marca';
import { UnidadMedida } from '../../../core/models/UnidadMedida';
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

    displayedColumns: string[] = ['id_producto', 'nombre', 'precio_compra', 'precio_venta', 'codigo', 'estado', 'imagen', 'editar', 'eliminar'];
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
        null,    // imagen (puedes inicializarlo como null si no tienes imagen al crear)
        null,    // descripcion
        true     // estado (por defecto activo)
    );

    imagenSeleccionada: File | null = null;
    manejarArchivo(event: any): void {
        this.imagenSeleccionada = event.target.files[0]; // Captura el archivo seleccionado
    }

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

    this.dataSource.filterPredicate = (data: Producto, filter: string) => {
        const transformedFilter = filter.trim().toLowerCase();
        return (
            (data.id_producto?.toString().toLowerCase().includes(transformedFilter) || false) || 
            (data.nombre_prod?.toLowerCase().includes(transformedFilter) || false)
            );
        };
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    obtenerProductos() {
        this.productoService.getProductoLista().subscribe(productos => {
            this.dataSource.data = productos.map(producto => ({
                ...producto,
                imagen: producto.imagen ? `http://127.0.0.1:8000/${producto.imagen}` : null, // Ajusta la ruta según tu servidor
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
            const productoData = new FormData(); // Utiliza FormData para enviar la imagen y otros datos
    
            // Asegúrate de agregar todos los campos, y usa el operador ?? para manejar undefined
            productoData.append('nombre_prod', this.producto.nombre_prod);
            productoData.append('precio_compra', (this.producto.precio_compra ?? 0).toString());
            productoData.append('precio_venta', (this.producto.precio_venta ?? 0).toString());
            productoData.append('codigo', this.producto.codigo);
            productoData.append('estock', (this.producto.estock ?? 0).toString());
            productoData.append('estock_minimo', (this.producto.estock_minimo ?? 0).toString());
            productoData.append('marca', (this.producto.marca ?? 0).toString());
            productoData.append('categoria', (this.producto.categoria ?? 0).toString());
            productoData.append('unidad_medida', (this.producto.unidad_medida ?? 0).toString());
            productoData.append('descripcion_pro', this.producto.descripcion_pro || '');
            productoData.append('estado', (this.producto.estado ?? true).toString());
    
            // Solo agregar la imagen si fue seleccionada
            if (this.imagenSeleccionada) {
                productoData.append('imagen', this.imagenSeleccionada);
            }
    
            // Si `id_producto` existe, actualiza el producto (PUT). Si no, crea un nuevo producto (POST)
            if (this.producto.id_producto) {
                // Usar `PUT` para actualizar el producto existente
                this.productoService.putActualizarProducto(this.producto.id_producto, productoData).subscribe({
                    next: () => this.onSuccess('Producto actualizado con éxito'),
                    error: (err) => {
                        console.error(err); // Para depurar el error
                        this.onError('Error al actualizar el producto');
                    }
                });
            } else {
                // Usar `POST` para agregar un nuevo producto
                this.productoService.postAgregarProducto(productoData).subscribe({
                    next: () => {
                        this.onSuccess('Producto agregado con éxito');
                        this.obtenerProductos(); // Actualiza la lista de productos después de agregar uno nuevo
                    },
                    error: (err) => {
                        console.error(err); // Para depurar el error
                        this.onError('Error al agregar el producto');
                    }
                });
            }
        } else {
            this.snack.open('Rellene todos los campos', 'Aceptar', { duration: 3000 });
        }
    }
    
    
    eliminarProducto(id: number): void {
        Swal.fire({
          title: '¿Estás seguro?',
          text: "¡No podrás revertir esto!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, eliminarlo',
          cancelButtonText: 'No, cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.productoService.eliminarProducto(id).subscribe(() => {
              this.obtenerProductos();
              Swal.fire('¡Eliminado!', 'El producto ha sido eliminado.', 'success');
            });
          }
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
        null,    // imagen (puedes inicializarlo como null)
        null,    // descripcion
        true     // estado (por defecto activo)
    );
    this.productoForm.reset();
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