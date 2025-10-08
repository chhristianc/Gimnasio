using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Application.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.UseCases
{
    public class MiembroService : IMiembroService
    {
        private readonly IMiembroQuery _query;
        private readonly IMiembroCommand _command;

        public MiembroService(IMiembroQuery query, IMiembroCommand command)
        {
            _query = query;
            _command = command;
        }

        public async Task Add(MiembroRequest request)
        {
            var miembro = new Miembro
            {
                Nombre = request.Nombre,
                Dni = request.Dni,
                Direccion = request.Direccion,
                Telefono = request.Telefono,
                FechaNacimiento = request.FechaNacimiento,
                UrlFoto = request.UrlFoto
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
    }
}
