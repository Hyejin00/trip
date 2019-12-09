function mutiply(){
    var perPrice = parseInt($("#price").text(), 10);
    var numPeople = parseInt($(".custom-select").val(), 10);
    console.log(perPrice,numPeople);
    
    if (!isNaN(numPeople)) {
      var price = numPeople * perPrice;
      $('#total_price').text(price);
    }
}