using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IMiembroCommand
    {
        Task Add(Miembro miembro);
        Task Update(Miembro miembro);
        Task Delete(Miembro miembro);
    }
}
