function calculateFuelConsumption() {
    var averageConsumption = parseFloat(document.getElementById("average-consumption").value);
    var distance = parseFloat(document.getElementById("distance").value);
    var resultElement = document.getElementById("result");

    // Retrieve fuel price data from API
    $.ajax({
        url: 'http://apis.is/petrol',
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            var prices = response.results;
            var dieselPrices = prices.filter(price => price.company && price.diesel);
            var bensinPrices = prices.filter(price => price.company && price.bensin95);

            // Sort prices in ascending order
            dieselPrices.sort((a, b) => parseFloat(a.diesel) - parseFloat(b.diesel));
            bensinPrices.sort((a, b) => parseFloat(a.bensin95) - parseFloat(b.bensin95));

            // Get the second cheapest prices and corresponding name and company
            var secondCheapestDiesel = dieselPrices[1];
            var secondCheapestBensin = bensinPrices[1];

            // Check if the input values and fuel prices are valid
            if (isNaN(averageConsumption) || isNaN(distance) || !secondCheapestDiesel || !secondCheapestBensin) {
                resultElement.innerHTML = "<span class='error'>Vinsamlegast skrifaðu númer.</span>";
                return;
            }

            // Calculate fuel consumption
            var fuelConsumption = (averageConsumption * distance) / 100;

            // Calculate total cost of fuel
            var totalCost;
            var fuelType = document.getElementById("fuel-type").value;
            var name, company;
            if (fuelType === "diesel") {
                totalCost = fuelConsumption * parseFloat(secondCheapestDiesel.diesel);
                name = secondCheapestDiesel.name;
                company = secondCheapestDiesel.company;
            } else if (fuelType === "bensin") {
                totalCost = fuelConsumption * parseFloat(secondCheapestBensin.bensin95);
                name = secondCheapestBensin.name;
                company = secondCheapestBensin.company;
            }

            resultElement.innerHTML = "Samtals Verð (" + fuelType.charAt(0).toUpperCase() + fuelType.slice(1) + "): ISK " + totalCost.toFixed(2) + "kr<br>";
            resultElement.innerHTML += "Staður: " + name + "<br>";
            resultElement.innerHTML += "Fyrirtæki: " + company;
        }
    });
}
function calculatePriceToKM() {
    var averageConsumption1 = parseFloat(document.getElementById("average-consumption1").value);
    var overallPrice1 = parseFloat(document.getElementById("overallPrice1").value);
    var pricePerLiter1 = parseFloat(document.getElementById("price-per-liter1").value);
    var resultElement1 = document.getElementById("result1");

    // Check if the input values are valid
    if (isNaN(averageConsumption1) || isNaN(overallPrice1) || isNaN(pricePerLiter1)) {
        resultElement1.innerHTML = "<span class='error'>Vinsamlegast skrifaðu númer.</span>";
        return;
    }

    // Calculate fuel consumption
    var fuelConsumption1 = (averageConsumption1 * pricePerLiter1) / 100;
    
    var PriceToKM1 = overallPrice1 / fuelConsumption1;

    resultElement1.innerHTML = "Þú kemst: " + PriceToKM1.toFixed(2) + "km";
}

function initialize() {
    var originInput = document.getElementById('origin');
    var destinationInput = document.getElementById('destination');
    var calculateBtn = document.getElementById('calculateBtn');

    var autocompleteOptions = {
        types: ['geocode']
    };

    var originAutocomplete = new google.maps.places.Autocomplete(originInput, autocompleteOptions);
    var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, autocompleteOptions);

    calculateBtn.addEventListener('click', function () {
        calculateDistance();
    });
}

function calculateDistance() {
    var origin = document.getElementById('origin').value;
    var destination = document.getElementById('destination').value;

    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC
    }, callback);
}

function callback(response, status) {
    var resultElement = document.getElementById('result2');

    if (status == 'OK') {
        var distance = response.rows[0].elements[0].distance.text;
        var duration = response.rows[0].elements[0].duration.text;

        resultElement.innerHTML = 'Vegalengd: ' + distance + '<br>Tími: ' + duration;
    } else {
        resultElement.innerHTML = 'Error: Unable to calculate distance.';
    }
}

google.maps.event.addDomListener(window, 'load', initialize);