function Onclick() {
    //물품 추가
    $("form .course_items").append($('#itemTemplate').html());
}
function del(item){
    item.closest('.item').remove();
}
function imagebtn(item) {
  $(item).siblings('#preview').hide();
  $(item).change(function() {
    var file = $(item)[0].files[0];
    if (file) {
      var url = "/s3?filename=" + encodeURIComponent(file.name) + 
                "&type=" + encodeURIComponent(file.type);
      console.log(url);
      $.getJSON(url, function(resp) {
        console.log(resp.signedRequest);
        $.ajax({
          url: resp.signedRequest,
          method: 'PUT',
          data: file,
          headers: {'x-amz-acl': 'public-read', 'Content-Type': file.type},
          processData: false, 
          contentType: file.type,
          success: function() {
            $(item).siblings('#preview').attr("src", resp.url).show();
            $(item).siblings("#url").val(resp.url);
          }
        });
      });
    }
  });
};