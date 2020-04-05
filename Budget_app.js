// craeting modules
//BUDGET CONTROLLER
var BudgetController = (function() {

})();
//UI CONTROLLER
var UiController = (function() {

})();

//GLOBAL APP CONTROLLER
var Controlller = (function() {
    document.querySelector('.add_value').addEventListener('clicked', function() {
        console.log('clicked');


    })
})(BudgetController, UiController);