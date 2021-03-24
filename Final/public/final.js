// const square=document.getElementById("square");
// for (var i=0; i<100; i++){
//     const button = document.createElement("button");
//     button.innerText = i;
//     button.addEventListener("click", function(){
//         console.log(i)
//     })
//     square.appendChild(button);
// }

$(document).ready(function() {
    // alert("Ready for new page??");

    $("#background").click(function(){
        $(this).hide();
    	$("#square").show();
        $("#square").draggable();
    });

})