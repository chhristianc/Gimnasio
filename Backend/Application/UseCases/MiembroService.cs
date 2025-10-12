using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class MiembroService : IMiembroService
    {
        private readonly IMiembroQuery _query;
        private readonly IMiembroCommand _command;
        private readonly IDescuentoService _descuentoService;
        private readonly ITipoMembresiaService _tipoMembresiaService;

        public MiembroService(IMiembroQuery query, IMiembroCommand command, IDescuentoService descuentoService, ITipoMembresiaService tipoMembresiaService)
        {
            _query = query;
            _command = command;
            _descuentoService = descuentoService;
            _tipoMembresiaService = tipoMembresiaService;
        }

        public async Task Add(MiembroAddRequest request)
        {
            var tipomembrecia = await _tipoMembresiaService.GetById(request.TipoMembresiaId);

            decimal costo = tipomembrecia.Costo;
            int duracionDias = tipomembrecia.DuracionDias;
            decimal porcentajeDescuento = (await _descuentoService.GetById(request.DescuentoId)).Porcentaje;
            

            var miembro = new Miembro
            {
                Nombre = request.Nombre,
                Dni = request.Dni,
                Direccion = request.Direccion,
                Telefono = request.Telefono,
                FechaNacimiento = request.FechaNacimiento,
                UrlFoto = request.UrlFoto,
                DescuentoId = request.DescuentoId,

                Membresia = new Membresia
                {
                    TipoMembresiaId = request.TipoMembresiaId,
                    CostoFinal = costo - (costo * porcentajeDescuento),
                    FechaInicio = DateTime.Now.Date,
                    FechaVencimiento = DateTime.Now.Date.AddDays(duracionDias)
                }
            };

           await _command.Add(miembro);
        }

        public async Task<List<MiembroResponse>> GetAll()
        {
            var miembros = await _query.GetAll();

            var response = miembros.Select(m => new MiembroResponse
            {
                Id = m.Id,
                Nombre = m.Nombre,
                Dni = m.Dni,
                Direccion = m.Direccion,
                Telefono = m.Telefono,
                FechaNacimiento = m.FechaNacimiento,
                UrlFoto = m.UrlFoto
            }).ToList();

            return response;
        }

        public async Task<MiembroResponse> GetById(int id)
        {
            var miembro = await _query.GetById(id);

            var response = new MiembroResponse
            {
                Id = miembro.Id,
                Nombre = miembro.Nombre,
                Dni = miembro.Dni,
                Direccion = miembro.Direccion,
                Telefono = miembro.Telefono,
                FechaNacimiento = miembro.FechaNacimiento,
                UrlFoto = miembro.UrlFoto
            };

            return response;
        }

        public async Task Update(int id, MiembroUpdateRequest request)
        {
            var miembro = await _query.GetById(id);

            miembro.Nombre = request.Nombre;
            miembro.Dni = request.Dni;
            miembro.Direccion = request.Direccion;
            miembro.Telefono = request.Telefono;
            miembro.FechaNacimiento = request.FechaNacimiento;
            miembro.UrlFoto = request.UrlFoto;

            await _command.Update(miembro);
        }

        public async Task Delete(int id)
        {
            var miembro = await _query.GetById(id);

            await _command.Delete(miembro);
        }
    }
}
