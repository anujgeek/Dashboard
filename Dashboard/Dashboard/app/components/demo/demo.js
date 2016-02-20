var DemoModule = angular.module('DemoModule');

DemoModule.constant('ServiceURLs',
    {
        StudentTypesProcessed: '/api/Dashboard/StudentTypesProcessed',
        StudentsProcessed: '/api/Dashboard/StudentsProcessed',
        StudentDetails: '/api/Dashboard/StudentDetails'
    });

DemoModule.controller('DemoController', DemoController);
function DemoController($scope, $http, ServiceURLs)
{
    $scope.InEditMode = false;

    $scope.SelectedStudentTypeId = '';
    $scope.SelectedStudentId = '';

    $scope.SelectedStudentDetails = { Id: null, Name: null, Gender: null, DOB: null };
    $scope.SelectedStudentDetailsBeforeEdit = { Id: null, Name: null, Gender: null, DOB: null };

    $scope.initialize = function ()
    {
        $(document).ready(function ()
        {
            $scope.SaveButtonTooltipConfig =
                {
                    filter: "#SaveButton",
                    content: "Save has been disabled for security reasons",
                    autoHide: false
                };

            input1 = $("#input1").kendoNumericTextBox(
                            {
                                format: '#',
                                decimals: 0,
                                min: 0
                            }).data("kendoNumericTextBox");

            input2 = $("#input2").kendoMaskedTextBox(
            {

            }).data("kendoMaskedTextBox");

            var GenderData =
            [
                { text: "Not Specified", value: "0" },
                { text: "Male", value: "1" },
                { text: "Female", value: "2" }
            ];

            input3 = $("#input3").kendoDropDownList(
            {
                dataTextField: "text",
                dataValueField: "value",
                dataSource: GenderData,
                index: 0
            }).data("kendoDropDownList");

            input4 = $("#input4").kendoDatePicker(
                {
                }).data("kendoDatePicker");

            $scope.EnableDisableEditControls = function (enable)
            {
                input1.enable(enable);
                input2.enable(enable);
                input3.enable(enable);
                input4.enable(enable);
            }

            $scope.EnableDisableEditControls(false);

            $scope.EditButtonClicked = function ()
            {
                $scope.InEditMode = true;
                $scope.EnableDisableEditControls(true);
            }

            $scope.CancelButtonClicked = function ()
            {
                $scope.SelectedStudentDetails.Id = $scope.SelectedStudentDetailsBeforeEdit.Id;
                $scope.SelectedStudentDetails.Name = $scope.SelectedStudentDetailsBeforeEdit.Name;
                $scope.SelectedStudentDetails.Gender = $scope.SelectedStudentDetailsBeforeEdit.Gender;
                $scope.SelectedStudentDetails.DOB = $scope.SelectedStudentDetailsBeforeEdit.DOB;

                input1.value(kendo.parseInt($scope.SelectedStudentDetails.Id));
                input3.value($scope.SelectedStudentDetails.Gender == "Male" ? "1" : "2");
                input4.value(kendo.parseDate($scope.SelectedStudentDetails.DOB, "d MMM yyyy"));

                $scope.InEditMode = false;
                $scope.EnableDisableEditControls(false);
            }

            table1 = $('#table1').DataTable(
                {
                    'processing': true,
                    'serverSide': true,
                    'info': true,
                    'stateSave': false,
                    'lengthMenu': [[10, 20, 50, -1], [10, 20, 50, "All"]],
                    'ajax':
                        {
                            'url': ServiceURLs.StudentTypesProcessed,
                            'type': 'GET',
                            'data': function (d)
                            {

                            }
                        },
                    'columns':
                        [
                            { 'data': 'Title', 'orderable': false },
                            { 'data': 'Capacity', 'orderable': false },
                            { 'data': 'Enrolled', 'orderable': false }
                        ],
                    'ordering': false,
                    'orderMulti': false,
                    'order': [],
                    "searching": false
                });

            table2 = $('#table2').DataTable(
                {
                    'processing': true,
                    'serverSide': true,
                    'info': true,
                    'stateSave': false,
                    'lengthMenu': [[10, 20, 50, -1], [10, 20, 50, "All"]],
                    'language':
                        {
                            zeroRecords: 'Nothing found',
                            emptyTable: 'Please select a student type',
                            search: '_INPUT_',
                            searchPlaceholder: 'Search by name...'
                        },
                    'ajax':
                        {
                            'url': ServiceURLs.StudentsProcessed,
                            'type': 'GET',
                            'data': function (d)
                            {
                                d.SelectedStudentTypeId = $scope.SelectedStudentTypeId;
                            }
                        },
                    "deferLoading": 0,
                    'columns':
                        [
                            { 'data': 'StudentId', 'orderable': true },
                            { 'data': 'Name', 'orderable': true },
                            { 'data': 'DOB', 'orderable': true },
                            { 'data': 'Gender', 'orderable': true }
                        ],
                    'ordering': true,
                    'orderMulti': false,
                    'order': [[0, 'asc']]
                });

            $('#table1 tbody').on('click', 'tr', function ()
            {
                if ($(this).hasClass('selected'))
                {
                    $(this).removeClass('selected');

                    $scope.SelectedStudentTypeId = "";
                    table2.ajax.reload();
                }
                else
                {
                    table1.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');

                    $scope.SelectedStudentTypeId = table1.row(this).data().StudentTypeId;
                    table2.ajax.reload();
                }
            });

            $('#table2 tbody').on('click', 'tr', function ()
            {
                if ($(this).hasClass('selected'))
                {
                    $(this).removeClass('selected');

                    $scope.SelectedStudentId = "";
                    $scope.SelectedStudentDetails.Id = $scope.SelectedStudentDetailsBeforeEdit.Id = null;
                    $scope.SelectedStudentDetails.Name = $scope.SelectedStudentDetailsBeforeEdit.Name = null;
                    $scope.SelectedStudentDetails.Gender = $scope.SelectedStudentDetailsBeforeEdit.Gender = null;
                    $scope.SelectedStudentDetails.DOB = $scope.SelectedStudentDetailsBeforeEdit.DOB = null;

                    input1.value(null);
                    input2.value(null);
                    input3.value(null);
                    input4.value(null);
                }
                else
                {
                    table2.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');

                    $scope.SelectedStudentId = table2.row(this).data().StudentId;

                    $http.get(ServiceURLs.StudentDetails,
                        {
                            params:
                                {
                                    id: $scope.SelectedStudentId
                                }
                        })
                        .then(
                        function successCallback(response)
                        {
                            $scope.SelectedStudentDetails.Id = $scope.SelectedStudentDetailsBeforeEdit.Id = response.data.StudentId;
                            $scope.SelectedStudentDetails.Name = $scope.SelectedStudentDetailsBeforeEdit.Name = response.data.Name;
                            $scope.SelectedStudentDetails.Gender = $scope.SelectedStudentDetailsBeforeEdit.Gender = response.data.Gender;
                            $scope.SelectedStudentDetails.DOB = $scope.SelectedStudentDetailsBeforeEdit.DOB = response.data.DOB;

                            input1.value(kendo.parseInt($scope.SelectedStudentDetails.Id));
                            input3.value($scope.SelectedStudentDetails.Gender == "Male" ? "1" : "2");
                            input4.value(kendo.parseDate($scope.SelectedStudentDetails.DOB, "d MMM yyyy"));
                        },
                        function errorCallback(response)
                        {
                            $scope.SelectedStudentDetails.Id = $scope.SelectedStudentDetailsBeforeEdit.Id = null;
                            $scope.SelectedStudentDetails.Name = $scope.SelectedStudentDetailsBeforeEdit.Name = null;
                            $scope.SelectedStudentDetails.Gender = $scope.SelectedStudentDetailsBeforeEdit.Gender = null;
                            $scope.SelectedStudentDetails.DOB = $scope.SelectedStudentDetailsBeforeEdit.DOB = null;

                            input1.value(null);
                            input2.value(null);
                            input3.value(null);
                            input4.value(null);
                        });
                }
            });
        });
    };
};
DemoController.$inject = ['$scope', '$http', 'ServiceURLs'];