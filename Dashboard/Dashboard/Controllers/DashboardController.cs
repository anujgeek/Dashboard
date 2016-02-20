using Dashboard.Common;
using Dashboard.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Dashboard.Controllers
{
    public class DashboardController : ApiController
    {
        private DashboardDBContext db = new DashboardDBContext();

        [HttpGet]
        [ActionName("StudentTypesProcessed")]
        public IHttpActionResult GetStudentTypesProcessed()
        {
            var RequestQueryPairs = Request.GetQueryNameValuePairs().ToDictionary(p => p.Key, p => p.Value);

            int draw = Int32.Parse(RequestQueryPairs["draw"]);

            var allStudentTypes = db.StudentTypes.ToList().Select(st => Utilities.ConvertEntity(st)).ToList();

            DataTableData<StudentTypeEntity> dataTableData = new DataTableData<StudentTypeEntity>();
            dataTableData.draw = draw;
            dataTableData.recordsTotal = allStudentTypes.Count;
            dataTableData.data = allStudentTypes;
            dataTableData.recordsFiltered = allStudentTypes.Count;

            return Ok(dataTableData);
        }

        [HttpGet]
        [ActionName("StudentsProcessed")]
        public IHttpActionResult GetStudentsProcessed()
        {
            List<StudentEntity> allStudentsProcessed = db.Students.ToList().Select(s => Utilities.ConvertEntity(s)).ToList();

            var RequestQueryPairs = Request.GetQueryNameValuePairs().ToDictionary(p => p.Key, p => p.Value);

            int draw = Int32.Parse(RequestQueryPairs["draw"]);

            DataTableData<StudentEntity> dataTableData = new DataTableData<StudentEntity>();
            dataTableData.draw = draw;

            int SelectedStudentTypeId = 0;
            if (Int32.TryParse(RequestQueryPairs["SelectedStudentTypeId"], out SelectedStudentTypeId) == false)
            {
                dataTableData.recordsTotal = 0;
                dataTableData.data = new List<StudentEntity>();
                dataTableData.recordsFiltered = 0;

                return Ok(dataTableData);
            }
            else
            {
                allStudentsProcessed = allStudentsProcessed.Where(s => Int32.Parse(s.StudentTypeId) == SelectedStudentTypeId).ToList();
                dataTableData.recordsTotal = allStudentsProcessed.Count;

                int start = Int32.Parse(RequestQueryPairs["start"]);
                int length = Int32.Parse(RequestQueryPairs["length"]);

                if (length == -1)
                {
                    length = dataTableData.recordsTotal;
                }

                string search = RequestQueryPairs["search.value"];
                if (!String.IsNullOrEmpty(search))
                {
                    allStudentsProcessed = allStudentsProcessed.Where(s => s.Name.Contains(search, StringComparison.CurrentCultureIgnoreCase)).ToList();
                }

                if (RequestQueryPairs["order[0].column"] != null && RequestQueryPairs["order[0].dir"] != null)
                {
                    int sortColumn = Int32.Parse(RequestQueryPairs["order[0].column"]);
                    string sortDirection = RequestQueryPairs["order[0].dir"];

                    if (sortColumn == 0)
                    {
                        allStudentsProcessed.Sort((x, y) => Utilities.SortInteger(x.StudentId, y.StudentId, sortDirection));
                    }
                    else if (sortColumn == 1)
                    {
                        allStudentsProcessed.Sort((x, y) => Utilities.SortString(x.Name, y.Name, sortDirection));
                    }
                    else if (sortColumn == 2)
                    {
                        allStudentsProcessed.Sort((x, y) => Utilities.SortDateTime(x.DOB, y.DOB, sortDirection));
                    }
                    else if (sortColumn == 3)
                    {
                        allStudentsProcessed.Sort((x, y) => Utilities.SortString(x.Gender, y.Gender, sortDirection));
                    }
                }

                dataTableData.recordsFiltered = allStudentsProcessed.Count;
                allStudentsProcessed = allStudentsProcessed.GetRange(start, Math.Min(length, allStudentsProcessed.Count - start));
                dataTableData.data = allStudentsProcessed;
                return Ok(dataTableData);
            }
        }

        [HttpGet]
        [ActionName("StudentDetails")]
        public IHttpActionResult GetStudentDetails(int id)
        {
            Student student = db.Students.Find(id);
            if (student == null)
            {
                return NotFound();
            }

            return Ok(Utilities.ConvertEntity(student));
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool StudentTypeExists(int id)
        {
            return db.StudentTypes.Count(e => e.StudentTypeId == id) > 0;
        }

        private bool StudentExists(int id)
        {
            return db.Students.Count(e => e.StudentId == id) > 0;
        }
    }
}