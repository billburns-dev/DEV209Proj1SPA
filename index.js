/*  Abbreviations Used:
    BMR   Basal Metabolic Rate                    PAL   Physical Activity Level
    TDEE  Total Daily Energy Expenditure          TDCI  Total Daily Caloric Intake
    DEBD  Daily Energy Balance Delta
*/

let energyBalanceArray = [];  // array of objects
let selectedGender = "not selected";
let selectedPal = "not selected";

// define energy balance object constructor
let EnergyBalanceObject = function (pentryDate, pgender, page, pheight, pweight, pbmr, ppal, ptdee, pproteinCalories, pcarboCalories, pfatCalories, ptdci, pdebd) {
    this.entryDate = pentryDate;
    this.gender = pgender;
    this.age = page; 
    this.height = pheight;
    this.weight = pweight;
    this.bmr = pbmr;
    this.pal = ppal;
    this.tdee = ptdee;
    this.proteinCalories = pproteinCalories;
    this.carboCalories = pcarboCalories;
    this.fatCalories = pfatCalories;
    this.tdci = ptdci;
    this.debd = pdebd;
    this.ID = Math.floor(Math.random()*500) + 1;
}

/*  // push EnergyBalanceObjects into the array; *** TEMP DEBUG ***      !!!!! REMOVE BEFORE FINAL RELEASE !!!!!  
    //                                                             ^age         ^bmr             ^proteinCalories  ^tdci
    //                                                     ^gender |       ^weight         ^tdee |           ^fatCalories
    //                                          ^entryDate |       |   ^height  |     ^pal |     |     ^carboCalories    ^debd
    //                                          |          |       |   |   |    |     |    |     |     |     |     |     |

energyBalanceArray.push(new EnergyBalanceObject(03/20/24, "woman", 60, 60, 130, 1231, 2.5, 3076, 1000, 1000, 1000, 3000, -76.0));
energyBalanceArray.push(new EnergyBalanceObject(03/22/24, "woman", 60, 60, 130, 1231, 2.2, 2707, 800, 1000, 900, 2700, -7.0));
energyBalanceArray.push(new EnergyBalanceObject(03/24/24, "woman", 60, 60, 130, 1231, 2.0, 2461, 700, 1000, 800, 2500, 39.0));
energyBalanceArray.push(new EnergyBalanceObject(03/26/24, "man", 65, 67, 185, 1633, 2.0, 3266, 1200, 1100, 900, 3200, -66.0));
energyBalanceArray.push(new EnergyBalanceObject(03/28/24, "man", 65, 67, 185, 1633, 2.2, 3593, 1350, 1450, 800, 3600, 7.0));
energyBalanceArray.push(new EnergyBalanceObject(03/31/24, "man", 65, 67, 185, 1633, 2.5, 4083, 1300, 1600, 1000, 3900, -183.0));
*/

// wait for "DOMContentLoaded" event ************************************************************** START
document.addEventListener("DOMContentLoaded", function () {

  // on "save-entry" click, store app data (user input & calculated) ******************** START
  document.getElementById("save-entry").addEventListener("click", function () {

    // selected entry date (col 1|row 1) converted to mm/dd/yyyy format
    let convertedEntryDate = convertDatemmddyyyy(new Date(document.getElementById("selected-entry-date").value));
    
    // selected PAL (col 2|row 1)
    selectedPal = document.getElementById("selected-pal").value;

    // calories consumed on entry date; categorized and entered by user; protein (col 1|row 2), carbohydrates (col 2|row 2), fat (col 3|row 2)
    let enteredProteinCalories = document.getElementById("entered-protein-calories").value;
    let enteredCarboCalories = document.getElementById("entered-carbo-calories").value;
    let enteredFatCalories = document.getElementById("entered-fat-calories").value;
    
    // selected gender (col 1|row 3)
    selectedGender = document.getElementById("selected-gender").value;
    
    // entered age (col 1|row 4), height (col 2|row 4), & weight (col 3|row 4)
    let enteredAge = document.getElementById("entered-age").value;
    let enteredHeight = document.getElementById("entered-height").value;
    let enteredWeight = document.getElementById("entered-weight").value;

    // calculated "energy balance" components (BMR,TDEE, TDCI, DEBD) ********** START
    
    // calculate BMR
    let calculatedBmr = calculateBmr(selectedGender, enteredAge, enteredHeight, enteredWeight);
    
    // calculate TDEE as BMR x PAL
    let calculatedTdee = calculateTdee(calculatedBmr, selectedPal);
    
    // calculate TDCI as protein calories + carbohydrate calories + fat calories
    let calculatedTdci = calculateTdci(enteredProteinCalories, enteredCarboCalories, enteredFatCalories);
    
    // calculate DEBD as TDCI - TDEE
    let calculatedDebd = calculateDebd(calculatedTdci, calculatedTdee);
    
    // calculated "energy balance" components (BMR,TDEE, TDCI, DEBD) ********** END

    // push data from user into object **************************************** START 
    energyBalanceArray.push(new EnergyBalanceObject(
      convertedEntryDate,                                   // converted
      selectedGender,                                       // selected
      enteredAge,                                           // entered
      enteredHeight,                                        // entered
      enteredWeight,                                        // entered
      calculatedBmr,                                        // calculated
      selectedPal,                                          // selected
      calculatedTdee,                                       // calculated
      enteredProteinCalories,                               // entered
      enteredCarboCalories,                                 // entered
      enteredFatCalories,                                   // entered
      calculatedTdci,                                       // calculated
      calculatedDebd                                        // calculated    
    ));
    // push data from user into object **************************************** END

    alert(`Your entry has been saved in your log.
To view your entry, click \"Display Log\".
To add another entry, update your information and click \"Save Log Entry\".`);

console.log("eBA: inside 'save-entry' click; after alert()", energyBalanceArray);

  });
  // on "save-entry" click, store app data (user input & calculated) ******************** END

console.log("eBA: outside 'save-entry' click", energyBalanceArray);

  /* displayLogContent() is called once the "Display Log" page is loaded **************** START
  document.getElementById("display-log-content").addEventListener("pageshow", function() {
    displayLogContent();
  });
  // displayLogContent() is called once the "Display Log" page is loaded **************** END
*/
    displayLogContent();

});  
// wait for "DOMContentLoaded" event ************************************************************** END

