function linkSpinnerToFormsAndLinks(){
    if (!window.jQuery) {
        setTimeout(linkSpinnerToFormsAndLinks,50);
        return;
    }
    
    //appending the spinner div to the body
    $(document.body).prepend("<div class='loader'></div><div id='disabling_interactions_div'></div>");
    
    $("a, [data-spinner=true], [type=submit]").click(function(){
        if($(this).css("cursor") !== "not-allowed" && $(this).attr("data-spinner") !== "false"){
            if(utils.network.isOnline()){
               spinner.show();
            }
            else{
                $(".modal").modal("hide");
                $("#noConnectionModal").modal("show");
            }
        }
    });
}

spinner = {
    show:function(){
       $(".loader").show();
       $("#disabling_interactions_div").show();
    },
    
    hide:function(){
       setTimeout(function(){
           $(".loader").hide();
           $("#disabling_interactions_div").hide();
       },100);
    }
};
//after 50  milliseconds set all the links and data 
setTimeout(linkSpinnerToFormsAndLinks,50);