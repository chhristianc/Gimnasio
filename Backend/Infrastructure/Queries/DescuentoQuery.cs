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
    public class DescuentoQuery : IDescuentoQuery
    {
        private readonly AppDbContext _context;

        public DescuentoQuery(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Descuento> GetById(int id) 
        {
            var descuento = await _context.Descuentos.FirstOrDefaultAsync(d => d.Id == id);

            return descuento;
        }
    }
}
