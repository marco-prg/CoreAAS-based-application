var app = angular.module('myApp', ["ngRoute"]);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when("/descriptions", {
            templateUrl: "/templates/elementListTemplate.html",
            controller: "elementListCtrl"
        })
        .when("/descriptions/:name", {
            templateUrl: "/templates/elementTemplate.html",
            controller: "elementCtrl"
        })
        .when("/submodels", {
            templateUrl: "/templates/elementListTemplate.html",
            controller: "elementListCtrl"
        })
        .when("/submodels/:name", {
            templateUrl: "/templates/elementTemplate.html",
            controller: "elementCtrl"
        })
        .when("/assets", {
            templateUrl: "/templates/elementListTemplate.html",
            controller: "elementListCtrl"
        })
        .when("/assets/:name", {
            templateUrl: "/templates/elementTemplate.html",
            controller: "elementCtrl"
        })
        .when("/aas", {
            templateUrl: "/templates/elementListTemplate.html",
            controller: "elementListCtrl"
        })
        .when("/aas/:name", {
            templateUrl: "/templates/elementTemplate.html",
            controller: "elementCtrl"
        })
        .when("/dataspecs", {
            templateUrl: "/templates/elementListTemplate.html",
            controller: "elementListCtrl"
        })
        .when("/dataspecs/:name", {
            templateUrl: "/templates/elementTemplate.html",
            controller: "elementCtrl"
        })
        .when("/resources", {
            templateUrl: "/templates/resourcesTemplate.html",
            controller: "rscCtrl"
        })
        .when("/configurations", {
            templateUrl: "/templates/configurationListTemplate.html",
            controller: "configCtrl"
        })
        .when("/configurations/create", {
            templateUrl: "/templates/configurationCreateTemplate.html",
            controller: "configCtrl"
        })
        .when("/configurations/:name", {
            templateUrl: "/templates/configurationTemplate.html",
            controller: "configCtrl"
        })
        .when("/index.html", {
            templateUrl: "/templates/homeTemplate.html",
            controller: "mainCtrl"
        })
        .otherwise({redirectTo: "index.html"});
        $locationProvider.hashPrefix('coreaas'); 
});

app.controller('mainCtrl', function($scope, $window, $location, mainService, elementsService, configurationService) {
    $scope.currentSection;
    $scope.elements;
    $scope.configurationList;
    $scope.showList;

    $scope.init = function(){
        elementsService.init();
        configurationService.init();
        $scope.showList = {bShow1: false, bShow2: false, bShow3: false, bShow4: false, bShow5: false, bShow6: false};
        $scope.elements = elementsService.getElements();
        $scope.configurationList = configurationService.getConfigurations();
        $scope.currentSection = mainService.sections[$location.absUrl().split("/")[4]];

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })
    }
    
    $scope.redirectTo = function(elem) {
        $scope.currentSection = mainService.sections[elem.id.split("/")[4]];
        $scope.currentElement = elem;
        $window.location.href = elem.id;
    }

    $scope.setShow = function(bShowToSet){
        var actualVal = $scope.showList[bShowToSet];
        $scope.showList.bShow1 = $scope.showList.bShow2 = $scope.showList.bShow3 = $scope.showList.bShow4 = $scope.showList.bShow5 = $scope.showList.bShow6 = false;
        if(actualVal==false) $scope.showList[bShowToSet] = true;
    }

    $scope.init();
});

app.controller('elementCtrl', function($scope, $routeParams, $location, mainService, elementsService) {
    $scope.elements;
    $scope.currentElement;
    $scope.currentSection;
    
    $scope.init = function() {
        $scope.elements = elementsService.getElements();
        $scope.currentElement = elementsService.getCurrentElement();
        $scope.currentSection = elementsService.getCurrentSection();
    }

    $scope.init();
});

app.controller('elementListCtrl', function($scope, $location, mainService, elementsService) {
    $scope.elements;
    $scope.currentList;
    $scope.currentSection;

    $scope.init = function() {
        $scope.elements = elementsService.getElements();
        $scope.currentList = elementsService.getCurrentElementList();
        $scope.currentSection = elementsService.getCurrentSection();
    }

    $scope.init();
});

