using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CatalogoDireccionesApp.Models;
using Microsoft.EntityFrameworkCore;


namespace CatalogoDireccionesApp.Controllers
{
    public class AddressController : Controller
    {
        private readonly IAddressRepository _addressRepository;

        public AddressController(IAddressRepository addressRepository)
        {
            _addressRepository = addressRepository;
        }

        // GET: AddressController
        public async Task<ActionResult> Index()
        {
            var addresses = await _addressRepository.GetAll();
            return View(addresses);
        }

        //Address
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var direcciones = await _addressRepository.GetAll();
            return Ok(direcciones);
        }

        // Obtener lista de Ciudades
        public async Task<IActionResult> GetCities()
        {
            var cities = await _addressRepository.GetCities();
            return Ok(cities);
        }

        // Obtener lista de Estados
        public async Task<IActionResult> GetStates()
        {
            var states = await _addressRepository.GetStates();
            return Ok(states);
        }

        //Actualizar dirección
        [HttpPost]
        public async Task<IActionResult> EditAddress(int id, string city, string stateProvince)
        {
            // Validar los parámetros
            if (string.IsNullOrEmpty(city) || string.IsNullOrEmpty(stateProvince))
                return BadRequest("Los datos no son válidos.");

            var direccionExistente = await _addressRepository.GetById(id);
            if (direccionExistente == null) return NotFound();

            // Actualizar los campos
            direccionExistente.City = city;
            direccionExistente.StateProvince = stateProvince;

            await _addressRepository.Update(direccionExistente);

            // Redirigir o devolver una respuesta adecuada
            return RedirectToAction("Index");
        }

    }
}
