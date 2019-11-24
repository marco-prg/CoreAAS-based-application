app.controller('configCreationCtrl', function($scope, $location, $window, mainService, elementsService, configurationService, restService) {
    $scope.steps;
    $scope.STEP_ENUM;
    $scope.ISLAND_ENUM;
    $scope.stepsLength;
    $scope.terminalSwitch;
    $scope.configInformations;
    $scope.bLoading = false;

    $scope.init = function() {
        $scope.steps = 0;
        $scope.STEP_ENUM = {INIT: 0, STEP1: 1, STEP2: 2, STEP3: 3};
        $scope.ISLAND_ENUM = configurationService.ISLAND_ENUM;
        $scope.stepsLength = Object.values($scope.STEP_ENUM).length;
        $scope.bLoading = true;
        restService.getConfigurations().then(function successCallback(response) {
            $scope.$parent.configurationList = response.data;
            $scope.bLoading = false;
        }, function errorCallback(response) { $scope.bLoading = false; });
        $scope.terminalSwitch = {multiProcessingStation: true, sortingLine: true, vacuumGripper: true, automatedHighBayWarehouse: true};
        $scope.configInformations = {name: "", islands: {}, description: "", mapping: {}, id: ""};
    }

    $scope.nextStep = function() {
        if($scope.steps+1 < $scope.stepsLength) 
            $scope.steps++;

        if($scope.steps == $scope.STEP_ENUM.STEP1) {
            $scope.configInformations.name = "Configuration #" + configurationService.getNextConfigId($scope.$parent.configurationList);
            $scope.configInformations.islands = {multiProcessingStation: true, sortingLine: true, vacuumGripper: true, automatedHighBayWarehouse: true};
            $scope.configInformations.description = "Configuration #" + configurationService.getNextConfigId($scope.$parent.configurationList);
            $scope.configInformations.mapping = angular.copy(configurationService.getTerminalMappingList());
            $scope.configInformations.id = mainService.baseUrl + "configurations/" + configurationService.getNextConfigId($scope.$parent.configurationList).toString().padStart(3, '0');
        }
    }

    $scope.previousStep = function() {
        if($scope.steps > 1) 
            $scope.steps--;
    }

    $scope.selectIsland = function(selectedIsland) {
        $scope.configInformations.islands[selectedIsland] = !$scope.configInformations.islands[selectedIsland];
    }
    
    $scope.switchAllTerminals = function(island) {
        for(var i=0; i<$scope.configInformations.mapping[island].length; i++) {
            $scope.configInformations.mapping[island][i].value = $scope.terminalSwitch[island];
        }
    }

    $scope.checkActiveTerminals = function(island) {
        // Adjust islands final informations according to disabled terminals
        for(let i=0; i<$scope.configInformations.mapping[island].length; i++) {
            if($scope.configInformations.mapping[island][i].value) {
                $scope.terminalSwitch[island] = true;
                return;
            }
        }
        $scope.terminalSwitch[island] = false;
    }

    $scope.areActiveIsland = function() {
        for(let island in $scope.configInformations.islands) {
            if($scope.configInformations.islands[island]) {
                for(var i=0; i<$scope.configInformations.mapping[island].length; i++) {
                    if($scope.configInformations.mapping[island][i].value) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    $scope.submitConfig = function() {
        // Adjust terminals mapping final information for disabled island(s)
        for (let key in $scope.configInformations.islands) {
            if (!$scope.configInformations.islands[key]) {
                for (var i=0; i<$scope.configInformations.mapping[key].length; i++)
                $scope.configInformations.mapping[key][i].value = false;
            }
        }
        // Adjust islands final informations according to disabled terminals
        for(let island in $scope.configInformations.mapping) {
            $scope.configInformations.islands[island] = false;
            for(let i=0; i<$scope.configInformations.mapping[island].length; i++) {
                if($scope.configInformations.mapping[island][i].value) {
                    $scope.configInformations.islands[island] = true;
                    break;
                }
            }
        }

        $scope.bLoading = true;
        restService.createConfiguration({name: $scope.configInformations.name, islands: $scope.configInformations.islands, description: $scope.configInformations.description, mapping: $scope.configInformations.mapping, id: $scope.configInformations.id}).then(function successCallback(response) {
            $scope.bLoading = false;
            $window.location.href =  mainService.baseUrl + "configurations";
        }, function errorCallback(response) { $scope.bLoading = false; });
        
    }

    $scope.init();

    // Mapster initialization
    var basic_opts = { mapKey: 'island' };
    var initial_opts = $.extend({},basic_opts, { fill: true, fillOpacity: 0.6 });
    $('#factoryImageMap').mapster(initial_opts).mapster('snapshot').mapster('rebind',basic_opts);
});