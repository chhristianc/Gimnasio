using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Requests
{
    public class MiembroRequest
    {
        public string Nombre { get; set; }
        public string Dni { get; set; }
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string? UrlFoto { get; set; }
    }
}
