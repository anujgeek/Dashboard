namespace Dashboard.Migrations
{
    using System;
    using System.Data.Entity.Migrations;

    public partial class M1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Students", "DOB", c => c.DateTime());
            DropColumn("dbo.Students", "Age");
        }

        public override void Down()
        {
            AddColumn("dbo.Students", "Age", c => c.Int());
            DropColumn("dbo.Students", "DOB");
        }
    }
}
