var app = angular.module('myApp', [ /*'ui.bootstrap'*/ ]);

app.directive('menu', function() {
    return {
        restrict: 'A',
        scope: {

            menu: '=menu',
            cls: '=ngClass',
            favorites: '=favorites'
        },
        replace: true,
        template: [
            '<ul class="dropdown-menu">',
            '<li class=" nav-header">Markets</li>',
            '<li ng-repeat="item in menu" menu-item="item" ptk-index="{{$index}}" parent-id="{{parentId}}"></li>',
            '<li class=" nav-header">Favorites -<a href="#" class="selectAll" ng-click="selectAllFavorites();">&nbsp;Select all&nbsp;</a></li>',
            '<div class="favoritescontainer">',
            '<li class="favorites-block" ng-repeat="item in favorites" favorites-item="item" ptk-index="{{$index}}" parent-id="0"></li>',
            '</div>',
            '</ul>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.selectAllFavorites = function() {
                var sc = scope;
                while (sc.$parent.favorites)
                    sc = sc.$parent;
                for (var i in sc.favorites) {
                    var el = sc.favorites[i];
                    if (!el.group) {
                        el.selected = true;
                    }
                }
            }
        }
    };
});


app.directive('menuSub', function() {
    return {
        restrict: 'A',
        scope: {
            menu: '=menuSub',
            cls: '=ngClass'
        },
        replace: true,
        template: [
            '<ul class="dropdown-menu">',
            '<li><a href="#" class="selectAll" ng-click="selectAll(ptkIndex)">Select all</a></li>',
            '<li ng-repeat="item in menu" menu-item="item" ptk-index="{{$index}}" parent-id="{{item.parentId}}"></li>',
            '</ul>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.ptkIndex = attrs.ptkIndex;

            scope.selectAll = function(pIndex) {

                var sc = scope;
                while (sc.$parent)
                    if (sc.$parent.menu)
                        sc = sc.$parent;
                    else break;
                for (var i in sc.menu[pIndex].submenu) {
                    sc.menu[pIndex].submenu[i].selected = true;

                }
            }
        }
    };
});

app.directive('menuItem', function($compile, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        controller: 'myCtrl',
        scope: {
            item: '=menuItem',
            submenuClick: '&'
        },
        template: [
            '<li active-link id="ptk_{{item.id}}" ng-class="{ selected: ptkselected }" >',
            '<a class="fas fa-star " parent-id="{{item.parentId}}" href="#" ng-class="{ favorite: ptkfavorite, favoritable: ptkfavoritable }" ptk-favorite="{{ ptkfavorite?1:0 }}" ng-click="toggleFavorite(item.id, $event);"></a>',
            '<a data-id={{item.id}} href="#" parent-id="{{item.parentId}}" ptk-selected="{{ ptkselected?1:0 }}" ng-click="toggleSelect(item.id, $event);">{{item.title}}<i class="fas fa-caret-right" ng-class="{ hidecaret: hidecaret }"></i></a>',
            '</li>'
        ].join(''),
        link: function(scope, element, attrs) {
            var sc = scope;
            sc.hidecaret = true;

            while (sc.$parent.menu)
                sc = sc.$parent;

            sc.itemUpdating = true;

            scope.ptkClass = [];
            scope.ptkfavorite = false;

            scope.ptkfavoritable = false;
            scope.ptkselected = false;
            scope.ptkIndex = attrs.ptkIndex;

            if (scope.item.header) {
                element.addClass('nav-header');
                element.text(scope.item.header);
            }
            if (scope.item.divider) {
                element.addClass('divider');
                element.empty();
            }
            if (scope.item.submenu) {
                scope.ptkfavoritable = false;

                sc.hidecaret = false;

                element.addClass('dropdown');

                var text = element.children('a').text();
                element.empty();
                element.append('<a class=" dropdown-toggle " ng-click="submenuClick(ptkIndex, $event)">' + text + '<i class="fas fa-caret-right"></i></a>');

                element.append('<div menu-sub="item.submenu" parent-id="{{item.id}}" ptk-index="{{ptkIndex}}"   ng-class="ptkClass"></div>');
            } else {
                scope.ptkfavoritable = true;

                if (scope.item.selected)
                    scope.ptkselected = true;
                else
                    scope.ptkselected = false;
                if (scope.item.favorite)
                    scope.ptkfavorite = true;
                else
                    scope.ptkfavorite = false;
            }

            scope.$watch("item", function(obj) {
                $timeout(function() {

                    sc.itemUpdating = true;
                    scope.ptkClass = [];
                    scope.ptkFavoritesClass = [];
                    if (obj.open)
                        scope.ptkClass.push("show");
                    if (obj.selected)
                        scope.ptkselected = true;
                    else
                        scope.ptkselected = false;

                    if (obj.favorite)
                        scope.ptkfavorite = true;
                    else
                        scope.ptkfavorite = false;
                    sc.itemUpdating = false;
                });

                sc.itemUpdating = false;
            }, true);



            $compile(element.contents())(scope);
        }
    };
});

