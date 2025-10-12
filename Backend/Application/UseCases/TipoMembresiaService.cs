using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class TipoMembresiaService : ITipoMembresiaService
    {
        private readonly ITipoMembresiaQuery _query;

        public TipoMembresiaService(ITipoMembresiaQuery query)
        {
            _query = query;
        }

        public async Task<TipoMembresia> GetById(int id)
        {
            return await _query.GetById(id);
        }
    }
}
