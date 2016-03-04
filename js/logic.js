$(document).ready(function () {
    //Navigation button
    var challenge = 1;
    function chalFade() {
        $(".div_chall_" + challenge).fadeIn(200)
    }
    $('.navigation-right').on('click', function () {
        $('.div_chall_' + challenge).fadeOut(200);
        challenge += 1;
        setTimeout(chalFade, 200)
        switch (challenge) {
            case 2: $('.navigation-left').fadeIn(200);
                break;
            case 3: $('.navigation-right').fadeOut(200);
                break;
            default: break;
        }
    })
    $('.navigation-left').on('click', function () {
        $('.div_chall_' + challenge).fadeOut(200);
        challenge -= 1;
        setTimeout(chalFade, 200)
        switch (challenge) {
            case 2: $('.navigation-right').fadeIn(200);
                break;
            case 1: $('.navigation-left').fadeOut(200);
                break;
            default: break;
        }
    })
    //Challenge #1 
    $('.button_submit').on('click', function (click) {
        //Check input
        if ($('#text').val() == "") {
            addError("You send an empty field");
        }
            //If not empty send AJAX request
        else {
            $.post('http://careers.intspirit.com/endpoint/post_response', { request: $('#text').val() }, function (body, statusText, obj) {
                if (obj.status == 204) {
                    addError(statusText)
                }
                if (obj.status == 200) {
                    removeError(body)
                }

            }); 
        }
    });

    function addError(text) {
        //there is errorDiv?
        var block = $('.div_chall_1').children().hasClass('errorDiv');
        //If yes add a div
        if (!block) {
            $('.div_chall_1').append("<div class='errorDiv'></div>");
        }
        //Change text on button
        $('.button_submit').text("Resubmit");
        
        if ($('.errorDiv').children().length < 5) {
            //If the error is less than 5, add in a div
            $('.errorDiv').prepend("<div class='errorChild col-md-2 col-md-offset-5'>" + text + "</div>");
        }
            //If the error is more than 5, to replace the oldest
        else {
            $('.errorDiv').children().first().html(text);
        }
    }

    function removeError(data) {
        //There is successDiv?
        var block = $('.div_chall_1').children().hasClass('successDiv');
        //If yes add a div
        if (!block) {
            $('.div_chall_1').append("<div class='successDiv'></div>");
        }
        //Change text button on "Submit"
        $('#text').val("");
        $('.button_submit').text("Submit");
        $('.errorDiv').remove();
        $('.successDiv').append("<div class='successMessage'>"+data+"</div>");
        var DIV = $('.successMessage').last();
        //Run notify
        DIV.slideDown(500);       
        DIV.fadeOut(2000);      
    }

    //Challenge #2
    var success = 0;
    var failure = 0;
    var errors = 0;
    var mean = 0;
    var data = [];
    var line = Morris.Line({
        // ID of the element in which to draw the chart.
        element: 'graf',
        // Chart data records -- each entry in this array corresponds to a point on
        // the chart.
        data: [],
        // The name of the data record attribute that contains x-values.
        xkey: 'Iteration',
        // A list of names of data record attributes that contain y-values.
        ykeys: ['Count'],
        // Labels for the ykeys -- will be displayed when you hover over the
        // chart.
        labels: ['Moving average: '],
        //For display of number
        parseTime: false,
        hideHover: "Auto"
    });
    //Function for draw diagram 
    function morrisCalc(iter,count){
        if (data.length < 3) {
            var morris = { Iteration: iter, Count :count};
            data.push(morris);
        }
        else {
            data.shift();
            var morris = { Iteration: iter, Count :count};
            data.push(morris);
        }
        
        line.setData(data)
    }
        $('.PressMe').on('click', function () {
            $.get("http://careers.intspirit.com/endpoint/response_codes", function (body, statusText, obj) {
                if (body.result) {
                    $('.press').addClass('Green').removeClass('Red');
                    errors = 0;
                    success += 1;
                    $('.count_true').text("Result success: "+ success)
                    $('.count_last_success').text("Number of errors since the last success: " + errors)
                    morrisCalc(success + failure, mean / (success + failure));
                }
                else {
                    $('.press').addClass('Red').removeClass('Green');
                    mean += 1;
                    errors += 1;
                    failure += 1;
                    $('.count_false').text("Result failure: "+ failure)
                    $('.count_last_success').text("Number of errors since the last success: " + errors)
                    morrisCalc(success + failure, mean / (success + failure));
                }
              
            })
        })

    //Challenge #3
        var fruitArray = [];
        var vegetableArray = [];
        var fruit = {};
        var vegetable = {};
        //FUnction for fill datas
        function addItem(array, obj, item, type) {
            if (array.length > 0) {
                if(array.indexOf(item) < 0){                  
                    array.push(item);
                    obj[item] = 1;                                        
                }
                else {
                    obj[item] += 1;
                }
            }
            else {
                array.push(item);
                obj[item] = 1;
            }
            addLi(type,item,obj[item])
        };
        function addLi(type, name, count) {
            var hasClass = $('.div_chall_3').children().last().children().hasClass(type)
            if (!hasClass) { 
                $('.div_chall_3').children().last().append("<ul class='" + type + "'> • " + type + "</ul>");
            }
            var hasLi = $('.' + type).children().hasClass(name);
            if (!hasLi) { 
                $('.' + type).append("<li class='" + name + "'> ☼ " + name + ": " + count + "</li>");
            }
            else {
                $('.' + name).text("☼ "+ name + ": " + count)
            }
            
        }
        $('.Fetch_data').on('click', function () {
            $.get("http://careers.intspirit.com/endpoint/data_set", function (body, statusText, obj) {
                switch (body.type) {
                    case 'fruit': addItem(fruitArray, fruit, body.item, "fruit");
                        break;
                    case 'vegetable': addItem(vegetableArray, vegetable, body.item, "vegetable");
                        break;
                };
            });
        });

        $('.Clear_all').on('click', function () {
            fruitArray = [];
            vegetableArray = [];
            fruit = {};
            vegetable = {};
            $('.div_chall_3').children().last().children().remove();
        })
})