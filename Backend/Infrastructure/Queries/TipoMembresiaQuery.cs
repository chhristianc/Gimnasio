using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Queries
{
    public class TipoMembresiaQuery : ITipoMembresiaQuery
    {
        private readonly AppDbContext _context;

        public TipoMembresiaQuery(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TipoMembresia> GetById(int id)
        {
            var tipoMembresia = await _context.TiposMembresia.FirstOrDefaultAsync(tm => tm.Id == id);

            return tipoMembresia;
        }

    }
}
