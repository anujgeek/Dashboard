var DirectivesModule = angular.module('DirectivesModule');

//Note
//parse: ui to data (value entered in ui is parsed to data)
//format: data to ui (value in data is formatted to eb presented in ui)
//naming convention: ui...data

DirectivesModule.directive('numberstring', function ()
{
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel)
        {
            function parse(v)
            {
                return kendo.toString(v);
            }
            function format(v)
            {
                return kendo.parseInt(v);
            }
            ngModel.$parsers.push(parse);
            ngModel.$formatters.push(format);
        }
    };
});