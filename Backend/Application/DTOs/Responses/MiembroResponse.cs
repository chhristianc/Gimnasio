using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Responses
{
    public class MiembroResponse
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Dni { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string? UrlFoto { get; set; }

        public Membresia Membresia { get; set; }
        public ICollection<Inscripcion> Inscripciones { get; set; }
    }
}
