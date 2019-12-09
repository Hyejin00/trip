function Onclick() {
    //물품 추가
    $("form .course_items").append($('#itemTemplate').html());
}
function del(item){
    item.closest('.item').remove();
}