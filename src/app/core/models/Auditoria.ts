export interface Auditoria {
  codigo_au: number;
  usuario_au: string;
  tabla: string;
  accion: string;
  registro: string;
  nombre: string;
  descripcion?: string;
  fecha_hora: string;
}
