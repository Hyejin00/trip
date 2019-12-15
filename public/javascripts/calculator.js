function mutiply(){
    var perPrice = parseInt($("#price").text(), 10);
    var numPeople = parseInt($(".custom-select").val(), 10);
    console.log(perPrice,numPeople);
    
    if (!isNaN(numPeople)) {
      var price = numPeople * perPrice;
      price = '총' + price + '원';
      $('#total_price').text(price);
    }
}