app.directive('favoritesItem', function($compile, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        controller: 'myCtrl',
        scope: {
            item: '=favoritesItem'
        },
        template: [
            '<li active-link id="ptk_{{item.id}}" ng-class="{ selected: ptkselected }" >',
            '<a class="fas fa-star " href="#" ng-class="{ favorite: ptkfavorite, favoritable: ptkfavoritable }" ptk-favorite="{{ ptkfavorite?1:0 }}" ng-click="toggleFavoriteFavorite(item.id, $event);"></a>',
            '<a data-id={{item.id}} href="#"  ptk-selected="{{ ptkselected?1:0 }}" ng-click="toggleFavoriteSelect(item.id, $event);">{{item.title}}</a>',
            '</li>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.parentId = 0;
            if (attrs.parentId)
                scope.parentId = attrs.parentId;

            scope.ptkClass = [];
            scope.ptkfavorite = false;

            scope.ptkfavoritable = false;
            scope.ptkselected = false;
            scope.ptkIndex = attrs.ptkIndex;

            if (scope.item.header) {
                element.addClass('nav-header');
                element.text(scope.item.header);
            }
            if (scope.item.divider) {
                element.addClass('divider');
                element.empty();
            }


            scope.ptkfavoritable = true;

            if (scope.item.selected)
                scope.ptkselected = true;
            else
                scope.ptkselected = false;
            if (scope.item.favorite)
                scope.ptkfavorite = true;
            else
                scope.ptkfavorite = false;


            scope.$watch("item", function(obj) {
                $timeout(function() {

                    scope.ptkClass = [];
                    scope.ptkFavoritesClass = [];
                    if (obj.open)
                        scope.ptkClass.push("show");
                    if (obj.selected)
                        scope.ptkselected = true;
                    else
                        scope.ptkselected = false;

                    if (obj.favorite)
                        scope.ptkfavorite = true;
                    else
                        scope.ptkfavorite = false;

                });


            }, true);



            $compile(element.contents())(scope);
        }
    };
});


app.directive('found', function() {
    return {
        restrict: 'A',
        scope: {
            found: '=found'
        },
        replace: true,
        template: [
            '<ul class="dropdown-menu">',
            '<li class=" nav-header">Markets</li>',
            '<div class="foundscontainer">',
            '<li ng-repeat="item in found" found-item="item" ptk-index="{{$index}}" parent-id="{{parentId}}"></li>',
            '</div>',
            '</ul>'
        ].join(''),
        link: function(scope, element, attrs) {
            scope.selectAllFound = function() {
                var sc = scope;
                while (sc.$parent.found)
                    sc = sc.$parent;
                for (var i in sc.found) {
                    var el = sc.found[i];
                    if (!el.group) {
                        el.selected = true;
                    }
                }
            }
        }
    };
});


