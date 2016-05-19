// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'mercadopago.services','mercadopago.controllers','ngResource', 'ngSanitize'])

.run(function($ionicPlatform,$rootScope, MercadoPagoService, $ionicLoading) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '.custom-icon {/*font-size: 64px;*/color : rgb(29,159,222);}.barra{color:red!default;background-color:rgb(29,159,222)!important;border-style: none!important;}.carrito{color:white;font-size: 26px;font-weight: bold;}.texto{font-size: 12pt;text-align: center;color:rgb(153,153,153);}.link{color:rgb(0,102,204);}.flecha{color:rgb(153,153,153);}.amarillo{color:rgb(178,144,84);}.pesos{font-size: 30pt;font-weight: bold;text-align: center;content: url("http://static1.squarespace.com/static/552c1470e4b0656e7f15eb88/5616784ae4b0300f35ec946f/56167c83e4b007142a3e46bf/1444314243622/dollar.png?format=500w");}.header{font-size:13pt !important;font-weight: 200 !important;color:white!important;word-wrap:break-word!important}.opciones{font-size:12pt!important;color:rgb(102,102,102)!important;}.footer{font-size:11pt;color:rgb(153,153,153)!important;text-align: center;}.copy{font-size:9pt;color:rgb(153,153,153)!important;text-align: center;}.pagar{font-size: 15pt!important;text-align: center!important;font-weight: 200!important;}.textoinstru{font-size: 16pt!important;font-weight: 200!important;color:rgb(102,102,102)!important;}';
    document.getElementsByTagName('head')[0].appendChild(style);

    $rootScope.$ionicGoBack=function(){
      if ($rootScope.elegida==undefined && $state.current.name=='MercadoPago-Grupos')
        $ionicHistory.goBack(-2);
      else
        $ionicHistory.goBack(-1);
    }

    $rootScope.mostrar=false;
    $rootScope.no=true;
    $rootScope.mos = function() {
          if ($rootScope.mostrar==true)
            $rootScope.mostrar=false;
          else
            $rootScope.mostrar=true;
      };
    $ionicLoading.show({
          template: 'Cargando...'
      })
    MercadoPagoService.grupos().get(function(data){
      $rootScope.datos=data;
    });
    MercadoPagoService.getPrefId().get(function(data){
      $rootScope.prefid=data;
      $ionicLoading.hide();
    });
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
  $ionicConfigProvider.navBar.alignTitle('center');

  var card_form = {
    name: 'MercadoPago-FormTarjeta',
    url: '/:product_id/:payment_method_id/:issuer_id/:installments/:token',
    templateUrl: 'card_form.html',
    controller: 'CardFormCtrl'};

  var grupos = {
    name: 'MercadoPago-Grupos',
    url: '/',
    cache:false,
    params: {
      flavour: {}
    },
    templateUrl: 'mercadopago.html',
    controller: 'Inicio'};

  var grupos2 = {
    name: 'MercadoPago-Grupos2',
    url: '/',
    params: {
      opcion: { array: true },
      datosapi: { array: true },
      prefid: { array: true },
      ruta: { array: true },
      flavour: {}
    },
    templateUrl: 'mercadopago.html',
    controller: 'Inicio2'};

  var ryc = {
    name: 'MercadoPago-Ryc',
    url: '/',
    cache:false,
    params: {
      opcion: { array: true },
      datosapi: { array: true },
      prefid: { array: true },
      ruta: { array: true },
      flavour: {}
    },
    templateUrl: 'mercadopago.html',
    controller: 'Ryc'};

  var instru = {
    name: 'MercadoPago-Ins',
    url: '/',
    params: {
      opcion: { array: true },
      datosapi: { array: true },
      prefid: { array: true },
      ruta: { array: true },
      flavour: {},
      pago: { array: true }

    },
    templateUrl: 'mercadopago.html',
    controller: 'instru'};

  $stateProvider
    .state(card_form)
    .state(grupos)
    .state(grupos2)
    .state(ryc)
    .state(instru)

})
angular.module('mercadopago.services', [])

