var FiltersModule = angular.module('FiltersModule');

FiltersModule.filter('VisibilityToButtonStyleFilter', function ()
{
    return function (input)
    {
        return input ? 'btn btn-danger' : 'btn btn-primary';
    };
});