app.controller('rscCtrl', function($scope, $location, mainService, elementsService) {
    $scope.showList;
    $scope.resourceList;

    $scope.init = function() {
        $scope.resourceList = [
            {name: "Details of the AAS", path: "rsc/pdf/2018-details-of-the-asset-administration-shell.pdf", alt: "Details of the administration shell pdf", bShow: true},
            {name: "Vacuum Gripper Robot datasheet", path: "rsc/datasheets/536630-Vacuum_Gripper_Robot_24V.pdf", alt: "Vacuum gripper robot datasheet pdf", bShow: false},
            {name: "Automated High Bay Warehouse datasheet", path: "rsc/datasheets/536631-Automated_High-Bay_Warehouse_24V.pdf", alt: "Automated high bay warehouse datasheet pdf", bShow: false},
            {name: "Multi Processing Station datasheet", path: "rsc/datasheets/536632-Multi_Processing_Station_24V.pdf", alt: "Multi processing station datasheet pdf", bShow: false},
            {name: "Sortier Line datasheet", path: "rsc/datasheets/536633-Sortier_Line_24V.pdf", alt: "Sortier line datasheet pdf", bShow: false},
            {name: "PLC 1214C DC/DC/DC datasheet", path: "rsc/datasheets/6ES72141AG400XB0_datasheet_en.pdf", alt: "PLC 1214C DC/DC/DC datasheet pdf", bShow: false},
        ];
    }
    
    $scope.setShow = function(index){
        for(var i=0; i<$scope.resourceList.length; i++) {
            $scope.resourceList[i].bShow = (i==index);
        }
    }

    $scope.init();
});

app.controller('configCtrl', function($scope, $location, mainService, elementsService) {
    $scope.steps;
    $scope.STEP_ENUM;
    $scope.ISLAND_ENUM;
    $scope.stepsLength;
    $scope.selectedIsland;

    $scope.init = function() {
        $scope.steps = 0;
        $scope.STEP_ENUM = {INIT: 0, STEP1: 1, STEP2: 2, STEP3: 3};
        $scope.ISLAND_ENUM = {MPS: "multiProcessingStation", SL: "sortingLine", VG: "vacuumGripper", AHBW: "automatedHighBayWarehouse"};
        $scope.stepsLength = Object.values($scope.STEP_ENUM).length;
        $scope.selectedIsland = {multiProcessingStation: true, sortingLine: true, vacuumGripper: true, automatedHighBayWarehouse: true};

    }

    $scope.nextStep = function() {
        if($scope.steps+1 < $scope.stepsLength) 
            $scope.steps++;
    }

    $scope.previousStep = function() {
        if($scope.steps > 1) 
            $scope.steps--;
    }

    $scope.selectIsland = function(selectedIsland) {
        $scope.selectedIsland[selectedIsland] = !$scope.selectedIsland[selectedIsland];
    }
    
    $scope.init();

    // Mapster initialization
    var basic_opts = { mapKey: 'island' };
    var initial_opts = $.extend({},basic_opts, { fill: true, fillOpacity: 0.6 });
    $('#factoryImageMap').mapster(initial_opts).mapster('snapshot').mapster('rebind',basic_opts);
});

app.controller('configListCtrl', function($scope, mainService) {

    $scope.init = function() {

    }

    $scope.delete = function() {

    }
   
    $scope.upload = function() {

    }

    $scope.visualize = function() {

    }



    $scope.init();
});

app.service("mainService", function() {
    this.baseUrl = "http://localhost:8080/#coreaas/";
    this.sections = {index: "Home", configurations: "Configuration", resources: "Resource", descriptions: "Concept Description", submodels: "Submodel", assets: "Asset", aas: "Asset Administration Shell", dataspecs: "Data Specification"};
});

