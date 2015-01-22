/**
 * TODO: comment
 */
'use strict';
angular.module('imageQuizz').controller('ModuleListController',
    function ($scope, QuestionData, $ionicPopup, StatData, $state, $FirebaseObject, $timeout) {
        var self = this;
        $scope.proofModules = QuestionData.findAllQuestions().length;

        /**
         *
         * @returns {{}}
         */
        this.loadList = function () {
            var sync = localStorage.getItem('sync');
            if(sync == 1){
                var modules = QuestionData.findAllQuestions();

                    var tmp = {};
                    for (var i = 0; i < modules.length; i++) {
                        var letter = modules[i].category.charAt(0);
                        if (tmp[letter] == undefined) {
                            tmp[letter] = []
                        }
                        tmp[letter].push(modules[i]);
                    }
                    $scope.repeaterObject = tmp;
                    //unschön
                    $state.reload();
                    $scope.proofModules = QuestionData.findAllQuestions().length;
                    return tmp;

            } else {
                var modules = QuestionData.findAllQuestions();

                    console.log(modules);
                    var tmp = {};
                    for (var i = 0; i < modules.length; i++) {
                        var letter = modules[i].category.charAt(0);
                        if (tmp[letter] == undefined) {
                            tmp[letter] = []
                        }
                        tmp[letter].push(modules[i]);
                    }
                    $scope.repeaterObject = tmp;
                    return tmp;
            }
        };

        /**
         *
         * @type {{}}
         */
        $scope.repeaterObject = this.loadList();

        //Für Zustandswechsel anmelden
        $scope.$on('$stateChangeStart',
            function () {
                if (self.searchActive == true) {
                    var saveSearchQuery = localStorage.setItem('saveQuery', JSON.stringify(self.searchQuery));
                }
            });
        /**
         *
         * @type {boolean}
         */
        $scope.searchActive = false;
        if (localStorage.getItem('saveQuery')) {
            this.searchActive = true;
            this.searchQuery = JSON.parse(localStorage.getItem('saveQuery'));
            localStorage.removeItem('saveQuery');
        }
        ;

        /**
         *
         */
        this.toggleSearch = function () {
            if (this.searchActive) {
                this.searchQuery = '';
            }
            this.searchActive = !this.searchActive;
        };

        this.removeFromList = function (category) {
            //var stats = StatData.findAllStats();
            var questions = QuestionData.findAllQuestions();

            for (var i = 0; i < questions.length; i++) {

                if (questions[i].category == category) {
                    //var id = questions[i].id;
                    //for (var j = 0; j < stats.length; j++) {

                    //    StatData.updateStat(id, 0, 0, 0);
                    //}
                }
            }
            QuestionData.deleteCategory(category);
            $timeout(function () {
                self.loadList();
            }, 300);
        };

        /**
         *
         * @param category
         */
        $scope.deleteCategory = function (category) {
            var popup = $ionicPopup.confirm({
                title: 'Kategorie löschen',
                template: 'Sind Sie sicher das die Kategorie <strong>'+category+'</strong> gelöscht werden soll?' ,
                cancelText: 'Abbruch',
                okText: 'Löschen'
            });
            popup.then(function (res) {
                if (res) {
                    self.removeFromList(category);
                    $scope.repeaterObject = self.loadList();
                    $scope.proofModules = QuestionData.findAllQuestions().length;
                }
            });
        }

        $scope.goImport = function () {
            $state.go('tabs.settings');
        }
    });