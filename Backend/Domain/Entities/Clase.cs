using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Clase
    {
        public int Id { get; set; }
        public int Cupo { get; set; }
        public int EntrenadorId { get; set; }

        public Entrenador Entrenador { get; set; }
        public ICollection<Horario> Horarios { get; set; }
        public ICollection<Sesion> Sesiones { get; set; }
        public ICollection<Inscripcion> Inscripciones { get; set; }
        public ICollection<Asistencia> Asistencias { get; set; }
    }
}