app.service("elementsService", function($location, mainService) {
   
    /* === VARIABLES === */
    this.elements = {descriptions: [], submodels: [], assets: [], aas: [], dataspecs: []};

    /* === FUNCTIONS === */
    this.addConceptDescription = function(browseName, preferredName, description, unit, id) {
        this.elements.descriptions.push({browseName: browseName, preferredName: preferredName, description: description, unit: unit, id: id});
    };

    this.addSubmodel = function(browseName, revision, version, description, id) {
        this.elements.submodels.push({browseName: browseName, revision: revision, version: version, description: description, id: id});
    };

    this.addAsset = function(browseName, revision, version, description, serialNumber, manufacturer, datasheet, id) {
        this.elements.assets.push({browseName: browseName, revision: revision, version: version, description: description, id: id});
    };

    this.addAAS = function(browseName, revision, version, description, id, assetRef, submodelsRef) {
        this.elements.aas.push({browseName: browseName, revision: revision, version: version, description: description, id: id, assetRef: assetRef, submodelsRef: submodelsRef});
    };

    this.addDataSpecs = function(browseName, revision, version, description, id, additionalProperties) {
        this.elements.dataspecs.push({browseName: browseName, revision: revision, version: version, description: description, id: id, additionalProperties: additionalProperties});
    };

    this.getCurrentSection = function() {
        return $location.absUrl().split("/")[4]
    }

    this.getCurrentElementList = function(){
        return this.elements[this.getCurrentSection()];
    };

    this.getCurrentElement = function(){
        var elementList = this.getCurrentElementList();
        for(var i=0; i<elementList.length; i++) {
            if(elementList[i].id === $location.absUrl())
                return elementList[i];
        }

        console.error("Nessun elemento con id " + $location.absUrl() + " trovato dentro la sua lista");
    };


    this.init = function() {
        this.elements = {descriptions: [], submodels: [], assets: [], aas: [], dataspecs: []};
        this.addConceptDescription("Submodel - Identification", "Identification", "Submodel contenente informazioni sull'identificazione dell'asset", "", mainService.baseUrl + "descriptions/001");
        this.addConceptDescription("Property - Asset serial number", "Asset serial number", "Numero seriale dell'asset", "", mainService.baseUrl + "descriptions/002");
        this.addConceptDescription("Submodel - Configuration", "Configuration", "Submodel contenente informazioni sulla configurazione dell'asset", "", mainService.baseUrl + "descriptions/003");
        this.addConceptDescription("File - Datasheet", "Datasheet", "File contenente il datasheet dell'asset", "", mainService.baseUrl + "descriptions/004");
        this.addConceptDescription("Property - Asset Manufacturer", "Asset Manufacturer", "Produttore dell'asset", "", mainService.baseUrl + "descriptions/005");
        this.addConceptDescription("Submodel - Vacuum Gripper", "Vacuum Gripper", "Elemento responsabile dello spostamento dei blocchi di produzione", "", mainService.baseUrl + "descriptions/006");
        this.addConceptDescription("Operation - Pick Up", "Pick Up", "Operazione di sollevamento del blocco di produzione per effettuarne lo spostamento", "", mainService.baseUrl + "descriptions/007");
        this.addConceptDescription("Submodel - Oven", "Oven", "Forno per il processamento dei blocchi di produzione", "", mainService.baseUrl + "descriptions/008");
        this.addConceptDescription("Property - Terminal", "Terminal", "Terminale di input o output", "V", mainService.baseUrl + "descriptions/009");
        this.addConceptDescription("Operation - Burn", "Burn", "Operazione di accensione del forno", "", mainService.baseUrl + "descriptions/010");
        this.addConceptDescription("Submodel - Turntable", "Turntable", "Elemento preposto alla rotazione dei blocchi di produzione", "", mainService.baseUrl + "descriptions/011");
        this.addConceptDescription("Operation - Activate Saw", "Activate Saw", "Operazione di attivazione della sega circolare per la lavorazione del blocco di produzione", "", mainService.baseUrl + "descriptions/013");
        this.addConceptDescription("Operation - Ejection", "Ejection", "Operazione di emissione del blocco di produzione dalla turntable al nastro trasportatore", "", mainService.baseUrl + "descriptions/014");
        this.addConceptDescription("Operation - Activate Belt", "Activate Belt", "Operazione di abilitazione del nastro trasportatore per lo spostamento dei blocchi di produzione", "", mainService.baseUrl + "descriptions/015");
        this.addConceptDescription("Property - Motor Terminal", "Motor Terminal", "Terminale relativo ad un motorino elettrico", "V", mainService.baseUrl + "descriptions/017");
        this.addConceptDescription("Operation - Set Down", "Set Down", "Operazione di rilascio del blocco di produzione per effettuarne lo spostamento", "", mainService.baseUrl + "descriptions/018");
        this.addConceptDescription("Submodel - Sorting Line", "Sorting Line", "Elemento responsabile del riconoscimento del colore dei blocchi di produzione e del loro smistamento nei rispettivi magazzini", "", mainService.baseUrl + "descriptions/022");
        this.addConceptDescription("Operation - Color Detection", "Color Detection", "Operazione di riconoscimento del colore del blocco di produzione", "", mainService.baseUrl + "descriptions/023");
        this.addConceptDescription("Operation - Ejection", "Ejection", "Operazione di espulsione di un blocco di produzione verso un magazzino", "", mainService.baseUrl + "descriptions/024");
        this.addConceptDescription("Property - Valve Terminal", "Valve Terminal", "Terminale relativo ad una valvola", "V", mainService.baseUrl + "descriptions/025");
        this.addConceptDescription("Submodel - AHBWarehouse", "AHB Warehouse", "Submodel per la gestione dei pezzi nel magazzino", "", mainService.baseUrl + "descriptions/026");
        this.addConceptDescription("Property - Compressor Terminal", "Compressor Terminal", "Terminale relativo ad un compressore", "V", mainService.baseUrl + "descriptions/027");
        this.addConceptDescription("Operation - Retrieving", "Retrieving", "Operazione di recupero di un blocco di produzione dal magazzino", "", mainService.baseUrl + "descriptions/028");
        this.addConceptDescription("Operation - Move", "Move", "Operazione di spostamento del braccio del vacuum gripper. Prende in input le coordinate di destinazione (x,y,z)", "", mainService.baseUrl + "descriptions/029");
        this.addConceptDescription("Operation - Move", "Move", "Operazione di spostamento del braccio del vacuum gripper dalla posizione iniziale a quella finale", "", mainService.baseUrl + "descriptions/030");
        this.addConceptDescription("Operation - Turn", "Turn", "Operazione di rotazione della turntable per portare il blocco in prossimità della sega", "", mainService.baseUrl + "descriptions/031");
        this.addConceptDescription("Property - Light Terminal", "Light Terminal", "Terminale relativo ad una luce", "V", mainService.baseUrl + "descriptions/032");
        this.addConceptDescription("Property - Switch Terminal", "Switch Terminal", "Terminale relativo ad uno switch", "V", mainService.baseUrl + "descriptions/040");
        this.addConceptDescription("Property - Light barrier Terminal", "Light barrier Terminal", "Terminale relativo ad un sensore luminoso", "V", mainService.baseUrl + "descriptions/041");
        this.addConceptDescription("File - Program File", "Program File", "Link ad un file contenente un programma IEC", "", mainService.baseUrl + "descriptions/052");
        this.addConceptDescription("Submodel - IO Module", "IO Module", "Submodel contenente informazioni sui moduli di IO aggiuntivi", "", mainService.baseUrl + "descriptions/053");
        this.addConceptDescription("Submodel - IO", "IO", "Submodel contenente informazioni sugli I/O dell'Asset", "", mainService.baseUrl + "descriptions/054");
        this.addConceptDescription("Elem. Collection - IEC Program", "Program", "Collection element contenente informazioni su un programma IEC", "", mainService.baseUrl + "descriptions/055");
        this.addConceptDescription("Submodel - IEC Configuration", "IEC Configuration", "Submodel contenente informazioni relative alla configurazione conforme allo standard IEC61131-3", "", mainService.baseUrl + "descriptions/056");
        this.addConceptDescription("Submodel - IEC Resource", "IEC Resource", "Submodel contenente informazioni relative alla risorsa conforme allo standard IEC61131-3", "", mainService.baseUrl + "descriptions/057");
        this.addConceptDescription("Property - IEC Resource Description", "Description", "Proprietà che descrive la risorsa IEC", "", mainService.baseUrl + "descriptions/058");
        this.addConceptDescription("Property - IEC Resource Address List", "Address List", "Proprietà che descrive gli indirizzi della risorsa", "", mainService.baseUrl + "descriptions/059");
        this.addConceptDescription("Submodel - IEC Program", "IEC Program", "Submodel contenente informazioni relative ai programmi conformi allo standard IEC61131-3", "", mainService.baseUrl + "descriptions/060");
        this.addConceptDescription("Rel. Element - AssociatedC onfiguration", "Associated Configuration", "Relazione di appartenenza di una risorsa ad una configurazione", "", mainService.baseUrl + "descriptions/061");
        this.addConceptDescription("Rel. Element - Associated Resource", "Associated Resource", "Relazione di appartenenza di un programma ad una risorsa", "", mainService.baseUrl + "descriptions/062");
        this.addConceptDescription("Rel. Element - Associated Task", "Associated Task", "Relazione di appartenenza di un task ad un programma. Il valore indica il codice dell'OB", "", mainService.baseUrl + "descriptions/063");
        this.addConceptDescription("Submodel - IEC Communication", "IEC Communication", "Submodel contenente informazioni relative alla modalità di comunicazione del PLC", "", mainService.baseUrl + "descriptions/065");
        this.addConceptDescription("Elem. Collection - Profinet IO", "Profinet IO", "Collection element contenente informazioni relative alla modalità di comunicazione Profinet IO del PLC", "", mainService.baseUrl + "descriptions/066");
        this.addConceptDescription("Property - Device Type", "Device Type", "Proprietà indicante il tipo di dispositivo: IO Controller o IO Device nel caso di ProfinetIO, Master o Slave nel caso di ProfibusDP", "", mainService.baseUrl + "descriptions/067");
        this.addConceptDescription("Property - Send Clock Time", "Send Clock Time", "valore reale indicante il l'intervallo di scambio dati tra controller e device. Da usare solo nel caso in cui il tipo sia IO Controller", "ms", mainService.baseUrl + "descriptions/068");
        this.addConceptDescription("Property - Response Control Time", "Response Control Time", " valore intero che indica quanti cicli di aggiornamento senza IO sono accettati. Da indicare solo nel caso in cui il tipo sia IO Device.", "", mainService.baseUrl + "descriptions/070");
        this.addConceptDescription("Property - Bandwidth", "Bandwidth", "reale indicante la massima larghezza di banda utilizzabile per lo scambio dati real time. Da indicare solo nel caso in cui il tipo sia IO Controller.", "ms", mainService.baseUrl + "descriptions/071");
        this.addConceptDescription("Property - IP Address", "IP Address", "indirizzo IP del dispositivo Profinet IO", "", mainService.baseUrl + "descriptions/072");
        this.addConceptDescription("Elem. Collection - Profibus DP", "Profibus DP", "Submodel contenente informazioni relative alla modalità di comunicazione Profibus DP del PLC ", "", mainService.baseUrl + "descriptions/073");
        this.addConceptDescription("Property - Bit Rate", "Bit Rate", "bit rate della comunicazione Profibus DP", "Kbps", mainService.baseUrl + "descriptions/074");
        this.addConceptDescription("Property - Profibus Address", "Profibus Address", "indirizzo profibus DP del device", "", mainService.baseUrl + "descriptions/075");
        this.addConceptDescription("Property - Highest Station Address", "HSA", "intero che indica il valore dell'indirizzo più alto ammissibile per una stazione attiva", "", mainService.baseUrl + "descriptions/076");
        this.addConceptDescription("IEC Task", "IEC Task", "Submodel contenente informazioni relative ai task conforme allo standard IEC61131-3", "", mainService.baseUrl + "descriptions/077");
        this.addConceptDescription("Cyclic Interrupt", "Cyclic Interrupt", "Collection element contenente informazioni relative ai task ciclici", "", mainService.baseUrl + "descriptions/078");
        this.addConceptDescription("Property - OB Number", "OB number", "Intero indicante il numero dell'Organization Block (OB)", "", mainService.baseUrl + "descriptions/079");
        this.addConceptDescription("Property - Priority", "Priority", "Intero indicante la priorità dell'Organization Block (OB)", "", mainService.baseUrl + "descriptions/080");
        this.addConceptDescription("Property - Period", "Period", "Periodo dell'OB schedulazione d'orologio", "", mainService.baseUrl + "descriptions/081");
        this.addConceptDescription("Elem. Collection - Hardware Interrupt", "Hardware Interrupt", "Collection element contenente informazioni relative ai task di interrupt hardware", "", mainService.baseUrl + "descriptions/082");
        this.addConceptDescription("Property - Trigger Input Channel", "Trigger Input Channel", "Canale di input d'innesco", "", mainService.baseUrl + "descriptions/083");
        this.addConceptDescription("Submodel - Terminals Mapping", "Terminals Mapping", "Submodel contenente informazioni relative al mapping dei terminali", "", mainService.baseUrl + "descriptions/084");
        this.addConceptDescription("Rel. Element - Paired Terminals", "Paired Terminals", "Relazione di accoppiamento tra due terminali appartenenti ad AAS differenti", "", mainService.baseUrl + "descriptions/085");

        this.addAAS("Multi Processing Station AAS", "1", "1", "Multi Processing Station AAS", mainService.baseUrl + "aas/mps-1.0", mainService.baseUrl + "assets/536632", [mainService.baseUrl + "submodels/identification1", mainService.baseUrl + "submodels/configuration1", mainService.baseUrl + "submodels/gripper1", mainService.baseUrl + "submodels/oven1", mainService.baseUrl + "submodels/turntable1"]);
        this.addAAS("Vacuum Gripper AAS", "1", "1", "Vacuum Gripper AAS", mainService.baseUrl + "aas/vg-1.0", mainService.baseUrl + "assets/536630", [mainService.baseUrl + "submodels/identification2", mainService.baseUrl + "submodels/configuration2", mainService.baseUrl + "submodels/gripper2"]);
        this.addAAS("Sorting Line AAS", "1", "1",  "Sorting Line AAS", mainService.baseUrl + "aas/sl-1.0", mainService.baseUrl + "assets/536633", [mainService.baseUrl + "submodels/identification3", mainService.baseUrl + "submodels/configuration3", mainService.baseUrl + "submodels/sortingLine3"]);
        this.addAAS("Automated High Bay Warehouse AAS", "1", "1",  "Automated High Bay Warehouse AAS", mainService.baseUrl + "aas/ahbw-1.0", mainService.baseUrl + "assets/536631", [mainService.baseUrl + "submodels/identification4", mainService.baseUrl + "submodels/configuration4", mainService.baseUrl + "submodels/ahbWarehouse4"]);
        this.addAAS("PLC AAS", "1", "1", "PLC AAS", mainService.baseUrl + "aas/plc-1.0", mainService.baseUrl + "assets/PLC_1214C", [mainService.baseUrl + "submodels/identification5", mainService.baseUrl + "submodels/configuration5", mainService.baseUrl + "submodels/IO5", mainService.baseUrl + "submodels/IECConfiguration5", mainService.baseUrl + "submodels/IECResource5", mainService.baseUrl + "submodels/IECProgram5", mainService.baseUrl + "submodels/IECTask5", mainService.baseUrl + "submodels/IECCommunication5"]);

        this.addAsset("Multi Processing Station 536632", "1", "1", "Asset Multi Processing Station 536632", "TODO", "Fischertechnik", mainService.baseUrl + "datasheets/536632-Multi_Processing_Station_24V.pdf", mainService.baseUrl + "assets/536632");
        this.addAsset("Vacuum Gripper 536630", "1", "1", "Asset Vacuum Gripper 536630", "TODO", "Fischertechnik", mainService.baseUrl + "datasheets/536630-Vacuum_Gripper_Robot_24V.pdf", mainService.baseUrl + "assets/536630");
        this.addAsset("Sorting Line 536633", "1", "1", "Asset Sorting Line 536633", "TODO", "Fischertechnik", mainService.baseUrl + "datasheets/536633-Sortier_Line_24V.pdf", mainService.baseUrl + "assets/536633");
        this.addAsset("Automated High Bay Warehouse Line 536631", "1", "1", "Asset Automated High Bay Warehouse 536631", "TODO", "Fischertechnik", mainService.baseUrl + "datasheets/536631-Automated_High-Bay_Warehouse_24V.pdf", mainService.baseUrl + "assets/536631");
        this.addAsset("PLC 1214C DC/DC/DC", "1", "1", "PLC 1214C DC/DC/DC 6ES7214-1AG40-0XB0", "TODO", "Siemens", mainService.baseUrl + "datasheets/6ES72141AG400XB0_datasheet_en.pdf", mainService.baseUrl + "assets/PLC_1214C");

        this.addSubmodel("Identification Type", "1", "1", "Identification", mainService.baseUrl + "submodels/identificationType");
        this.addSubmodel("Configuration Type", "1", "1", "Configuration", mainService.baseUrl + "submodels/configurationType");
        this.addSubmodel("Vacuum Gripper Oven Type", "1", "1", "Vacuum Gripper Oven", mainService.baseUrl + "submodels/gripperType");
        this.addSubmodel("Vacuum Gripper Robot Type", "1", "1", "Vacuum Gripper Robot", mainService.baseUrl + "submodels/gripperRobotType");
        this.addSubmodel("Oven Type", "1", "1", "Oven", mainService.baseUrl + "submodels/ovenType");
        this.addSubmodel("Turntable Type", "1", "1", "Turntable", mainService.baseUrl + "submodels/turntableType");
        this.addSubmodel("Sorting Line Type", "1", "1", "Sorting Line", mainService.baseUrl + "submodels/sortingLineType");
        this.addSubmodel("AHB Warehouse Type", "1", "1", "AHB Warehouse", mainService.baseUrl + "submodels/ahbWarehouseType");
        this.addSubmodel("IO Type", "1", "1", "IO", mainService.baseUrl + "submodels/IOType");
        this.addSubmodel("IO Module Type", "1", "1", "IO Module", mainService.baseUrl + "submodels/IOModuleType");
        this.addSubmodel("IEC Configuration Type", "1", "1", "IEC Configuration", mainService.baseUrl + "submodels/IECConfigurationType");
        this.addSubmodel("IEC Resource Type", "1", "1", "IEC Resource", mainService.baseUrl + "submodels/IECResourceType");
        this.addSubmodel("IEC Program Type", "1", "1", "IEC Program", mainService.baseUrl + "submodels/IECProgramType");
        this.addSubmodel("IEC Task Type", "1", "1", "IEC Task", mainService.baseUrl + "submodels/IECTaskType");
        this.addSubmodel("IEC Communication Type", "1", "1", "IEC Communication", mainService.baseUrl + "submodels/IECCommunicationType");
        this.addSubmodel("Terminals Mapping Type", "1", "1", "Terminals Mapping", mainService.baseUrl + "submodels/TerminalsMappingType");
        
        this.addDataSpecs("Terminal Template", "1", "1", "Template for Terminal Property", mainService.baseUrl + "dataspecs/terminalDataTemplate", [{name: "TerminalType", dataType: "String"}, {name: "TerminalNumber", dataType: "Int16"}] );
    }

    this.getElements = function() {
        return this.elements;
    }
});

