import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from '../../core/services/user.service';
import { User, Rol } from '../../core/models/User';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-ursers',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-ursers.component.css',
  providers: [DatePipe]
})
export class AdminUsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'username', 'last_name', 'email', 'phone_number', 'roles', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<User>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('userForm', { static: false }) userForm!: NgForm;
  
  user: User = new User();
  roles: Rol[] = [];
  isEditing: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
    this.getRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;  // Aquí es seguro usar paginator
  }

  getUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
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

  guardarUser(): void {
    if (this.userForm.valid) {
        if (this.user.name_role && this.user.name_role.length) {
            this.user.name_role = this.user.name_role.map(role => ({ id: role.id, name_role: role.name_role }));
        } else {
            this.user.name_role = [];
        }

        const formData = new FormData();
        formData.append('username', this.user.username);
        formData.append('last_name', this.user.last_name);
        formData.append('email', this.user.email);
        formData.append('phone_number', this.user.phone_number);
        formData.append('password', this.user.password);  // Asegúrate de incluir la contraseña
        formData.append('name_role', JSON.stringify(this.user.name_role));

        if (this.isEditing) {
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
    this.isEditing = true;
    this.user = { ...user };
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
    this.user = new User();  // Limpiar el objeto usuario
    this.isEditing = false;  // Reiniciar el estado de edición
    this.userForm.resetForm();  // Reiniciar el formulario
  }

}