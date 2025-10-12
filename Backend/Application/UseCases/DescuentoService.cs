using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class DescuentoService : IDescuentoService
    {
        private readonly IDescuentoQuery _query;

        public DescuentoService(IDescuentoQuery query)
        {
            _query = query;
        }

        public async Task<Descuento> GetById(int id)
        {
            return await _query.GetById(id);
        }
    }
}
