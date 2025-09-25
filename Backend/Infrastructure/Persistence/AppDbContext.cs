using Domain.Entities;
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
        public DbSet<Clase> Clases { get; set; }
        public DbSet<Entrenador> Entrenadores { get; set; }
        public DbSet<Inscripcion> Inscripciones { get; set; }
        public DbSet<Membresia> Membresias { get; set; }
        public DbSet<Miembro> Miembros { get; set; }
        public DbSet<Pago> Pagos { get; set; }
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

                entity.HasMany(a => a.Clases)
                .WithOne(c => c.Actividad)
                .HasForeignKey(c => c.ActividadId)
                .IsRequired();
            });

            modelBuilder.Entity<Asistencia>(entity =>
            {
                entity.ToTable("Asistencia");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id).ValueGeneratedOnAdd();
                entity.Property(a => a.Fecha).IsRequired();
                entity.Property(a => a.InscripcionId).IsRequired();

                entity.HasOne(a => a.Inscripcion)
                .WithMany(i => i.Asistencias)
                .HasForeignKey(a => a.InscripcionId)
                .IsRequired();
            });

            modelBuilder.Entity<Clase>(entity =>
            {
                entity.ToTable("Clase");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).ValueGeneratedOnAdd();
                entity.Property(c => c.Dia).IsRequired();
                entity.Property(c => c.HoraInicio).IsRequired();
                entity.Property(c => c.HoraFin).IsRequired();
                entity.Property(c => c.Cupo).IsRequired();

                entity.HasOne(c => c.Actividad)
                .WithMany(a => a.Clases)
                .HasForeignKey(c => c.ActividadId)
                .IsRequired();

                entity.HasOne(c => c.Entrenador)
                .WithMany(e => e.Clases)
                .HasForeignKey(c => c.EntrenadorId);

                entity.HasMany(c => c.Inscripciones)
                .WithOne(i => i.Clase)
                .HasForeignKey(i => i.ClaseId)
                .IsRequired();
            });

            modelBuilder.Entity<Entrenador>(entity =>
            {
                entity.ToTable("Entrenador");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                entity.Property(e => e.Nombre).IsRequired();
                entity.Property(e => e.Dni).IsRequired();
                entity.Property(e => e.Direccion);
                entity.Property(e => e.Telefono);
                entity.Property(e => e.FechaNacimiento);
                entity.Property(e => e.Certificacion).IsRequired();

                entity.HasMany(e => e.Clases)
                .WithOne(c => c.Entrenador)
                .HasForeignKey(c => c.EntrenadorId);
            });

            modelBuilder.Entity<Inscripcion>(entity =>
            {
                entity.ToTable("Inscripcion");
                entity.HasKey(i => i.Id);
                entity.Property(i => i.Id).ValueGeneratedOnAdd();
                entity.Property(i => i.FechaInscripcion).IsRequired();

                entity.HasOne(i => i.Miembro)
                .WithMany(m => m.Inscripciones)
                .HasForeignKey(i => i.MiembroId)
                .IsRequired();

                entity.HasOne(i => i.Clase)
                .WithMany(c => c.Inscripciones)
                .HasForeignKey(i => i.ClaseId)
                .IsRequired();

                entity.HasMany(i => i.Asistencias)
                .WithOne(a => a.Inscripcion)
                .HasForeignKey(a => a.InscripcionId)
                .IsRequired();
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

                entity.HasOne(m => m.TipoMembresia)
                .WithMany(tm => tm.Membresias)
                .HasForeignKey(m => m.TipoMembresiaId)
                .IsRequired();

                entity.HasMany(m => m.Pagos)
                .WithOne(p => p.Membresia)
                .HasForeignKey(p => p.MembresiaId)
                .IsRequired();
            });

            modelBuilder.Entity<Miembro>(entity =>
            {
                entity.ToTable("Miembro");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).ValueGeneratedOnAdd();
                entity.Property(m => m.Nombre).IsRequired();
                entity.Property(m => m.Dni).IsRequired();
                entity.Property(m => m.Direccion);
                entity.Property(m => m.Telefono);
                entity.Property(m => m.FechaNacimiento);
                entity.Property(m => m.UrlFoto);

                entity.HasMany(m => m.Inscripciones)
                .WithOne(i => i.Miembro)
                .HasForeignKey(i => i.MiembroId)
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

                entity.HasOne(p => p.Membresia)
                .WithMany(m => m.Pagos)
                .HasForeignKey(p => p.MembresiaId)
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
                entity.Property(tm => tm.Descuento).IsRequired();

                entity.HasMany(tm => tm.Membresias)
                .WithOne(m => m.TipoMembresia)
                .HasForeignKey(m => m.TipoMembresiaId)
                .IsRequired();
            });
        }
    }
}