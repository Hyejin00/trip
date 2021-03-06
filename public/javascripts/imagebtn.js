function imagebtn(item) {
  item.change(function() {
    var file = item[0].files[0];
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
            $("#preview").attr("src", resp.url).show();
            $("#url").val(resp.url);
          }
        });
      });
    }
  });
};