app.directive('foundItem', function($compile, $timeout) {
    return {
        restrict: 'A',
        replace: true,
        controller: 'myCtrl',
        scope: {
            item: '=foundItem'
        },
        template: [
            '<li active-link id="ptk_{{item.id}}" ng-class="{ selected: ptkselected }" >',
            '<a class="fas fa-star " parent-id="{{item.parentId}}" href="#" ng-class="{ favorite: ptkfavorite, favoritable: ptkfavoritable }" ptk-favorite="{{ ptkfavorite?1:0 }}" ng-click="toggleFoundFavorite(item.id, $event);"></a>',
            '<a data-id={{item.id}} href="#" parent-id="{{item.parentId}}" ptk-selected="{{ ptkselected?1:0 }}" ng-click="toggleFoundSelect(item.id, $event);">{{item.title}}</a>',
            '</li>'
        ].join(''),
        link: function(scope, element, attrs) {
            var sc = scope;
            while (sc.$parent.menu)
                sc = sc.$parent;

            sc.itemUpdating = true;

            scope.ptkClass = [];
            scope.ptkfavorite = false;

            scope.ptkfavoritable = false;
            scope.ptkselected = false;
            scope.ptkIndex = attrs.ptkIndex;

            if (scope.item.header) {
                element.addClass('nav-header');
                element.text(scope.item.header);
            }
            if (scope.item.divider) {
                element.addClass('divider');
                element.empty();
            }


            scope.ptkfavoritable = true;

            if (scope.item.selected)
                scope.ptkselected = true;
            else
                scope.ptkselected = false;
            if (scope.item.favorite)
                scope.ptkfavorite = true;
            else
                scope.ptkfavorite = false;


            scope.$watch("item", function(obj) {
                $timeout(function() {

                    sc.itemUpdating = true;
                    scope.ptkClass = [];
                    scope.ptkFavoritesClass = [];

                    if (obj.selected)
                        scope.ptkselected = true;
                    else
                        scope.ptkselected = false;

                    if (obj.favorite)
                        scope.ptkfavorite = true;
                    else
                        scope.ptkfavorite = false;
                    sc.itemUpdating = false;
                });

                sc.itemUpdating = false;
            }, true);



            $compile(element.contents())(scope);
        }
    };
});


app.directive('searchField', function($timeout) {
    return {
        restrict: 'A',
        scope: {
            searchFocus: "=",
            searchString: "=",
            searchActive: "@"
        },
        replace: false,
        link: function(scope, element, attrs) {
            scope.searchActive = attrs.searchActive;
            scope.$watch("searchActive", function(newValue, oldValue) {
                $timeout(function() {
                    if (newValue == "1" || newValue == "2")
                        element[0].focus();

                });


            }, false);



        }
    };
});

