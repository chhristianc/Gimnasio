using Application.DTOs.Requests;
using Application.DTOs.Responses;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IMiembroService
    {
        Task Add(MiembroAddRequest request);
        Task<List<MiembroResponse>> GetAll();
        Task<MiembroResponse> GetById(int id);
        Task Update(int id, MiembroUpdateRequest request);
        Task Delete(int id);
    }
}