.factory('MercadoPagoService', function ($resource, $http,$state,$ionicHistory,$rootScope) {
  var public_key;
  var base_url = "https://api.mercadopago.com";
  var access_token='';
  var call;
  var volver;
  var prefid='';
  var flavour;

  var startIns=function(callback, view, datos,prefid){
        call=callback;
        volver=view;
        $state.go('MercadoPago-Ins', {
         "flavour":3,
         "pago": datos,
         "prefid": prefid});
  }
  //var token={"card_number": "4024007134824373","security_code": "123","expiration_month": 4,"expiration_year": 2020,"cardholder": {"name": "auto","identification": {"subtype": null,"type": "DNI","number": "12345678",}}};
    return {
      getPaymentMethods:function(){
        return $resource(base_url+'/v1/payment_methods'+public_key);
      },
      getIssuers:function(pmid){
        return $resource(base_url+'/v1/payment_methods/card_issuers'+public_key+"&payment_method_id=:payment_method_id",{ payment_method_id: pmid});
      },
      getInstallments:function(pmid,issuid,amm){
        return $resource(base_url+'/v1/payment_methods/installments'+public_key+"&payment_method_id=:payment_method_id&issuer.id=:issuer&amount=:ammount",{ payment_method_id: pmid,ammount:amm,issuer:issuid});
      },
      getIdentificationTypes:function(){
        return $resource(base_url+'/v1/identification_types'+public_key);
      },
      getPromos:function(){
        return $resource(base_url+'/v1/payment_methods/deals'+public_key);
      },
      createTonken:function(data){
        return $resource(base_url+'/v1/card_tokens'+public_key,data);
      },
      createPayment:function(data){
        return $resource("https://www.mercadopago.com/checkout/examples/doPayment",data);
      },
      grupos:function(){
        return $resource("https://api.mercadopago.com/beta/checkout/payment_methods/search/options"+public_key);
      },
      getPrefId:function(){
        return $resource("https://api.mercadolibre.com/checkout/preferences/"+prefid+"?access_token="+access_token);
      },
      setPrefId:function(dato){
        prefid=dato;
      },
      setAccessToken:function(dato){
        access_token=dato;
      },
      setPublicKey:function(dato){
        public_key=dato;
      },
      calcularTotal:function(prefid){
        var precio=0;
        for(i=0;i<prefid.items.length;i++){
          precio+=prefid.items[i].unit_price;
        }
        return precio;
      },
      startCheckout:function(callback, view){
        call=callback;
        volver=view;
        $rootScope.elegida=undefined;
        $state.go('MercadoPago-Ryc', {
         "flavour":3});
      },
      startF2:function(callback){
        call=callback;
        $rootScope.elegida=2;
        $state.go('MercadoPago-Grupos', {
         "flavour":2
      });
      },
      startGrupos:function(callback, view){
        call=callback;
        volver=view;
        $state.go('MercadoPago-Grupos', {
         "flavour":1
      });
      },
      startRyc:function(callback, view, datos, prefid, pm){
        call=callback;
        volver=view;
        $state.go('MercadoPago-Ryc', {
         "flavour":1,
          "opcion": pm,
         "datosapi":datos,
         "prefid":prefid,
      });
      },
      startIns:startIns,
      volver:function(flavour, datos,prefid, seguir){
        $rootScope.elegida=undefined;

      if(flavour==3 && seguir==true){
        datos="Pago";
        startIns(call,volver,datos,prefid);
      }
      else{
        $ionicHistory.goBack(-1*($ionicHistory.currentView().index));

      if (call!=null)
        call(datos);
      }
    }
  }
})

angular.module('mercadopago.controllers', [])

.controller('CardFormCtrl', function($scope, MercadoPagoService,$state, $stateParams){
  MercadoPagoService.getIdentificationTypes().query(function(data) {
    $scope.identification_types = data;
  });
  $scope.card_token={};
  $scope.createToken = function() {

  };
})