// TODO: AGGIUNGERE DB IN CUI SALVARE LE CONFIGURAZIONI
app.service("configurationService", function($location, mainService) {
   
    /* === VARIABLES === */
    this.configurationList = [];

    /* === FUNCTIONS === */
    /*
    this.getCurrentConfiguration = function(){
        var elementList = this.getCurrentElementList();
        for(var i=0; i<elementList.length; i++) {
            if(elementList[i].id === $location.absUrl())
                return elementList[i];
        }

        console.error("Nessun elemento con id " + $location.absUrl() + " trovato dentro la sua lista");
    };  
    */

    this.init = function() {
        this.configurationList = [
            {name: "Configurazione 1", islands: {mps: true, sl: true, vg: true, ahbw: true}, description: "Configurazione di test numero 1", id: mainService.baseUrl + "configurations/001"},
            {name: "Configurazione 2", islands: {mps: true, sl: true, vg: true, ahbw: false}, description: "Configurazione di test numero 2", id: mainService.baseUrl + "configurations/002"},
            {name: "Configurazione 3", islands: {mps: true, sl: false, vg: true, ahbw: false}, description: "Configurazione di test numero 3", id: mainService.baseUrl + "configurations/003"},
            {name: "Configurazione 4", islands: {mps: true, sl: false, vg: false, ahbw: false}, description: "Configurazione di test numero 4", id: mainService.baseUrl + "configurations/004"},
            {name: "Configurazione 5", islands: {mps: true, sl: true, vg: true, ahbw: true}, description: "Configurazione di test numero 5", id: mainService.baseUrl + "configurations/005"},
            {name: "Configurazione 6", islands: {mps: true, sl: false, vg: true, ahbw: true}, description: "Configurazione di test numero 6", id: mainService.baseUrl + "configurations/006"},
            {name: "Configurazione 7", islands: {mps: true, sl: true, vg: true, ahbw: false}, description: "Configurazione di test numero 7", id: mainService.baseUrl + "configurations/007"}
        ]
        
    }

    this.getConfigurations = function() {
        return this.configurationList;
    }
});