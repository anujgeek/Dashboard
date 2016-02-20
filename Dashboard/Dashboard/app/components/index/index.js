var MainModule = angular.module('MainModule');

MainModule.controller('MainController', MainController);
function MainController($scope)
{
    $scope.VisibilityAbout = false;

    $scope.$on('$includeContentLoaded', function (event, url)
    {
        switch (url)
        {
            case 'app/components/about/about.html':
                {
                    break;
                }
            case 'app/components/demo/demo.html':
                {
                    break;
                }
        }
    });
};
MainController.$inject = ['$scope'];