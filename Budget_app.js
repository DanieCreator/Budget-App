// craeting modules
//BUDGET CONTROLLER
var BudgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    };
    var calculateTotals = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
            data.totals[type] = sum;
        })
    };
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    }
    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            //create new id
            if (data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            //create new item based on 'exp'or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push it into our data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },
        calculateBudget: function() {
            //1.calculate total income and total expenses
            calculateTotals('inc');
            calculateTotals('exp');
            //2.calculate the budget:income-expenses
            data.budget = data.totals.inc - data.totals.exp;

            //3.calculate the percentage of income that we spent
            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }


        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },
        testing: function() {
            console.log(data);
        }
    }

})();


//UI CONTROLLER
var UiController = (function() {
    var DomStrings = {
        inputType: '.add_type',
        inputDescription: '.add_description',
        inputValue: '.add_value',
        inputBtn: '.add_btn',
        incomeContainer: '.income_list',
        expensesContainer: '.expenses_list',
        budgetLabel: '.budget_value',
        incomeLabel: '.budget_income--value',
        expensesLabel: '.budget_expenses--value ',
        percentageLabel: '.budget_expenses--percentage'
    }
    return {
        getInput: function() {
            return {

                //will be either inc or exp
                type: document.querySelector(DomStrings.inputType).value,
                description: document.querySelector(DomStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DomStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            //create html strings with placeholder text
            if (type === 'inc') {
                element = DomStrings.incomeContainer;
                html = '<div class="item clearfix" id="inc--%id%"><div class="item_description">%description%</div><div class="right clearfix" ><div class="item_value">%value%</div><div class="item_delete"><button class="item_delete--btn"><i class="fa fa-delete"></i></button></div></div ></div >';
            } else if (type === 'exp') {
                element = DomStrings.expensesContainer;

                html = '<div class="item clearfix" id="exp--%id%"><div class="item_description">%description%</div><div class="right clearfix"><div class="item_value">%value%</div><div class="item_percentage">%percentage%</div><div class="item_delete"><button class="item_delete--btn"><i class="fa fa-delete"></i></button></div></div></div>';
            }
            //replace the placeholder text with actual data
            newHtml = html.replace('% id %', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            //insert the html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);


        },
        displayBudget: function(obj) {

            document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DomStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DomStrings.expensesLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {

                document.querySelector(DomStrings.percentageLabel).textContent = obj.percentage + '';
            } else {
                document.querySelector(DomStrings.percentageLabel).textContent = '___';
            }
        },
        clearfields: function() {
            var fields, filedsArr;
            fields = document.querySelectorAll(DomStrings.inputDescription + ',' + DomStrings.inputValue);

            filedsArr = Array.prototype.slice.call(fields);
            fields.forEach(function(current, index, array) {
                current.value = '';

                filedsArr[0].focus();
            });
        },
        getDomstrings: function() {
            return DomStrings;
        }
    }

})();

//GLOBAL APP CONTROLLER
var Controlller = (function(budgetCtrl, UiCtrl) {
    var setEventListeners = function() {

        var Dom = UiCtrl.getDomstrings();
        document.querySelector(Dom.inputBtn).addEventListener('click', CtrlAddItem);
        document.addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.which === 13) {
                CtrlAddItem();
            }
        });
    }
    var updateBudget = function() {
        //1.calculate budget
        budgetCtrl.calculateBudget();
        //2.return budget
        var budget = budgetCtrl.getBudget();
        //3.display budget on ui
        UiCtrl.displayBudget(budget);
    };
    var CtrlAddItem = function() {
        var input, newItem;
        //1.Get field input value
        input = UiCtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            //2.add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3.Add the item to the UI
            UiCtrl.addListItem(newItem, input.type);
            //4.clear fields
            UiCtrl.clearfields();

            //5.calculate and update budget
            updateBudget();
        }
    }
    return {
        init: function() {
            console.log('Aplication Up and running');
            UiCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setEventListeners();
        }
    }
})(BudgetController, UiController);
Controlller.init();