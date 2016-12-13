// Declare variables
 var waterPerWeek = 0;
 var date = new Date();
 var year = date.getFullYear();
 var furnaceEfficiency = 1;
 var totalFurnEff = 1;
 var furnaceAge = 0;
 var avgMonthlyPayment = 0;
 var clientEff = .95;
 
//Water savings calculation
function waterSavings(number) {
    return (number * 16 / 30).toFixed(2);
   
 }
 
//Furnace calculations
//Purchase year (range)
function rangeYearEff(yearRangeVal) {
    return yearRangeVal * furnaceEfficiency;
}
     
     
//Purchase year (exact)
function exactYearEff(yearExactVal) {
    //Get furnace age for after 2011
    if ($("#furnace-year-range").val() == .95) {
        furnaceAge = year - yearExactVal;
        return 0.01 * furnaceAge;
    
    } else if ($("#furnace-year-range").val() == .80) {
        furnaceAge = 2011 - yearExactVal;
        return 0.01 * furnaceAge;
    }
   
}
     
     
//Furnace type
function furnaceType() {
    if ($("input[type='radio'][name='furnace-type']:checked").val() === "dual-stage" && $("#furnace-year-range").val() == .80 ) {
        return 5;
    } else {
        return 0;
    }
}     
     
//Monthly payment
function monthlyPayment(lowerPayment, higherPayment) {
   var lp = Number(lowerPayment);
   var hp = Number(higherPayment);
   avgMonthlyPayment = (lp + hp) / 2;
   return avgMonthlyPayment;
}

//Total Furnace efficiency
function calculateFurnaceEff() {
    totalFurnEff = rangeYearEff($("#furnace-year-range").val()) - exactYearEff($("#furnace-year-exact").val());
    return (totalFurnEff);
}
     
//Calculate savings
function calculateSavings(efficiency) {
    var efficiencyDelta =  clientEff - efficiency;
    efficiencyDelta = Math.round(efficiencyDelta * 100)/100;
    return (efficiencyDelta * avgMonthlyPayment) + furnaceType();
}

//Ensure all items on furnace are inputted correctly
function furnaceValidator() {
    var validCount = 0;
    if ($("#furnace-year-range").val() === "placeholder") {
        $("#furn-range-ast").removeClass("element-completed");
        validCount ++;
    } else {
        $("#furn-range-ast").addClass("element-completed");
    } 
    
    if (!$("#furnace-year-exact").val()) {
        $("#furn-exact-ast").removeClass("element-completed");
        $("#invalid-year").empty();
        validCount ++;
    } else if ($("#furnace-year-exact").val() > year || $("#furnace-year-exact").val() < 1000) {
         $("#furn-exact-ast").removeClass("element-completed");
        validCount ++;
        $("#invalid-year").empty();
        $("#invalid-year").append("Please enter a valid year in the YYYY format.");
    } else {
        $("#furn-exact-ast").addClass("element-completed");
        $("#invalid-year").empty();
    } 
    
    if (!$("input[type='radio'][name='furnace-type']:checked").val()) {
        $("#furn-type-ast").removeClass("element-completed");
        validCount ++;
    } else {
        $("#furn-type-ast").addClass("element-completed");
    }
    
    if (!$("#high-payment").val()) {
        $("#high-bill-ast").removeClass("element-completed");
        validCount ++;
    } else {
        $("#high-bill-ast").addClass("element-completed");
    } 
    
    if (!$("#low-payment").val()) {
        $("#low-bill-ast").removeClass("element-completed");
        validCount ++;
    } else {
        $("#low-bill-ast").addClass("element-completed");
    } 
    
    if (validCount > 0) {
        return false;
    }
    return true;
}
    
//Run the calculator
$(document).ready(function() {
    $("#calculate-water-savings").click(function () {
        if ($("#water-per-week").val() !== "placeholder" ) {
            waterPerWeek = $("#water-per-week").val();
            $("#water-savings-result").empty();
            $("#water-savings-result").removeClass("error-message");
            $("#water-savings-result").append("You are currently spending about<br /><span class='calc-money'>$ " + waterSavings(waterPerWeek) + "</span></br>a day.");     
        } else {
            $("#water-savings-result").empty();
            $("#water-savings-result").addClass("error-message");
            $("#water-savings-result").append("Please complete required fields.");
        }
        
    });
        
    $("#calculate-furnace-savings").click(function () {
       
        if (furnaceValidator()) {
            if ((year - $("#furnace-year-exact").val()) > 2) {
                $("#furnace-savings-result").removeClass("error-message");
                $("#furnace-savings-result").empty();
                monthlyPayment($("#high-payment").val(), $("#low-payment").val());
                calculateFurnaceEff();
                $("#furnace-savings-result").append("You could SAVE up to<br /> <span class='calc-money'>$ " + calculateSavings(totalFurnEff).toFixed(2) + "</span><br /> a month by upgrading your furnace!");
            } else {
                $("#furnace-savings-result").removeClass("error-message");
                $("#furnace-savings-result").empty();
                 $("#furnace-savings-result").append("You do not need an upgrade.");
            }
         } else {
            $("#furnace-savings-result").addClass("error-message");
            $("#furnace-savings-result").empty();
            $("#furnace-savings-result").append("Please complete required fields.");
        }
            
            
            
        
    });
    
});