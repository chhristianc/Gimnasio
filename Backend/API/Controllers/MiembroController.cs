using Application.DTOs.Requests;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MiembroController : ControllerBase
    {
        private readonly IMiembroService _service;

        public MiembroController(IMiembroService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> Create(MiembroAddRequest request)
        {
            await _service.Add(request);
            return StatusCode(201);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var miembros = await _service.GetAll();

            return Ok(miembros);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var miembro = await _service.GetById(id);

            return Ok(miembro);
        }

        [HttpPatch]
        public async Task<IActionResult> Update(int id, MiembroUpdateRequest request)
        {
            await _service.Update(id,request);

            return Ok();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.Delete(id);

            return NoContent();
        }
    }
}
