angular.module("rc-context-popup")

    .factory("contextMenu", function() {
        return {
            activeElem: null,
            onClose: null
        };
    })

    .directive("contextMenuBind", ["$document", "$rootScope", "$timeout", "contextMenu",
        function($document, $rootScope, $timeout, contextMenu) {
            return {
                restrict: "A",
                scope: {
                    id: "@contextMenuBind",
                    onOpen: "&?contextMenuOnOpen",
                    onClose: "&?contextMenuOnClose"
                },
                link: function(scope, elem) {
                    function open(event) {
                        var m = $document[0].getElementById(scope.id);
                        if(!m) {
                            console.log("Can not open context menu: Context menu with id " + scope.id + " not found...");
                            return;
                        }
                        var menuElement = angular.element(m);
                        event.preventDefault();
                        event.stopPropagation();
                        if(contextMenu.activeElem && menuElement[0] === contextMenu.activeElem[0]) return;
                        var doc = $document[0].documentElement;
                        var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                        var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                        var elementWidth = menuElement[0].scrollWidth;
                        var elementHeight = menuElement[0].scrollHeight;
                        var docWidth = doc.clientWidth + docLeft;
                        var docHeight = doc.clientHeight + docTop;
                        var totalWidth = elementWidth + event.pageX;
                        var totalHeight = elementHeight + event.pageY;
                        var left = Math.max(event.pageX - docLeft, 0);
                        var top = Math.max(event.pageY - docTop, 0);
                        if (totalWidth > docWidth) {
                            left = left - (totalWidth - docWidth);
                        }
                        if (totalHeight > docHeight) {
                            top = top - (totalHeight - docHeight);
                        }

                        menuElement.css("left", left + "px");
                        menuElement.css("top", top + "px");
                        menuElement.css("display", "block");
                        menuElement.css("opacity", 1);

                        close();
                        contextMenu.activeElem = menuElement;
                        contextMenu.onClose = scope.onClose;
                        scope.onOpen && scope.onOpen();
                        scope.$apply();
                    }

                    function close() {
                        if(contextMenu.activeElem) {
                            contextMenu.activeElem.css("opacity", 0);
                            var e = contextMenu.activeElem;
                            $timeout(function() {
                                e.css("display", "none");
                            }, 300);
                            contextMenu.onClose && contextMenu.onClose();
                            contextMenu.activeElem = null;
                            contextMenu.onClose = null;
                        }
                    }
                    elem.bind("click", open);
                    $document.bind("click", close);
                    var unregister = $rootScope.$on("contextmenuclose", close);
                    scope.$on("$destroy", function() {
                        $document.unbind("click", close);
                        unregister();
                    });
                }
            };
        }])

    .directive("contextMenu", function() {
        return function(scope, elem) {
            var transition = ".3s opacity";
            var shadow = "0 6px 12px rgba(0,0,0,.175)";
            elem.css({
                "display": "none",
                "opacity": 0,
                "position": "fixed",
                "z-index": 9999,
                "background-color": "#fff",
                "-o-transition": transition,
                "-webkit-transition": transition,
                "-moz-transition": transition,
                "transition": transition,
                "-webkit-box-shadow": shadow,
                "-mox-box-shadow": shadow,
                "-o-box-shadow": shadow,
                "box-shadow": shadow
            });
            elem.bind("click", function(event) {
                /*event.preventDefault();*/ // if enabled, hinders checkbox selection of checkboxes inside contextmenu
                event.stopPropagation();
            });
        };
    });

