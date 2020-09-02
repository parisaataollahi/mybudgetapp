var budgetController = (function(){
 var Expense = function(id , description , value){
    this.id = id;
    this.description = description;
    this.value = value;
 };
var Income = function(id , description , value ){
    this.id = id;
    this.description = description;
    this.value = value;
};

var calculateTotal = function(type){
var sum = 0 ;
data.allItems[type].forEach(function(cur){
    sum += cur.value;
});
data.totals[type]= sum;
};

var data = {
    allItems : {
        exp : [],
        inc : []
    },
    totals : {
        exp : 0,
        inc :0
    },
    budget :0,
    percentage : -1
}
return{
    addItem : function(type, des , val){

        var newItem , ID ;
        //create new ID

        if (data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length -1].id + 1;
        }else {
            ID = 0 ;
        }
        
         
        if (type === 'exp'){
            newItem = new Expense(ID , des , val);
        }else if (type === 'inc'){
            newItem = new Income(ID , des , val);
        }

        data.allItems[type].push(newItem);
        return newItem;
    },

    deleteItem : function (type , id){
        var ids , index ;

        ids = data.allItems[type].map(function(current){
            return current.id;
        });

        index = ids.indexOf(id);

        if(index !== -1){
            data.allItems[type].splice(index , 1);
        }


    },

     calculateBudget : function(){
        calculateTotal('inc');
        calculateTotal('exp');

        data.budget = data.totals.inc - data.totals.exp;
        if (data.totals.inc > 0 ){
            data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
        }else {
            data.percentage = -1;
        }
        
     },
     getBudget : function(){
        return {
            buget : data.budget,
            totalInc : data.totals.inc,
            tatalExp : data.totals.exp,
            percentage : data.percentage
        }
     },
      
    testing : function(){
        console.log(data);
    }


};



})();

var UIController = (function(){
    var DOMString = {
        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container'
    };
    return{
        getInput : function(){
            return{
                type : document.querySelector(DOMString.inputType).value,
                description : document.querySelector(DOMString.inputDescription).value,
                value : parseFloat(document.querySelector(DOMString.inputValue).value)
            };
        },

        addListItem : function(obj , type){
            var html , newHtml , element;
             if(type==='inc'){
                 element = DOMString.incomeContainer;
                 html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

             }else if (type === 'exp'){
                element = DOMString.expenseContainer;
                html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
             }

             newHtml = html.replace('%id%', obj.id);
             newHtml = newHtml.replace('%description%', obj.description);
             newHtml = newHtml.replace('%value%', obj.value);

             document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        deletListItem : function(selectorID){
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },
        clearFields : function(){
            var fields , fieldsArr ;

            fields = document.querySelectorAll(DOMString.inputDescription + ',' + DOMString.inputValue);
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach( function(cur , index , array) {
                cur.value = "";
                
            });
            fieldsArr[0].focus();
        },
        displayBudget : function(obj){
            document.querySelector(DOMString.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMString.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMString.expenseLabel).textContent = obj.tatalExp;
            if (obj.percentage > 0){
                document.querySelector(DOMString.percentageLabel).textContent = obj.percentage;
            }else {
                document.querySelector(DOMString.percentageLabel).textContent = '---';
            }
            
        },
        getDOMstring : function(){ 
            return DOMString;
        }

    };
})();

var controller = (function(budgetCtrl,UICtrl){


    var setupEventListener = function(){
        var DOM = UICtrl.getDOMstring();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    document.addEventListener('keypress',function(event){
        if (event.keyCode === 13 || event.which ===13 ){
            ctrlAddItem();
        }
    });

    document.querySelector(DOM.container).addEventListener('click',ctrlDeletItem);

    };
    var updateBudget = function(){
        //calculate the budget
        budgetCtrl.calculateBudget();
        //return the budget
        var budget = budgetCtrl.getBudget();
        //display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function(){

        var input , newItem;
      //get the field input data
       input = UICtrl.getInput();
      if (input.description !== "" && !isNaN(input.value) && input.value>0 ){
         //add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type , input.description , input.value);
      //add the item to the UI
      UICtrl.addListItem(newItem,input.type);
      //clear the fields
      UICtrl.clearFields();

      updateBudget();
      }

    };

    var ctrlDeletItem = function(event){
        var itemID ,splitID , type , ID ;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
        }
        //delete utem from data structure
        budgetCtrl.deleteItem(type,ID);

        //delete item from the UI
        UICtrl.deletListItem(itemID);

        //update and show the budget
        updateBudget();

    };
     return {
         init : function(){
            console.log('application has started.');
            
            UICtrl.displayBudget({
                budget :0 ,
                totalInc : 0,
                totalExp : 0,
                percentage : -1 

               
            });
            setupEventListener();
         }
     };

    
})(budgetController,UIController);

controller.init();