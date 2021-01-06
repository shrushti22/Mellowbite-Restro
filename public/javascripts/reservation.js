var p = $( "p.slogan" ).last();
var offset = p.offset();
var topvalue = offset.top;

$(window).scroll(function(){
    $("nav, a.navbar-brand, a.nav-link, button.navbar-toggler, li.nav-item").toggleClass('scrolled',$(this).scrollTop() > topvalue);  
})


function validate()
	{
        var flag = 0;
		var name=document.reserve.name.value;
        var alphabet =/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/;
        // /^[A-Za-z]+$/;
		if(!name.match(alphabet))
		{
			$("#name")[0].style.display = "block";
            $("#inputName").addClass("is-invalid");
            flag = 1;
        }
        

        var phone= document.reserve.number.value;
        if(phone.length != 10){
            $("#phone")[0].style.display = "block";
            $("#inputNumber").addClass("is-invalid");
            flag=1;
        }

        var d = document.reserve.date.value;
        var t = document.reserve.time.value;
        var currentdate= new Date(); 
        d = d.split('-');
        t = t.split(':');
        var givendate = new Date(Number(d[0]) ,Number(d[1])-1 ,Number(d[2]) ,Number(t[0]) ,Number(t[1]) ,00);
        console.log(d);
        console.log(t);
        console.log(givendate);
        console.log(currentdate);
        if(currentdate>givendate){
            $("#date")[0].style.display = "block";
            $("#dineInDate").addClass("is-invalid");
            $("#time")[0].style.display = "block";
            $("#inputTime").addClass("is-invalid");
            flag=1;
        }

        if(flag==1){
            return false;
        }
        return true;
	}