var budgetController=(function()
{
    expenses=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    },
    expenses.prototype.calculatPercent=function(totoalIncome)
    {
        if(totoalIncome>0)
        {
            this.percentage=Math.round((this.value/totoalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
    },
    expenses.prototype.getPercentage=function()
    {
        return(this.percentage);
    }
    ,
    incomes=function(id,description,value)
    {
        this.id=id;
        this.description=description;
        this.value=value;
    };
    var calTotal=function(type)
    {
        var sum=0;
      data.allItems[type].forEach(function(cur){
        sum=sum+cur.value;  
        data.total[type]=sum;  
      }); 
     // data.allItems[type]=sum;  
    }
    var data={
        total:
        {
            exp:0,
            inc:0
        },
        allItems:
        {
            exp:[],
            inc:[]
        },
        budget:0,
        percentage:0
    }
    return{
        addItem:function(type,des,value)
        {
        var newItem,id;
        if(data.allItems[type].length>0){
            id=data.allItems[type][data.allItems[type].length-1].id+1;
           // console.log("id is",data.allItems[type].length);
           
        }
        else
            id=0;
        if(type==='exp')
            newItem=new expenses(id,des,value);
        else if(type==='inc')
            newItem=new incomes(id,des,value);    
        //insert item into data structure
        data.allItems[type].push(newItem);
        //return newItem 
            return newItem;
        },
        calculateBudget:function(type)
        {
            //calcualte total income and expenses
                calTotal('exp');
                calTotal('inc');

            //calculate budget
                data.budget=data.total.inc-data.total.exp;

            //calculate percentage that we spent
            if(data.total.inc>0)
            {
                data.percentage=Math.round((data.total.exp/data.total.inc)*100);
            }
            },
            calculatPercentage:function(){
                //calling calculatPercent function
                    data.allItems.exp.forEach(function(cur)
                    {
                        cur.calculatPercent(data.total.inc);
                    });
            },
            getPercent:function()
            {
                //display the pecentage
                    var percent=data.allItems.exp.map(function(cur)
                    {
                        return(cur.getPercentage());
                    });
                    return percent;
            }
            ,
        budgetReturn:function()
        {
            return{
            expense:data.total.exp,
            income:data.total.inc,
            percentage:data.percentage,
            budget:data.budget
            }
        },
        deleteItem :function(type,id)
        {

            if(type ==='expense')
            {
            var ids,index;
            ids=data.allItems.exp.map(function(cur)
           {
                return(cur.id);
           });
            index=ids.indexOf(id);
            if(index > -1)
            {
                data.allItems.exp.splice(index,1);
            }
        }
        else if(type==='income')
        {
        var ids,index;
       ids=data.allItems.inc.map(function(cur)
       {
            return(cur.id);
       });
        index=ids.indexOf(id);
        if(index > -1)
        {
            data.allItems.inc.splice(index,1);
        }
    }
        }
    }

})();
var UIcontroller=(function(){
    var DOMstrings={
        getType:'add-type',
        getDescription:'add-description',
        getValue:'add_value',
        getBtn:'add_btn1',
        incomeContainer:'.income_list',
        expensesContainer:'.expensees_list',
        container:'container_clearfix',
        displayPercentageclass:'.item_percentage'
    }
    var formatNumber=function(num,type)
    {
//console.log("this is number",num)
        let int,dec,numsplit,numString;
        num=Math.abs(num);
//fixed the decimal point upto 2 precision
        num=num.toFixed(2);
        //console.log("num is",num)
//split the number        
        numsplit=num.split('.');
        int=numsplit[0];
        dec=numsplit[1];
//console.log("this is number",int)
        if(int.length>3)
        {   
            numString=int.substr(0,int.length-3)+","+int.substr(int.length-3,int.length)+"."+dec;
            return((type==='exp'?'-':'+')+numString);
        }
        return ((type==='exp'?'-':'+')+int+"."+dec);

    }
    var fields=function(list,callback)
    {
        for(var i=0;i<list.length;i++)
        {
            callback(list[i],i);
        }
    }
    return{
        getInput:function(){
            return{
            type: document.querySelector(".add_type").value, 
            description: document.querySelector(".add_description").value,
            value:parseFloat(document.querySelector(".add_value").value)

            }
        },
        returnPointer:function()
        {
            var pointer;
            nodeList=document.querySelectorAll(".add_description"+","+".add_value");
            arrayList=Array.prototype.slice.call(nodeList);
         //   console.log(arrayList[0]);
            arrayList[0].value="";
            arrayList[1].value="";
            pointer=document.querySelector(".add_type");
            pointer.focus();
        }
        ,
        changeType:function() 
        {
            var fields1;
            fields1=document.querySelectorAll(
                DOMstrings.getType + "," +
                DOMstrings.getValue + "," + 
                DOMstrings.getDescription
                );
                fields(fields1,function(cur)
            {
                cur.classList.toggle('red-focus');
            })
        },
        printCalender:function()
        {
            var year,month,date;
            const monthArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            date=new Date();
            month=date.getMonth();
            year=date.getFullYear();
          document.querySelector(".budget_title_month").textContent=monthArray[month]+' '+year; 
        },
        getItem:function(obj,type)
        {

            var html,newHtml;
            if(type ==='inc')
            {
                element='.income_list'; //DOMstrings.incomeContainer;
                html=`<div class="item_clearfix" id="income_%id%">
                <div class="item_description">%description%</div>
                <div class="right_clearfix"><div class="item_value">%value%</div>
                <div class="item_delete"><span class="close">x</span></div></div></div>`
                
            }
            else if(type ==='exp')
            {
                element= '.expensees_list'; //DOMstrings.expensesContainer;
                html=`<div class="item_clearfix" id="expense_%id%">
                <div class="item_description">%description%</div>
                <div class="right_clearfix">
                <div class="item_value">%value%</div>
                <div class="item_percentage">21%</div>
                <div class="item_delete">
                <span class="close">x</span>
                </div></div></div>`
            }


            //replace string with placeholders
            newHtml=html.replace('%description%',obj.description);
            newHtml=newHtml.replace('%value%',formatNumber(obj.value,type));
            newHtml=newHtml.replace("%id%",obj.id);
          //  console.log("object.value is",obj.value)
            //adding element on web page

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);

        },
        displayBudget:function(obj)
        {
            obj.budget>0?type="inc":type="exp";
            document.querySelector('.budget_value').textContent=formatNumber(obj.budget,type);
            document.querySelector('.budget_income_value').textContent=formatNumber(obj.income,'inc');
            document.querySelector('.budget_expenses_value').textContent=formatNumber(obj.expense,'exp');
            if(obj.percentage<1)
            {
                document.querySelector('.budget_expenses_percentage').textContent="--";
            }
            else
            {
            document.querySelector('.budget_expenses_percentage').textContent=obj.percentage;
            }
        },
        displayPercentage : function(percent)
        {
            var nodeList=document.querySelectorAll(DOMstrings.displayPercentageclass);
  
            fields(nodeList,function(current,index)
            {
                if(percent[index]>0)
                {
                current.textContent=percent[index]+"%";
                }
                else{
                    current.textContent="---";
                }
            });
        }
        ,
        getDomstrings:function()
        {
            return DOMstrings.getBtn;   
        },
        deleteItems:function(selectId)
        {
            var elem=document.getElementById(selectId);
            elem.parentNode.removeChild(elem);
          //  console.log(elem)

        }     
    };
})();
var controller=(function(uictrl,budgctrl){
    var budgetItem;

          var updateBudget=function(type)
        {
          //calculate the budget
              budgctrl.calculateBudget(type);
          //return the value of budget
              var budget=budgctrl.budgetReturn();
          //printing the budget on ui
           //   console.log(budget);
              uictrl.displayBudget(budget);
        }; 
        updatePercentage=function()
        {
            //calculate percentage
            budgctrl.calculatPercentage();

            //read percentage from budgtecontrller
           var percent= budgctrl.getPercent();

            //updatePercentage
         //   console.log(percent);
            uictrl.displayPercentage(percent);


        } 
    var addItem=function()
    {
        
        //get the input
            input=uictrl.getInput();

        if(input.description!="" && !isNaN(input.value))
        {
           console.log(input);
            //add item to budget controller
                budgetItem =budgctrl.addItem(input.type, input.description, input.value);
           // console.log(budgetItem);
                uictrl.getItem(budgetItem,input.type);
           //return the budget
                updateBudget(input.type);
           //update percentage
            updatePercentage();
            uictrl.returnPointer();
        }
  
    };
    var ctrlDeleteItem =function(event)
    {
        var itemId,splitId,type,id;
        itemId = event.target.parentNode.parentNode.parentNode.id;
        if(itemId)
        {
            console.log("item id is",itemId);
        splitId=itemId.split("_");
        type = splitId[0];
        id=parseInt(splitId[1]);
        //delete item from data structure
          //console.log("type is",type,"id is",id)
            budgctrl.deleteItem(type,id);

        //delete item from ui
        
            uictrl.deleteItems(itemId)

        //update and show ui
            updateBudget('exp');
            updateBudget('inc');

        //updatepercentage
        updatePercentage();
        }
    }
    var setupEventHandler=function()
    {
        var Dom=uictrl.getDomstrings();
        btn1=document.getElementById('add_btn1').addEventListener('click',addItem);
       
        document.addEventListener('keypress',function(event){
            if(event.which===13||event.keyCode===13)
            {
                addItem();
            }
      });
        document.querySelector('.container_clearfix').addEventListener('click',ctrlDeleteItem);
        document.querySelector('.add_type').addEventListener('click',uictrl.changeType);
    }
        uictrl.printCalender();
        setupEventHandler();
       
})(UIcontroller,budgetController);