angular.module("rc-context-popup", [])

    .factory("contextPopup", function() {
        return {
            activeElem: null,
            onClose: null
        };
    })

    .directive("contextPopupBind", ["$document", "$rootScope", "$timeout", "contextPopup",
        function($document, $rootScope, $timeout, contextPopup) {
            return {
                restrict: "A",
                scope: {
                    id: "@contextPopupBind",
                    onOpen: "&?contextPopupOnOpen",
                    onClose: "&?contextPopupOnClose"
                },
                link: function(scope, elem) {
                    function open(event) {
                        var m = $document[0].getElementById(scope.id);
                        if(!m) {
                            console.log("Can not open context popup: Context popup with id " + scope.id + " not found...");
                            return;
                        }
                        var popupElement = angular.element(m);
                        event.preventDefault();
                        event.stopPropagation();
                        if(contextPopup.activeElem && popupElement[0] === contextPopup.activeElem[0]) return;
                        var doc = $document[0].documentElement;
                        var docLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                        var docTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                        var elementWidth = popupElement[0].scrollWidth;
                        var elementHeight = popupElement[0].scrollHeight;
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

                        popupElement.css("left", left + "px");
                        popupElement.css("top", top + "px");
                        popupElement.css("display", "block");
                        popupElement.css("opacity", 1);

                        close();
                        contextPopup.activeElem = popupElement;
                        contextPopup.onClose = scope.onClose;
                        scope.onOpen && scope.onOpen();
                        scope.$apply();
                    }

                    function close() {
                        if(contextPopup.activeElem) {
                            contextPopup.activeElem.css("opacity", 0);
                            var e = contextPopup.activeElem;
                            $timeout(function() {
                                e.css("display", "none");
                                $rootScope.$emit("contextpopupclosed");
                            }, 300);
                            contextPopup.onClose && contextPopup.onClose();
                            contextPopup.activeElem = null;
                            contextPopup.onClose = null;
                        }
                    }
                    elem.bind("click", open);
                    $document.bind("click", close);
                    var unregister = $rootScope.$on("contextpopupclose", close);
                    scope.$on("$destroy", function() {
                        $document.unbind("click", close);
                        unregister();
                    });
                }
            };
        }])

    .directive("contextPopup", function() {
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
                /*event.preventDefault();*/ // if enabled, hinders checkbox selection of checkboxes inside contextPopup
                event.stopPropagation();
            });
        };
    });

