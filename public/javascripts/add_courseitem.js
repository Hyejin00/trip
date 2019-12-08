function Onclick() {
    //물품 추가
    $("form .course_items").append($('#itemTemplate').html());
    //물품 삭제
    // $('.close').click(function() {
    //   if (confirm("정말 삭제하시겠습니까?")) {
    //     var $els = $("tr input[type='checkbox']:checked");
    //     $els.each(function(idx, el) {
    //       $(el).parents("tr").empty();
    //     });
    //     recalculate();
    //   }
    // });
    // 한칸
}
function del(item){
    item.closest('.item').remove();
}