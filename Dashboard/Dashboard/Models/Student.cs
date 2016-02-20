namespace Dashboard.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Student
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int StudentId { get; set; }

        [StringLength(255)]
        public string Name { get; set; }

        public DateTime? DOB { get; set; }

        [StringLength(50)]
        public string Gender { get; set; }

        public int StudentTypeId { get; set; }

        public virtual StudentType StudentType { get; set; }
    }

    public class StudentEntity
    {
        public string StudentTypeId { get; set; }

        public string StudentTypeTitle { get; set; }

        public string StudentId { get; set; }

        public string Name { get; set; }

        public string DOB { get; set; }

        public string Gender { get; set; }
    }
}
