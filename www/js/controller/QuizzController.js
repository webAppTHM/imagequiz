'use strict';
angular.module('imageQuizz').controller('QuizzController',
    function (QuestionData, $scope, $state, $stateParams, $ionicPopup, $ionicNavBarDelegate, StatData, $timeout, $document) {

        //Setzt den 'correctRightSeriesCounter' einer Kategorie zurück
        this.removeFullyRememberedQuestions = function (questionList) {
            for (var i = 0; i < questionList.length; i++){
                if(StatData.findStatByQuestionId(questionList[i].id).actRightSeries >= 6){
                    questionList.splice(i,1);
                    i = i-1;
                }
            }
            return questionList;
        };


        //actversion
        //Setzen der ersten Frage, ermitteln der Fragen die noch nicht als gelernt eingestuft sind
        $scope.cur = 0;
        $scope.questionList = this.removeFullyRememberedQuestions(QuestionData.findAllQuestionsByCategory($stateParams.id));
        //Variablen zur Statistikermittlung
        $scope.correctAnswersCount = 0;
        $scope.wrongAnswerCount = 0;
        $scope.workedQuestionCount = 0;
        $scope.learnedQuestionCount = 0;

        $scope.rightAnswer = "";
        $scope.wrongAnswer = "";

        //Ermittelt die aktuelle höhe des Dokuemnts für den View
        $scope.actHight = $document.innerHeight;

        //Hier wird geprüft ob zu jeder Frage bereits ein Statistik Objekt existiert. Wenn nicht
        //wird es hier angelegt
        //TO-DO muss hier entfernt werden, bzw. es muss sichergestellt sein das die Statistik beim Modul import angelegt wird.
        $scope.questionList.forEach(function (question) {
            if (!StatData.findStatByQuestionId(question.id)) {
                StatData.addStat(question.id);
                console.log("Statistik hinzugefügt");
            }
        });

        //Erkennung der swipe Gesten (Frage vor/zurück)
/*        $scope.swipeRight = function () {
            $scope.questionList = $scope.ref.removeFullyRememberedQuestions(QuestionData.findAllQuestionsByCategory($stateParams.id));
            $scope.act = --$scope.cur % $scope.complete + 1;
            $scope.question = $scope.questionList[$scope.act - 1];
            $ionicNavBarDelegate.setTitle($scope.act + "/" + $scope.complete);
        };*/
        $scope.nextQuestion = function () {
            //$scope.questionList = $scope.ref.removeFullyRememberedQuestions(QuestionData.findAllQuestionsByCategory($stateParams.id));
            if($scope.cur < $scope.questionList.length){
                $scope.question = $scope.questionList[$scope.cur++];
                $ionicNavBarDelegate.setTitle($scope.cur + "/" + $scope.complete);
            } else {
                var categoryCompletePopup = $ionicPopup.alert({
                    title: 'Rundenstatistik',
                    template: 'Bearbeitete Fragen: '+$scope.workedQuestionCount +'<br><hr>Korrekt beantwortet: '+$scope.correctAnswersCount+'<br>Falsch beantwortet: '+$scope.wrongAnswerCount+'<hr>Gelernte Karten: '+$scope.learnedQuestionCount
                });
                categoryCompletePopup.then(function(res) {
                    $ionicNavBarDelegate.back();
                })
            }

        };

        $scope.nextQuestion();

        //Aktelle Anzahl an Fragen und aktuelle Frage
        $scope.complete = $scope.questionList.length;
        $scope.act = 1;

        $ionicNavBarDelegate.setTitle($scope.act + "/" + $scope.complete);

        //Zeigt zu einer Frage für 2500ms den in der Frage hinterlegten Infotext an
        this.toggleInfo = function () {
            var popup = $ionicPopup.alert({
                title: 'Information',
                template: $scope.question.infoText
            });
            $timeout(function () {
                popup.close();
            }, 2500);
        };

        this.testAnswer = function (answer) {
            var correctAnswer;
            var stat = StatData.findStatByQuestionId($scope.question.id);
            var right = stat.countRight;
            var wrong = stat.countWrong;
            var series = stat.actRightSeries;
            $scope.workedQuestionCount++;

            //Die korrekte Antwort wird gesucht und in 'correctAnswer' gespeichert
            $scope.question.options.forEach(function (option) {
                if(option['answer'] == true) {
                    correctAnswer = option['option'];
                }
            });

            if(answer === correctAnswer){
                $scope.rightAnswer = correctAnswer;
                right += 1;
                series += 1;
                $scope.correctAnswersCount++;
                if(series == 6){
                    $scope.learnedQuestionCount++;
                }
                $timeout(function () {
                    StatData.updateStat($scope.question.id,right,wrong,series);
                    $scope.rightAnswerAnswer = "";
                    $scope.nextQuestion();
                }, 1000);

            } else {
                $scope.question.options.forEach(function (option) {
                    if (option['option'] == answer) {
                        $scope.wrongAnswer = answer;
                    }
                    if (option['answer'] == true) {
                        $scope.rightAnswer = option['option'];
                    }
                });
                wrong += 1;
                series = 0;
                $scope.wrongAnswerCount++;

                $timeout(function () {
                    StatData.updateStat($scope.question.id,right,wrong,series);
                    $scope.wrongAnswer = "";
                    $scope.rightAnswerAnswer = "";
                    $scope.nextQuestion();
                }, 1000);
            }
        }
    });