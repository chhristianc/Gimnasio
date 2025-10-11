using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Sesion
    {
        public int Id { get; set; }
        public int ClaseId { get; set; }
        public int ActividadId { get; set; }

        public Clase Clase { get; set; }
        public Actividad Actividad { get; set; }
    }
}
