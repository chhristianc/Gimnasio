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
    public class MiembroQuery : IMiembroQuery
    {
        private readonly AppDbContext _context;

        public MiembroQuery(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Miembro> GetById(int id)
        {
            var miembro = await _context.Miembros.FirstOrDefaultAsync(m => m.Id == id);

            return miembro;
        }

        public async Task<List<Miembro>> GetAll()
        {
            var miembro = await _context.Miembros.ToListAsync();

            return miembro;
        }
    }
}
