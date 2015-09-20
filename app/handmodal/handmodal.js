(function () {
    'use strict';
    var controllerId = 'handmodal';
    angular.module('app').controller(controllerId, ['common', '$scope', 'handsimulator', '$modalInstance', 'fullDeck', handmodal]);

    function handmodal(common, $scope, handsimulator, $modalInstance, fullDeck) {

        var vm = this;

        vm.fullDeck = fullDeck;
        vm.currentCards = 7;

        $scope.generateNewHand = function () {
            vm.currentCards = 7;
            $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);
            trackEvent(controllerId, 'generate-new-hand');
        };
        $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);


        $scope.mulligan = function () {
            if (vm.currentCards > 0) {
                vm.currentCards--;
            }
            $scope.handCards = handsimulator.generateHand(vm.fullDeck, vm.currentCards);
            trackEvent(controllerId, 'mulligan');
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.nextCard = function () {
            var nextCard = handsimulator.getNextCard();
            if (nextCard != null) {
                $scope.handCards.push(nextCard);
            } else {
                var getLogFn = common.logger.getLogFn;
                var log = getLogFn(controllerId);
                var logError = common.logger.getLogFn(controllerId, 'error');
                logError("There are no more cards to draw");
            }
            trackEvent(controllerId, 'draw-next-card');
        }


        activate();


        function activate() {
        }

    }
})();