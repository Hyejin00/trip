function Onchange(){
  var contry = $('#country').val() || "";

  console.log(contry);
  console.log('-------interact');

  $.ajax({
      url:'/guides/city_option',
      data: {c:contry},
      success: function(data){
        var cities = data.map(function(name){
          return `<option value=${name}>`+ name + '</option>'
        });
        $('#city').empty();
        $('#city').append(cities);
      }
  });
}