app.controller('myCtrl', function($scope, $timeout) {

    $scope.init = function() {

        for (var i in $scope.menu) {
            if ($scope.menu.hasOwnProperty(i) && $scope.menu[i].hasOwnProperty("submenu")) {
                for (var j in $scope.menu[i].submenu) {
                    if ($scope.menu[i].submenu.hasOwnProperty(j)) {
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("selected")) $scope.menu[i].submenu[j].selected = false;
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("favorite")) $scope.menu[i].submenu[j].favorite = false;
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("parentId")) $scope.menu[i].submenu[j].parentId = $scope.menu[i].id;
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("parentIndex")) $scope.menu[i].submenu[j].parentIndex = i;
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("parentTitle")) $scope.menu[i].submenu[j].parentTitle = $scope.menu[i].title;
                        if (!$scope.menu[i].submenu[j].hasOwnProperty("itemIndex")) $scope.menu[i].submenu[j].itemIndex = j;

                        $scope.$watch('menu["' + i + '"].submenu["' + j + '"]', function(obj) {
                            //console.log(obj);
                            if (obj.parentId > 0) {

                                var grIndex = -1,
                                    grNextIndex = -1,
                                    grBigger = -1,
                                    grItems = 0,
                                    itIndex = -1,
                                    grCounting = 0;
                                for (var i in $scope.favorites) {
                                    var it = $scope.favorites[i];
                                    if (it.id == obj.parentId) {
                                        grIndex = parseInt(i);
                                        grNextIndex = parseInt(i) + 1;
                                        grCounting = 1;
                                        continue;
                                    }
                                    if (it.group) {
                                        if (it.id > obj.parentId) grBigger = parseInt(i);
                                        grCounting = 0;
                                        continue;
                                    }
                                    grItems += grCounting;
                                    grNextIndex += grCounting;
                                    if (it.id == obj.id) itIndex = i;

                                }
                                var sc = $scope;
                                /*while (sc.$parent)
                                    if (sc.$parent.favorites)
                                        sc = sc.$parent;
                                    else
                                        break;*/
                                if (obj.favorite) {


                                    if (itIndex >= 0) {
                                        //PTK: ukve damatebulia da unda davaapdetot
                                        sc.favorites[itIndex] = obj;

                                    } else {
                                        //PTK: ar iko damatebuli aqamde
                                        if (grIndex >= 0) {
                                            //jgufi damatebuli iko
                                            var fav = [];
                                            var inserted = false;
                                            for (var i in sc.favorites) {
                                                if (!inserted && parseInt(i) > grIndex && parseInt(i) < grNextIndex) {
                                                    if (parseInt(sc.favorites[i].id) > parseInt(obj.id)) {
                                                        fav.push(obj);
                                                        inserted = true;
                                                    }
                                                }
                                                if (!inserted && parseInt(i) == grNextIndex) {
                                                    fav.push(obj);
                                                    inserted = true;
                                                }

                                                fav.push(sc.favorites[i]);
                                                /* if (i == grIndex)
                                                     fav.push(obj);*/
                                            }
                                            if (!inserted) fav.push(obj);
                                            setTimeout(function() {
                                                sc.favorites = fav;
                                                sc.$apply();
                                            })

                                        } else {
                                            //jgufic ar iko damatebuli
                                            if (grBigger < 0) {
                                                //PTK: unda daematos boloshi
                                                sc.favorites.push({
                                                    "header": obj.parentTitle,
                                                    "group": true,
                                                    "id": obj.parentId
                                                });
                                                sc.favorites.push(obj);
                                            } else {
                                                //PTK: shuashi unda chaematos jgufi
                                                var fav = [];
                                                for (var i in sc.favorites) {
                                                    if (i == grBigger) {
                                                        fav.push({
                                                            "header": obj.parentTitle,
                                                            "group": true,
                                                            "id": obj.parentId
                                                        });
                                                        fav.push(obj);
                                                    }
                                                    fav.push(sc.favorites[i]);
                                                }

                                                setTimeout(function() {
                                                    sc.favorites = fav;
                                                    sc.$apply();
                                                });
                                            }
                                        }
                                    }
                                } else {

                                    if (itIndex >= 0) {
                                        //aris es chamatebul
                                        sc.favorites.splice(itIndex, 1);
                                        if (grItems < 2)
                                            sc.favorites.splice(grIndex, 1);

                                    }
                                }

                            }


                        }, true);

                    }
                }


            }
        }

        $scope.$watch("searchString", function(newValue, oldValue) {
            if (newValue.length == 0)
                $scope.found = [];
            if (newValue.length > 1) {
                if (searchTimeout != null) {
                    clearTimeout(searchTimeout);
                    searchTimeout = null;
                }
                searchTimeout = setTimeout($scope.searchEverywhere(newValue), 1000);
            }
            $scope.drawMode('search');
        }, false);


    }


    var searchProcessId = 0;
    var searchTimeout = null;
    $scope.searchEverywhere = function(string) {
        searchProcessId++;
        var searchProcessIdInner = searchProcessId;
        var found = [];
        string = string.toLowerCase();
        var sc = $scope;
        while (sc.$parent)
            if (sc.$parent.menu)
                sc = sc.$parent;
            else
                break;
        var lastGroupId = 0;
        for (var i in sc.menu) {
            if (sc.menu[i].submenu)
                for (var j in sc.menu[i].submenu) {
                    var title = sc.menu[i].submenu[j].title.toLowerCase();
                    if (title.indexOf(string) >= 0) {
                        if (lastGroupId != sc.menu[i].submenu[j].parentId) {
                            found.push({
                                "header": sc.menu[i].submenu[j].parentTitle,
                                "group": true,
                                "id": sc.menu[i].submenu[j].parentId
                            });
                            lastGroupId = sc.menu[i].submenu[j].parentId;
                        }
                        found.push(sc.menu[i].submenu[j]);

                    }
                }
        }
        if (searchProcessId == searchProcessIdInner)
            sc.found = found;
        // scope.$apply();
    }



    $scope.toggleMenu = function() {
        if ($scope.mode != "menu")
            $scope.drawMode('menu');
        else
            $scope.drawMode('none');

        sc = $scope;
        while (sc.$parent.searchString)
            sc = sc.$parent;
        sc.placeholder = "Select Coin";
        sc.searchFocus = 0;
        sc.searchString = "";
        sc.found = [];
    }


    $scope.toggleSearch = function(index) {
        $scope.drawMode('search');

        sc = $scope;
        while (sc.$parent.searchString)
            sc = sc.$parent;
        sc.placeholder = "Search for Coin";
        sc.searchFocus = index;
        sc.searchString = "";
        sc.found = [];

    }

    $scope.drawMode = function(mode) {

        switch (mode) {
            default: $scope.mode = "none";
            $scope.menuAriaMain = false;
            $scope.menuClassMain = "";
            $scope.searchClassMain = "";
            break;
            case "menu":
                    $scope.mode = mode;
                $scope.menuAriaMain = true;
                $scope.menuClassMain = "show";
                $scope.searchClassMain = "";
                break;
            case "search":
                    $scope.mode = mode;
                $scope.menuAriaMain = false;
                $scope.menuClassMain = "";
                $scope.searchClassMain = $scope.found.length > 0 ? "show" : "";
                $scope.hideSearchClear = $scope.found.length == 0;
                break;
        }
    }

    $scope.submenuClick = function(index, e) {
        var sc = angular.element(e.srcElement).scope();
        while (sc.$parent && sc.$parent.item)
            sc = sc.$parent;

        for (var i in sc.menu) {
            if (i == index) continue;
            sc.menu[i].open = false;
        }

        if (sc.menu[index].open) {
            sc.menu[index].open = false;
        } else {
            sc.menu[index].open = true;
        }
    }

    $scope.toggleFavorite = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-favorite']) return;
        var favorite = angular.element(e.srcElement)[0].attributes['ptk-favorite'].value;

        var sc = angular.element(e.srcElement).scope();
        if (favorite == "1") sc.item.favorite = false;
        else sc.item.favorite = true;

    }

    $scope.toggleFavoriteFavorite = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-favorite']) return;
        var sc = angular.element(e.srcElement).scope();
        if (sc) {
            while (sc.$parent.item)
                sc = sc.$parent;
            if (!sc.itemUpdating) {
                sc.itemUpdating = true;
                sc.item.favorite = false;
                $timeout(function() { sc.itemUpdating = false; })
            }
        }
    }

    $scope.toggleFoundFavorite = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-favorite']) return;
        var favorite = angular.element(e.srcElement)[0].attributes['ptk-favorite'].value;
        var sc = angular.element(e.srcElement).scope();
        sc.favorite = favorite == "0";
        if (sc) {
            while (sc.$parent.item)
                sc = sc.$parent;
            if (!sc.itemUpdating) {
                sc.itemUpdating = true;
                sc.item.favorite = favorite == "0";
                $timeout(function() { sc.itemUpdating = false; })
            }
        }
    }

    $scope.toggleSelect = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-selected']) return;
        var select = angular.element(e.srcElement)[0].attributes['ptk-selected'].value;

        var sc = angular.element(e.srcElement).scope();
        if (select == "1") sc.item.selected = false;
        else sc.item.selected = true;

    }

    $scope.toggleFavoriteSelect = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-selected'] || !angular.element(e.srcElement)[0].attributes['ptk-selected'].value) return;
        var select = angular.element(e.srcElement)[0].attributes['ptk-selected'].value;
        var sc = angular.element(e.srcElement).scope();
        if (sc) {
            while (sc.$parent.item)
                sc = sc.$parent;
            if (!sc.itemUpdating) {
                sc.itemUpdating = true;
                if (select == "1")
                    sc.item.selected = false;
                else
                    sc.item.selected = true;
                $timeout(function() { sc.itemUpdating = false; })

            }
        }
    }


    $scope.toggleFoundSelect = function(id, e) {
        if (!angular.element(e.srcElement)[0].attributes['ptk-selected'] || !angular.element(e.srcElement)[0].attributes['ptk-selected'].value) return;
        var select = angular.element(e.srcElement)[0].attributes['ptk-selected'].value;
        var sc = angular.element(e.srcElement).scope();
        sc.selected = !sc.selected;
        if (sc) {
            while (sc.$parent.item)
                sc = sc.$parent;
            if (!sc.itemUpdating) {
                sc.itemUpdating = true;
                if (select == "1")
                    sc.item.selected = false;
                else
                    sc.item.selected = true;

                $timeout(function() { sc.itemUpdating = false; })

            }
        }
    }

    $scope.clearSearch = function() {
        $scope.searchString = "";
    }


    $scope.hideSearchClear = true;

    $scope.itemUpdating = false;

    $scope.favoritesIdle = true;

    $scope.lastMenu = 0;
    $scope.mode = "none";

    $scope.searchString = "";
    $scope.searchFocus = 0;

    $scope.menuClassMain = "";
    $scope.menuAriaMain = false;

    $scope.searchClassMain = "";

    $scope.placeholder = "Select Coin";

    $scope.menu = [{
            "id": 1,
            "title": "BTC",
            "open": false,
            "submenu": [{
                    "id": 4,
                    "title": "BAT (BasicAttention)",
                    "selected": true,
                    "favorite": true
                },
                {
                    "id": 5,
                    "title": "DAR (Darcus)",
                    "favorite": true
                },
                {
                    "id": 6,
                    "title": "EBST (eBoost)",
                    "selected": true
                },
                {
                    "id": 7,
                    "title": "EDG (Edgeless)",
                    "selected": true
                },
                {
                    "id": 8,
                    "title": "ETH (Ethereum)"
                },
                {
                    "id": 9,
                    "title": "KORE (KoreCoin)"
                },
                {
                    "id": 10,
                    "title": "NEO (Neo)"
                },
                {
                    "id": 11,
                    "title": "RISE (Rise)"
                }
            ]
        },
        {
            "id": 2,
            "title": "Ethereum",
            "open": false,
            "submenu": [{
                    "id": 12,
                    "title": "BAT (BasicAttention)"
                },
                {
                    "id": 13,
                    "title": "DAR (Darcus)"
                },
                {
                    "id": 14,
                    "title": "EBST (eBoost)"
                },
                {
                    "id": 15,
                    "title": "EDG (Edgeless)"
                },
                {
                    "id": 16,
                    "title": "ETH (Ethereum)"
                },
                {
                    "id": 17,
                    "title": "KORE (KoreCoin)"
                },
                {
                    "id": 18,
                    "title": "NEO (Neo)"
                },
                {
                    "id": 19,
                    "title": "RISE (Rise)"
                }
            ]
        },
        {
            "id": 3,
            "title": "USDT",
            "open": false,
            "submenu": [{
                    "id": 20,
                    "title": "BAT (BasicAttention)",
                    "selected": true
                },
                {
                    "id": 21,
                    "title": "DAR (Darcus)",
                    "favorite": true
                },
                {
                    "id": 22,
                    "title": "EBST (eBoost)",
                    "selected": true
                },
                {
                    "id": 23,
                    "title": "EDG (Edgeless)"
                },
                {
                    "id": 24,
                    "title": "ETH (Ethereum)"
                },
                {
                    "id": 25,
                    "title": "KORE (KoreCoin)"
                },
                {
                    "id": 26,
                    "title": "NEO (Neo)"
                },
                {
                    "id": 27,
                    "title": "RISE (Rise)"
                }
            ]
        }

    ];

    $scope.favorites = [{
            "id": 1,
            "header": "BTC",
            "group": true
        },
        {
            "id": 4,
            "title": "BAT (BasicAttention)",
            "selected": true,
            "favorite": true
        },
        {
            "id": 5,
            "title": "DAR (Darcus)",
            "favorite": true
        },
        {
            "id": 3,
            "header": "USDT",
            "group": true
        },
        {
            "id": 21,
            "title": "DAR (Darcus)",
            "favorite": true
        }
    ];

    $scope.found = [];


    $scope.init();
});