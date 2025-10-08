using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Commands
{
    public class MiembroCommand : IMiembroCommand
    {
        private readonly AppDbContext _context;

        public MiembroCommand(AppDbContext context)
        {
            _context = context;
        }

        public async Task Add(Miembro miembro)
        {
            await _context.AddAsync(miembro);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(Miembro miembro)
        {
            _context.Remove(miembro);
            await _context.SaveChangesAsync();
        }
    }
}