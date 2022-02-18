var ExperimentData = function(){
    this.subject = {
        name: "",
        surname: "",
        age:"",
        gender:"",
        hasTakenMedicines:false,
        listOfMedicinesText:""
    };
    
    this.rounds = [];
};

function Round(roundNumber){
    this.roundNumber = roundNumber;
    //in this array 
    this.answersArray = [];
};

function Answer(isYes,isTarget,answerTimestamp,startingQuestionTimestamp){
    this.isYes = isYes;
    this.isTarget = isTarget;
    this.questionStartingTimeInMillis = startingQuestionTimestamp;
    this.startWindowTimestamp = answerTimestamp - 1000;
    this.answerTimestamp = answerTimestamp;
    this.endingWindowTimestamp = answerTimestamp + 2000;
};

var currentQuestionStartTimestamp = 0;
var targetFound = false;
var difficultyAdded = false;
var yesDecisionNumber = 0;
var experimentData = null;
var cardsArray = [];
var currentTargetIndex = 1;
var atLeastOneYes = false;

var confMillisForCard = 2000;
var maxRounds = 5;

$(document).ready(function(){
    changePage("introduction-page");
    
    //initialize the array with numbers
    for(var i = 0;i < 39;i++){
        cardsArray[i] = i;
    }
    
    experimentData = new ExperimentData();
    
    //set listeners
    $("#start-experiment").click(function(){
        var name = $("#subject-name").val();
        var surname = $("#subject-surname").val();
        var age = $("#subject-age").val();
        
        if(document.getElementById("subject-is-male").checked){
           var gender = "male";
        }
        else{
            var gender = "female";
        }
        hasTakenMedicines = document.getElementById("subject-medicine").checked;
        
        if(name && surname && age && (gender === "male" || gender === "female")){
            var subj = experimentData.subject;
            subj.name = name;
            subj.surname = surname;
            subj.age = Number(age);
            subj.gender = gender;
            subj.hasTakenMedicines = hasTakenMedicines;
            subj.listOfMedicinesText = $("#subject-age").val();
        }
        else{
            return;
        }
        
        //randomize the card indices representing cards
        cardsArray = shuffle(cardsArray);
        
        // choose a random number from 1 to 39 and show the card representing this number 
        // in the randomized deck
        currentTargetIndex = Math.floor((Math.random() * 39) + 1);
        
        var targetRepetition = 0;
        while(targetRepetition < 3){
            indexToBeReplaced = Math.floor((Math.random() * 39));
            if(cardsArray[indexToBeReplaced] !== currentTargetIndex && cardsArray[indexToBeReplaced - 1] !== currentTargetIndex){
                cardsArray[indexToBeReplaced] = currentTargetIndex;
                targetRepetition++;
            }
        }
        
        experimentData.rounds.push(new Round(getCurrentRoundNumber() + 1));
        atLeastOneYes = false;
        
        //set image in GUI to current random index chosen
        setImageInGUI(currentTargetIndex,"card-chosen-image");
        $("#round-number").text(getCurrentRoundNumber());
        changePage("remember-card-page");
    });
    
    $("#start-game-button").click(function(){
        targetFound = false;
        difficultyAdded = false;
        yesDecisionNumber = 0;
        showNextCard();
    });
    
    $("#button-no").click(function(){
        showNextCard("no",currentQuestionStartTimestamp,getCurrentTimestamp());
    });
    
    $("#button-yes").click(function(){
        showNextCard("yes",currentQuestionStartTimestamp,getCurrentTimestamp());
    });
    
    $("#restart-experiment").click(function(){
        window.location.reload();
    });
    
    $("#start-another-round-button").click(function(){
        $("#start-experiment").click();
    });
    
    $("#download-results-button").click(function(){
        var exportName = experimentData.subject.name + "_" + experimentData.subject.surname + "-"  + getCurrentTimestamp();
        downloadObjectAsJson(experimentData,exportName);
    });
    
    $("#download-last-round-button").click(function(){
        var currentRoundNumber = getCurrentRoundNumber();
        
        var exportName = experimentData.subject.name + "_" + experimentData.subject.surname + "-round" + currentRoundNumber +  "-"  + getCurrentTimestamp();
        var clonedExperimentData = JSON.parse(JSON.stringify(experimentData));
        var numberOfRounds = clonedExperimentData.rounds.length;
        
        for(var i = 0; i < numberOfRounds;i++){
            if(i !== currentRoundNumber - 1){
                clonedExperimentData.rounds.splice(0,1);
            }    
        }
        
        downloadObjectAsJson(clonedExperimentData,exportName);
    });
    
    $("#go-to-insert-data-page-button").click(function(){
        changePage("insert-data-page");
    });
    
    $(".what-was-card-chosen").click(function(){
        if(Number($(this).attr("file_index")) === Number(currentTargetIndex)){
            if(getCurrentRoundNumber() === maxRounds){
                changePage("experiment-ended-page");
                var exportName = experimentData.subject.name + "_" + experimentData.subject.surname + "-"  + getCurrentTimestamp();
                
                downloadObjectAsJson(experimentData,exportName);
            }
            else{
                changePage("do-another-round-page");
            }
        }
        else{
            youLied();
        }
    });
});

function getCurrentTimestamp(){
    return new Date().getTime();
};