// function displayLogContent ********************************************************************* START
function displayLogContent() {
  
  let logGrid = document.getElementById("log-grid");
  
  // Clear previous grid
  logGrid.innerHTML = '';

  // create column header row (grid row 1 | col 1-4)
  let headerRow = document.createElement('div');
  headerRow.className = 'ui-grid-c';
  headerRow.innerHTML = '<div class="ui-block-a"><b>Entry Date</b></div>' +
  '<div class="ui-block-b"><b>TDEE</b></div>' +
  '<div class="ui-block-c"><b>TDCI</b></div>' +
  '<div class="ui-block-d"><b>DEBD</b></div>';
  
  // append newly created header row to element with id="log-grid"
  logGrid.appendChild(headerRow);

  // Iterate through energyBalanceArray; create new row & append ************************ START
  energyBalanceArray.forEach(function(ebaObject) {
    let dataRow = document.createElement('div');
    
console.log("dataRow at line 147: ", dataRow);

    dataRow.className = 'ui-grid-c';
  
    // Create a link with entryDate as parameter
    let link = document.createElement('a');
    link.href = '#display-entry';
    link.className = 'entry-date';
    link.setAttribute('data-entrydate', ebaObject.entryDate);
    link.textContent = ebaObject.entryDate;

    // trap "entryDate" click on Display Log page ***************************** START
    link.addEventListener('click', function(event) {
      localStorage.setItem("entryDate", ebaObject.entryDate);
      displayEntryDetails(ebaobj.entryDate); // redirect to the "Display Specified Log Entry" page 
    });
    // trap "entryDate" click on Display Log page ***************************** END

    // create column cell for entryDate; object value & link to #display-entry
    let cellA = document.createElement('div');
    cellA.className = 'ui-block-a';
    cellA.appendChild(Link);
    
    // create column cell for tdee; object value
    var cellB = document.createElement('div');
    cellB.className = 'ui-block-b';
    cellB.textContent = ebaObject.tdee;
    
    // create column cell for tdic; object value
    var cellC = document.createElement('div');
    cellC.className = 'ui-block-c';
    cellC.textContent = ebaObject.tdic;

    // create column cell for debd; object value
    var cellC = document.createElement('div');
    cellC.className = 'ui-block-d';
    cellC.textContent = ebaObject.debd;

    // put cells together to form row
    dataRow.appendChild(cellA);
    dataRow.appendChild(cellB);
    dataRow.appendChild(cellC);
    dataRow.appendChild(cellC);
    
    // append data row
    logGrid.appendChild(dataRow);
  });
  // Iterate through energyBalanceArray; create new row & append ************************ END
}
// function displayLogContent ********************************************************************* END

// displayEntryDetails: redirect to "Display Specified Log Entry" page **************************** START
function displayEntryDetails() {
  // Redirect to Display Detailed Data Page
  location.hash = "display-entry";
}
// displayEntryDetails: redirect to "Display Specified Log Entry" page **************************** END

// function convertDatemmddyyyy ******************************************************************* START
// convert date format; from native system date format to mm/dd/yyyy format
function convertDatemmddyyyy(dateObjToConvert) {
  yyyy = dateObjToConvert.getFullYear();
  let mm = dateObjToConvert.getMonth() + 1;
  let dd = dateObjToConvert.getDate() + 1;
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  return (mm + '/' + dd + '/' + yyyy);
}
// function convertDatemmddyyyy ******************************************************************* END

// function calculateBmr ************************************************************************** START
/* BMR equations
   for woman:  665.00 + (4.35 × weight) + (4.7 × height) - (4.70 × age)			
   for man:    66.47 + (6.24 × weight) + (12.7 × height) - (6.75 × age)
*/
function calculateBmr(gender, age, height, weight) {
  let bmr = 0;
  if (gender === "woman") {
    bmr = 665.00 + (4.35 * weight) + (4.70 * height) - (4.70 * age);
  } else if (gender === "man") {
    bmr = 66.47 + (6.24 * weight) + (12.70 * height) - (6.75 * age);
  } else {
    bmr = "unable to calculate";
  }
  return bmr;
}
// function calculateBmr ************************************************************************** END

// function calculateTdci ************************************************************************* START
// calculate TDCI as protein calories + carbohydrate calories + fat calories
function calculateTdci(proteinCalories, carboCalories, fatCalories) {
  let tdci = parseInt(proteinCalories) + parseInt(carboCalories) + parseInt(fatCalories);
  return tdci;
}
// function calculateTdci ************************************************************************* END

// function calculateTdee ************************************************************************* START
// calculate TDEE as BMR x PAL
function calculateTdee(bmr, pal) {
  let tdee = bmr * pal;
  return tdee;
}
// function calculateTdee ************************************************************************* END

// function calculateDebd ************************************************************************* START
// calculate DEBD as TDCI - TDEE
function calculateDebd(tdci, tdee) {
  let debd = tdci - tdee;
  return debd;
}
// function calculateDebd ************************************************************************* END