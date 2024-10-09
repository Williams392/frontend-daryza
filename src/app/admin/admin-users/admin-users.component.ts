import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../core/services/user.service';
import { User, Rol } from '../../core/models/User';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-ursers',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-ursers.component.css',
  providers: [DatePipe]
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'username', 'last_name', 'email', 'phone_number', 'roles', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild('userForm', { static: false }) userForm!: NgForm;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  user: User = new User();
  roles: Rol[] = [];
  selectedRole: Rol = { id: 0, name_role: '' };

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
        next: (users) => {
            //console.log('Usuarios obtenidos:', users); // Log para depuración
            this.dataSource.data = users.map(user => ({
                ...user,
                name_role: user.name_role || null
            }));
        },
        error: (err) => {
            console.error('Error al obtener usuarios', err);
        }
    });
  }


  getRoles(): void {
    this.userService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (err) => {
        console.error('Error al obtener roles', err);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  guardarUser(): void {
    if (this.userForm.valid) {
      if (this.selectedRole && this.selectedRole.id !== 0) {
        this.user.name_role = { id: this.selectedRole.id, name_role: this.selectedRole.name_role };
      } else {
        this.user.name_role = null;
      }

      const formData = new FormData();
      formData.append('username', this.user.username);
      formData.append('last_name', this.user.last_name);
      formData.append('email', this.user.email);
      formData.append('phone_number', this.user.phone_number);
      formData.append('password', this.user.password);
      formData.append('name_role', this.user.name_role ? this.user.name_role.toString() : '');

      if (this.user.id) {
        this.userService.updateUser(this.user.id, formData).subscribe({
          next: () => {
            this.getUsers();
            this.cerrarModal();
            Swal.fire('Éxito', 'Usuario actualizado con éxito', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Error al actualizar el usuario', 'error');
          }
        });
      } else {
        this.userService.createUser(formData).subscribe({
          next: () => {
            this.getUsers();
            this.cerrarModal();
            Swal.fire('Éxito', 'Usuario creado con éxito', 'success');
          },
          error: () => {
            Swal.fire('Error', 'Error al crear el usuario', 'error');
          }
        });
      }
    } else {
      Swal.fire('Error', 'Completa todos los campos requeridos', 'error');
    }
  }

  editarUser(user: User): void {
    this.user = { ...user };

    if (this.user.name_role) {
      this.selectedRole = this.user.name_role;
    } else {
      this.selectedRole = { id: 0, name_role: '' }; // Valor por defecto
    }

    this.abrirModal();
  }

  eliminarUser(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(id).subscribe(() => {
          this.getUsers();
          Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
        });
      }
    });
  }

  cancelar(): void {
    this.user = new User();  
    this.userForm.resetForm();  
  }

  // --------------- venta modal ---------------
  abrirModal(): void {
    const modalElement = document.getElementById('agregarUserModal');
      if (modalElement) {
          modalElement.classList.add('show');
          modalElement.style.display = 'block';
          document.body.classList.add('modal-open');
      }
  }

  cerrarModal() {
    const modalElement = document.getElementById('agregarUserModal');
    if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      this.cancelar();  
    }
  }

  // ------- Mantener el Elementos por Pagina. -------
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    
    // Recuperar el tamaño de página almacenado y establecerlo en el paginador
    const storedPageSize = this.getPageSize();
    this.paginator.pageSize = storedPageSize;
    
    // Escuchar los cambios en el paginador y almacenar el nuevo tamaño en localStorage
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