function getCurrentRoundNumber(){
    return experimentData.rounds.length;
};

function getCurrentCardNumber(){
    return experimentData.rounds[getCurrentRoundNumber() - 1].answersArray.length;
};

function showNextCard(previousAnswer,questionStartTimestamp,answerTimestamp){
    changePage("wait-2-sec-page");
    
    setTimeout(function(){
        var currentRound = experimentData.rounds[getCurrentRoundNumber() - 1];
        var isTarget = false;
        
        previousCardNumber = getCurrentCardNumber();
        
        if(cardsArray[previousCardNumber] === currentTargetIndex){
            isTarget = true;
            
            if(previousAnswer === "yes"){
                youLied();
                return;
            }
            
            targetFound = true;
        }
        
        if(previousAnswer === "yes"){
            if(atLeastOneYes && cardsArray[previousCardNumber] !== yesDecisionNumber){
                youLied();
                return;
            }
            
            atLeastOneYes = true;
            
            var isYes = true;
            yesDecisionNumber = cardsArray[previousCardNumber];
            currentRound.answersArray.push(new Answer(isYes,isTarget,answerTimestamp,questionStartTimestamp));
        }
        else if(previousAnswer === "no"){
            if(cardsArray[previousCardNumber] === yesDecisionNumber){
                youLied();
                return;
            }
            
            var isYes = false;
            currentRound.answersArray.push(new Answer(isYes,isTarget,answerTimestamp,questionStartTimestamp));
        }
        
        currentCardNumber = getCurrentCardNumber();
        
        currentQuestionStartTimestamp = getCurrentTimestamp();
            
        if(currentCardNumber === 39){
            if(!atLeastOneYes){
                youLied();
                return;
            }
            
            var thirdImageIndex = 0;
            while(!thirdImageIndex){
                var tempThirdImageIndex = Math.floor((Math.random() * 39) + 1);
                if(tempThirdImageIndex !== yesDecisionNumber && tempThirdImageIndex !== currentTargetIndex){
                    thirdImageIndex = tempThirdImageIndex;
                }
            }
            
            var cardsIndicesForWhatWas = [currentTargetIndex,yesDecisionNumber,thirdImageIndex];
            cardsIndicesForWhatWas = shuffle(cardsIndicesForWhatWas);
            
            setImageInGUI(cardsIndicesForWhatWas[0],"was-card-image0");
            setImageInGUI(cardsIndicesForWhatWas[1],"was-card-image1");
            setImageInGUI(cardsIndicesForWhatWas[2],"was-card-image2");
            $("#was-card-image0").attr("file_index",cardsIndicesForWhatWas[0]);
            $("#was-card-image1").attr("file_index",cardsIndicesForWhatWas[1]);
            $("#was-card-image2").attr("file_index",cardsIndicesForWhatWas[2]);
            changePage("what-was-the-card");
        }
        else{
            setImageInGUI(cardsArray[currentCardNumber]);
            
            if(yesDecisionNumber && !difficultyAdded){
               previousCard = cardsArray[previousCardNumber];
               if(currentCardNumber < 30){
                   difficultyAdded = true;
                   //replace an element with the chosen number as yes, to make the game more difficult
                   var min = currentCardNumber + 3;
                   
                   var isYesRepetition = 0;
                   while(isYesRepetition < 3){
                        indexToBeReplaced = Math.floor((Math.random() * (39 - min)) + 1) + min;
                        if(cardsArray[indexToBeReplaced] !== yesDecisionNumber && cardsArray[indexToBeReplaced - 1] !== yesDecisionNumber){
                            cardsArray[indexToBeReplaced] = yesDecisionNumber;
                            isYesRepetition++;
                        }
                    }
               }
               else if(currentCardNumber < 35){
                    difficultyAdded = true;
                    //replace an element with the chosen number as yes, to make the game more difficult
                    var min = currentCardNumber + 3;
                    var isYesRepetition = 0;
                    while(isYesRepetition < 2){
                        indexToBeReplaced = Math.floor((Math.random() * (39 - min)) + 1) + min;
                        if(cardsArray[indexToBeReplaced] !== yesDecisionNumber && cardsArray[indexToBeReplaced - 1] !== yesDecisionNumber){
                            cardsArray[indexToBeReplaced] = yesDecisionNumber;
                            isYesRepetition++;
                        }
                    }
               }
            }
            $("#current-card-shown-image").hide();
            changePage("card-flow-page");
            $("#current-card-shown-image").show();
        }
        
        
    },confMillisForCard);
};

function youLied(){
    changePage("you-lied-page");
    setTimeout(function(){
        experimentData.rounds.pop();
        changePage("do-another-round-page");
    },4000);
};

function setImageInGUI(imageIndex,imageTagId){
    if(!imageTagId){
        imageTagId = "current-card-shown-image";
    }
    
    //not explainable BUG!
    if(!imageIndex){
        imageIndex = 28;
    }
    
    $("#" + imageTagId).attr("src","./card-images/" + (imageIndex + 1) + ".png");
}

function changePage(pageName){
    $(".page").hide();
    $("#" + pageName).show();
};

function shuffle(array,plusOne) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (1 !== currentIndex) {

    // Pick a remaining element...
   
    randomIndex = Math.floor(Math.random() * currentIndex);
    
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function downloadObjectAsJson(exportObj, exportName){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
};