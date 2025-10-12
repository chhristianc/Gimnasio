using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public DbSet<Actividad> Actividades { get; set; }
        public DbSet<Asistencia> Asistencias { get; set; }
        public DbSet<Certificado> Certificados { get; set; }
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Descuento> Descuentos { get; set; }
        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<Horario> Horarios { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<Membresia> Membresias { get; set; }
        public DbSet<Miembro> Miembros { get; set; }
        public DbSet<Pago> Pagos { get; set; }
        public DbSet<Sesion> Sesiones { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TipoMembresia> TiposMembresia { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Actividad>(entity =>
            {
                entity.ToTable("Actividad");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).ValueGeneratedOnAdd();
                entity.Property(a => a.Nombre).IsRequired();
                entity.Property(a => a.Descripcion);

                entity.HasMany(a => a.Sesiones)
                    .WithOne(s => s.Actividad)
                    .HasForeignKey(s => s.ActividadId)
                    .IsRequired();

                entity.HasData(
                    new Actividad { Id = 1, Nombre = "Zumba", Descripcion = "" },
                    new Actividad { Id = 2, Nombre = "CrossFit", Descripcion = "" }
                    );
            });

            modelBuilder.Entity<Asistencia>(entity =>
            {
                entity.ToTable("Asistencia");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).ValueGeneratedOnAdd();
                entity.Property(a => a.Fecha).IsRequired();
            });

            modelBuilder.Entity<Certificado>(entity =>
            {
                entity.ToTable("Certificado");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Institucion).IsRequired();
                entity.Property(c => c.FechaEmision).IsRequired();
                entity.Property(c => c.FechaVencimiento).IsRequired();

                entity.HasOne(c => c.Entrenador)
                    .WithOne(e => e.Certificado)
                    .HasForeignKey<Certificado>(c => c.EntrenadorId)
                    .IsRequired();

            });

            modelBuilder.Entity<Clase>(entity =>
            {
                entity.ToTable("Clase");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).ValueGeneratedOnAdd();
                entity.Property(c => c.Cupo).IsRequired();

                entity.HasMany(c => c.Horarios)
                    .WithOne(h => h.Clase)
                    .HasForeignKey(h => h.ClaseId)
                    .IsRequired();

                entity.HasMany(c => c.Sesiones)
                    .WithOne(s => s.Clase)
                    .HasForeignKey(s => s.ClaseId)
                    .IsRequired();

                entity.HasMany(c => c.Inscripciones)
                    .WithOne(i => i.Clase)
                    .HasForeignKey(i => i.ClaseId)
                    .IsRequired();

                entity.HasMany(c => c.Asistencias)
                    .WithOne(a => a.Clase)
                    .HasForeignKey(a => a.ClaseId)
                    .IsRequired(false);
            });

            modelBuilder.Entity<Descuento>(entity =>
            {
                entity.ToTable("Descuento");
                entity.HasKey(d => d.Id);
                entity.Property(d => d.Id).ValueGeneratedOnAdd();
                entity.Property(d => d.Tipo).HasConversion<string>().IsRequired();
                entity.Property(d => d.Porcentaje).IsRequired();

                entity.HasMany(d => d.Miembros)
                    .WithOne(m => m.Descuento)
                    .HasForeignKey(m => m.DescuentoId)
                    .IsRequired();

                entity.HasData(
                    new Descuento { Id = 1, Tipo = TipoDescuento.Ninguno, Porcentaje = 0m },
                    new Descuento { Id = 2, Tipo = TipoDescuento.Estudiante, Porcentaje = 0.10m },
                    new Descuento { Id = 3, Tipo = TipoDescuento.Jubilado, Porcentaje = 0.15m },
                    new Descuento { Id = 4, Tipo = TipoDescuento.GrupoFamiliar, Porcentaje = 0.20m }
                    ); ;
            });

            modelBuilder.Entity<Entrenador>(entity =>
            {
                entity.UseTpcMappingStrategy();

                entity.ToTable("Entrenador");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                entity.HasMany(e => e.Clases)
                    .WithOne(c => c.Entrenador)
                    .HasForeignKey(c => c.EntrenadorId)
                    .IsRequired();

                entity.HasData(
                    new Entrenador { Id = 1, Nombre = "Pablo Perez", Dni = "42151500" },
                    new Entrenador { Id = 2, Nombre = "María Fernandez", Dni = "29525462" },
                    new Entrenador { Id = 3, Nombre = "Lucas García", Dni = "38252551" }
                    );
            });

            modelBuilder.Entity<Horario>(entity =>
            {
                entity.ToTable("Horario");
                entity.HasKey(h => h.Id);
                entity.Property(h  => h.Id).ValueGeneratedOnAdd();
                entity.Property(h => h.Dia).IsRequired();
                entity.Property(h => h.HoraInicio).IsRequired();
                entity.Property(h => h.HoraFin).IsRequired();
            });

            modelBuilder.Entity<Inscripcion>(entity =>
            {
                entity.ToTable("Inscripcion");
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Id).ValueGeneratedOnAdd();
                entity.Property(i => i.FechaInscripcion).IsRequired();
            });

            modelBuilder.Entity<Membresia>(entity =>
            {
                entity.ToTable("Membresia");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).ValueGeneratedOnAdd();
                entity.Property(m => m.CostoFinal).IsRequired();
                entity.Property(m => m.FechaInicio).IsRequired();
                entity.Property(m => m.FechaVencimiento).IsRequired();

                entity.HasOne(m => m.Miembro)
                .WithOne(mi => mi.Membresia)
                .HasForeignKey<Membresia>(m => m.MiembroId)
                .IsRequired();

                entity.HasMany(m => m.Pagos)
                .WithOne(p => p.Membresia)
                .HasForeignKey(p => p.MembresiaId)
                .IsRequired();
            });

            modelBuilder.Entity<Miembro>(entity =>
            {
                entity.UseTpcMappingStrategy();

                entity.ToTable("Miembro");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).ValueGeneratedOnAdd();

                entity.HasMany(m => m.Inscripciones)
                    .WithOne(i => i.Miembro)
                    .HasForeignKey(i => i.MiembroId)
                    .IsRequired();

                entity.HasMany(m => m.Asistencias)
                    .WithOne(a => a.Miembro)
                    .HasForeignKey(a => a.MiembroId)
                    .IsRequired();
            });

            modelBuilder.Entity<Pago>(entity =>
            {
                entity.ToTable("Pago");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).ValueGeneratedOnAdd();
                entity.Property(p => p.Monto).IsRequired();
                entity.Property(p => p.Fecha).IsRequired();
                entity.Property(p => p.MetodoPago).IsRequired();
            });

            modelBuilder.Entity<Sesion>(entity =>
            {
                entity.ToTable("Sesion");
                entity.HasKey(s => s.Id);
                entity.Property(s => s.Id).ValueGeneratedOnAdd();
            });

            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("Ticket");
                entity.HasKey(t => t.Id);
                entity.Property(t => t.Id).ValueGeneratedOnAdd();
                entity.Property(t => t.FechaEmision).IsRequired();
                entity.Property(t => t.Detalle).IsRequired();

                entity.HasOne(t => t.Pago)
                    .WithOne(p => p.Ticket)
                    .HasForeignKey<Ticket>(t => t.PagoId)
                    .IsRequired();
            });

            modelBuilder.Entity<TipoMembresia>(entity =>
            {
                entity.ToTable("TipoMembresia");
                entity.HasKey(tm => tm.Id);
                entity.Property(tm => tm.Id).ValueGeneratedOnAdd();
                entity.Property(tm => tm.Nombre).IsRequired();
                entity.Property(tm => tm.DuracionDias).IsRequired();
                entity.Property(tm => tm.Costo).IsRequired();

                entity.HasMany(tm => tm.Membresias)
                .WithOne(m => m.TipoMembresia)
                .HasForeignKey(m => m.TipoMembresiaId)
                .IsRequired();

                entity.HasData(
                    new TipoMembresia { Id = 1, Nombre = "Mensual", DuracionDias = 30, Costo = 10000 },
                    new TipoMembresia { Id = 2, Nombre = "Anual", DuracionDias = 365, Costo = 100000 }
                    );
            });
        }
    }
}