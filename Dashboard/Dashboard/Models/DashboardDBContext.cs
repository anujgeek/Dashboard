namespace Dashboard.Models
{
    using Common;
    using System;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity;
    using System.Linq;

    public partial class DashboardDBContext : DbContext
    {
        public DashboardDBContext()
            : base(Utilities.GetConnectionStringForDatabase())
        {
        }

        public virtual DbSet<Student> Students { get; set; }
        public virtual DbSet<StudentType> StudentTypes { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StudentType>()
                .HasMany(e => e.Students)
                .WithRequired(e => e.StudentType)
                .WillCascadeOnDelete(false);
        }
    }
}