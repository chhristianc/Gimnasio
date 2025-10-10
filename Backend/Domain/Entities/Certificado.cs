using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Certificado
    {
        public int Id { get; set; }
        public int EntrenadorId { get; set; }
        public string Institucion { get; set; }
        public DateTime FechaEmision { get; set; }
        public DateTime FechaVencimiento { get; set; }

        public Entrenador Entrenador { get; set; }
    }
}