.controller('Inicio', function($scope, MercadoPagoService,$state, $stateParams, $templateCache, $rootScope,$ionicHistory, $ionicLoading){

//   function include(filename){
//     var head = document.getElementsByTagName('head')[0];
//
//     var script = document.createElement('script');
//     script.src = filename;
//     script.type = 'text/javascript';
//
//     head.appendChild(script)
// }
// include("js/ej.js");
  $scope.codigo="<ion-nav-view title='{{header}}'> <ion-content style='background-color:rgb(244,244,244)'><div  ng-show='mostrar==true'class=' item-thumbnail-left header'style='height: 80pt; background-color:rgb(90,190,231); word-wrap:break-word!important;line-height: 20pt'>{{titulo}}<img ng-src='{{imagen}}'><br>{{total | currency}}</div><div class='list list-inset' style=' margin:20px 0px 0px 0px'><div  id= 'l'class='item item-icon-left item-icon-right opciones' ng-repeat='grupo in grupos' ng-click='selectedGrupo(grupo)'><i class=' icon {{grupo.icon}} custom-icon'></i>{{grupo.description}}<i class='icon ion-ios-arrow-right flecha'></i></div></div><br><footer></footer></ion-content></ion-nav-view>";

  $rootScope.no=true; //mostrar la flecha de atras
  var prefid=$rootScope.prefid;
  var datos=$rootScope.datos;

  datos.groups[0].icon="ion-card "; //Agrego iconos
  datos.groups[1].icon="ion-cash ";
  datos.groups[2].icon="ion-ios-locked ";

  $scope.grupos=datos.groups;
  $scope.header="¿Comó quieres pagar?";

  $scope.titulo=prefid.items[0].title; // seteo el prefid
  $scope.imagen=prefid.items[0].picture_url;
  $scope.total=MercadoPagoService.calcularTotal(prefid);

  $scope.Salir=function(){
    MercadoPagoService.volver($stateParams.flavour,"cancelo"); //cancelar y salir
  }
  $scope.selectedGrupo = function(pm) {

    if(pm.children==null){
      if($stateParams.flavour==1)
        MercadoPagoService.volver($stateParams.flavour, pm.id);

      else if (pm.id=="credit_card"){
        $state.go('MercadoPago-FormTarjeta', {
          "payment_method_id": pm.id
        });
      }
    }
    else{
      $state.go('MercadoPago-Grupos2', {
        "opcion": pm,
        "flavour":$stateParams.flavour,});
    }
  };
})
.controller('Inicio2', function($scope, MercadoPagoService,$state, $stateParams, $templateCache,$ionicHistory, $rootScope){
  //console.log("grupo",$ionicHistory.currentView());

  var prefid=$rootScope.prefid;
  var datos=$rootScope.datos;

  $scope.grupos=$stateParams.opcion[0].children;
  $scope.header=$stateParams.opcion[0].children_header;
  $scope.titulo=prefid.items[0].title;
  $scope.imagen=prefid.items[0].picture_url;
  $scope.codigo="<ion-nav-view title='{{header}}'><ion-content style='background-color:rgb(244,244,244)'><div ng-show='mostrar==true'class=' item-thumbnail-left header'style='height: 80pt; background-color:rgb(90,190,231); word-wrap:break-word!important;line-height: 20pt'>{{titulo}}<img ng-src='{{imagen}}'><br>{{total| currency}}</div><div class='list list-inset' style=' margin:20px 0px 0px 0px'><div  id= 'l'class='item item-icon-right' ng-repeat='grupo in grupos' ng-click='elegir(grupo)' style='padding: 10px'><div style='padding: 0px 0px 0px 0px; margin:0px 0px -15px 0px' class='opciones' ><img id= 'im' ng-src='{{getImagen(grupo)}}' style='padding: 0px 10px 0px 0px'>{{grupo.description}}</div><br><div class='footer' style='text-align: left'>{{grupo.comment}} </div><i class='icon ion-ios-arrow-right flecha'></i></div></div><footer></footer></ion-content></ion-nav-view>";

  $scope.total=MercadoPagoService.calcularTotal(prefid);

  $scope.getImagen=function(pm){ //buscar imagenes
  if (pm.show_icon==true){
    if(pm.id=="redlink_bank_transfer"||pm.id=="redlink_atm") pm.id="redlink";
      for(a=0;a<datos.payment_methods.length;a++){
        if(datos.payment_methods[a].id==pm.id){
          pm.thumbnail=datos.payment_methods[a].thumbnail;
          return datos.payment_methods[a].thumbnail;
        }
      }
    }
  }
  $scope.Salir=function(){
    MercadoPagoService.volver($stateParams.flavour,"cancelo");
  }

  $scope.elegir=function(pm){
    if ($stateParams.flavour==1)
      MercadoPagoService.volver($stateParams.flavour);
    else if ($stateParams.flavour==2){
      var datos=[];
      datos.push(pm.id);
      datos.push($scope.total);
      datos.push(prefid.items[0].title);
      MercadoPagoService.volver($stateParams.flavour,datos,prefid,true);
    }
    else {
      $rootScope.elegida=pm;
      $ionicHistory.goBack(-2);
    }
  }
})
.controller('Ryc', function($scope, MercadoPagoService,$state, $stateParams, $templateCache,$ionicHistory,$ionicNavBarDelegate, $rootScope){

  // console.log("ryc",$ionicHistory.currentView());
  $rootScope.no=false;

  var datos=$rootScope.datos;
  var prefid=$rootScope.prefid;
  $scope.grupos=$rootScope.elegida;

  if($rootScope.elegida==undefined){ //va directo a grupos
    $state.go('MercadoPago-Grupos', {
          "prefid":prefid,
          "flavour":$stateParams.flavour});
  }

  $scope.titulo=prefid.items[0].title;
  $scope.imagen=prefid.items[0].picture_url;
  $scope.total=MercadoPagoService.calcularTotal(prefid);

  $scope.header="Revisa si está todo bien…";
  $scope.codigo="<ion-nav-view title='{{header}}'><ion-content style='background-color:rgb(244,244,244)'><div class=' item-thumbnail-left header'style='height: 80pt; background-color:rgb(90,190,231); word-wrap:break-word!important;line-height: 20pt'>{{titulo}}<img ng-src='{{imagen}}'><br>{{total | currency}}</div><div class='list list-inset' style=' margin:20px 0px 0px 0px;border-bottom: none'><div  id= 'l'class='item item-icon-right' ng-click='goBack()' style='padding: 10px;border: none'><div style='padding: 0px 0px 0px 0px; margin:0px 0px -15px 0px' class='opciones'><img id= 'im' ng-src='{{getImagen(grupos)}}' style='padding: 0px 10px 0px 0px'>{{grupos.description}}</div><br><div class='footer' style='text-align: left'>{{grupos.comment}} </div><i class='icon ion-ios-arrow-right flecha'></i></div></div><div class='opciones'style='height: 40pt;background-color:rgb(244,244,244);vertical-align: middle; font-size: 16pt;line-height: 40pt; border-bottom: 2pt;border-bottom-color: rgb( 222,222,222);  border-style:solid; text-align: center;font-weight: 200;word-spacing-spacing: 1.5px'>Total a pagar: {{total| currency}}</div><br><div class='copy' style='padding: 0px 20px'><p>    Al pagar, afirmo que soy mayor de edad y acepto los <a class='link'>Términos y Condiciones</a> de MercadoPago.</p></div><div style='padding: 0px 10px 0px 10px'><button class='button button-block button-positive pagar' style='background-color:rgb(0,159,222)' ng-click='pagar()'>Pagar</button></div><footer></footer></ion-content></ion-nav-view>";

  $scope.getImagen=function(pm){
    if(pm!=undefined){
    if (pm.show_icon==true){
      if(pm.id=="redlink_bank_transfer"||pm.id=="redlink_atm") pm.id="redlink";
        for(a=0;a<datos.payment_methods.length;a++){
          if(datos.payment_methods[a].id==pm.id)
            return datos.payment_methods[a].thumbnail;
        }
    }
    }
  }
  $scope.Salir=function(){
    MercadoPagoService.volver($stateParams.flavour,"cancelo");
  }
  $scope.goBack = function() {

    if($stateParams.flavour==1)
      MercadoPagoService.volver($stateParams.flavour,"false",null,null);
    else{
      $rootScope.no=true; //mostrar atras
      $state.go('MercadoPago-Grupos', {
          "prefid":prefid,
          "flavour":$stateParams.flavour});
    }
  }

  $scope.pagar=function(){
    $rootScope.no=true;

    if($stateParams.flavour==1)
      MercadoPagoService.volver($stateParams.flavour,"true",null,null);

    else{
      var datos=[];
      datos.push($scope.grupos.id);
      datos.push($scope.total);
      datos.push(prefid.items[0].title);

      MercadoPagoService.volver($stateParams.flavour,datos,prefid,true);
    }
  }
})
.controller('instru', function($scope, MercadoPagoService,$state, $stateParams, $templateCache,$ionicHistory, $rootScope){

  var datos=$stateParams.pago;
  var prefid=$rootScope.prefid;
  $scope.numConvenio="9903136140";
  $scope.numReferencia="9903136140";
  $scope.codigo="<ion-view title='{{header}}' hide-nav-bar='true'><ion-nav-view hide-nav-bar='true'><ion-content style='background-color:rgb(244,244,244)'><div style='height: 120pt; background-color:rgb(251,248,225);border-bottom: 2pt;border-bottom-color: rgb( 222,222,222); border-style:solid;line-height: 22pt;text-align: center;padding: 10px 16pt 50pt 16pt;' class='textoinstru'><i class='icon ion-social-usd pesos' style='color:rgb(239,199,1); margin:0pt 0pt 5pt 0pt'></i><br class='textoinstru'>Paga {{total | currency}} desde tu banca en línea de BBVA Bancomer</div><div class='card'><div class='item item-text-wrap opciones' style='text-align: left;width:100%;display:inline-block;border: none'>Elige Pago de servicios a MercadoLibre.<br class='textoinstru'><br><div class='copy'style='font-weight: 200; text-align: left;'>NÚMERO DE CONVENIO</div><div class='textoinstru'style='text-align: left; letter-spacing: 2.5px;'>{{numConvenio}}</div><br><div class='copy'style='font-weight: 200; text-align: left;'>REFERENCIA</div><div class='textoinstru'style='text-align: left; letter-spacing: 2.5px;'>{{numReferencia}}</div><br><br><button class='button button-outline button-positive' style=' -webkit-tap-highlight-background-color: rgb(0,0,0,0);    height:18pt; width:80px; margin: -20px -100px; position:relative;top:50%; left:50%; width:200px;text-align: center; font-size: 12pt;color: rgb(0,159,222); border-color:rgb(0,159,222);'>Ir a banca en línea</button><br><br></div><div class='item item-text-wrap opciones' style=' background-color:rgb(244,244,244); text-align: left;'>¿Prefieres transferir desde tu computadora o tablet?<div class='copy'><br></div><div style='font-weight: 200'>Te enviamos un e-mail para que puedas hacerlo desde tu correo.</div></div><div class='item item-text-wrap texto item-icon-left amarillo' style=' background-color:rgb(244,244,244); text-align: left;border-style: none; color:rgb(178,144,84);font-weight: 200'><i>Se acreditará en menos de 1 hora.</i><i class='icon ion-ios-clock-outline amarillo'></i></div></div><footer></footer></ion-content></ion-view>";

  $scope.total=MercadoPagoService.calcularTotal(prefid);

  $scope.Salir=function(){
    MercadoPagoService.volver($stateParams.flavour,datos,prefid,false);
  }
})
.directive('footer', function(){
    return {
      restrict: 'AE',
      template: "<br> <div style='background-color: rgb( 222,222,222); border-bottom: 1pt;border-bottom-color: rgb( 222,222,222); border-style:solid; margin: 0px 20px 0px 20px'></div> <br> <div class='footer'>Usuario@gmail.com (<a class='link'>Salir</a>)</div><br><div class='footer'><a class='link' ng-click='Salir()'>Cancelar y volver</a></div><br><div class='copy'<p>© 1999-2015 Procesado por MercadoPago</p></div><br>"
    }
})
.directive('compileHtml', function($compile) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, element, attrs) {
          scope.$watch(function () {
              return scope.$eval(attrs.compileHtml);
          }, function (value) {
              element.html(value);
              $compile(element.contents())(scope);
          });
      }
    };
});
