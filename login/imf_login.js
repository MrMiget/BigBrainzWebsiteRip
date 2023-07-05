$( document ).ready(function() {
    var showAdmin = function(tokens) {
        var options = $("#options");
        options.find('option')
            .remove()
            .end();
        options.append($("<option />").val('').text(''));
        $.each(Object.keys(tokens), function() {
            options.append($("<option />").val(tokens[this]).text(this));
        });
        $( "#admin-dlg" ).dialog({
            modal: true,
            buttons: {
                Ok: function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    };

    $("#options").change(function() {
        var token = $('#options').val();
        window.location.replace('https://launcher.bigbrainz.com/app-all.html?token=' + token);
    });
    $("#sitecode-help-question").click(function(ctrl) {
        $('#sitecode-help').toggle();
    });
    $("#username-help-question").click(function(ctrl) {
        $('#username-help').toggle();
    });
    var QueryString = function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }();
    var baseUrl = 'https://launcher.bigbrainz.com/login/landing';
    // var baseUrl = 'http://localhost:9292/login/landing';

    if (QueryString.sc !== undefined && QueryString.sc !== '') {
        localStorage.setItem("imf-sitecode", QueryString.sc);
    }
    if (QueryString.site_code !== undefined && QueryString.site_code !== '') {
        localStorage.setItem("imf-sitecode", QueryString.site_code);
    }
    if (QueryString.sitecode !== undefined && QueryString.sitecode !== '') {
        localStorage.setItem("imf-sitecode", QueryString.sitecode);
    }
    $('#decided-site-code-value').html(localStorage.getItem("imf-sitecode"));
    $('#input-sitecode').val(localStorage.getItem("imf-sitecode"));
    if ($('#decided-site-code-value').html() == '') {
        $('#decided-site-code').hide();
        $('#submit-btn').attr('disabled', 'disabled');
    } else {
        $('#undecided-site-code').hide();
    }
    $('#edit-site-code').click(function() {
        $('#undecided-site-code').show();
        $('#decided-site-code').hide();
        $('i.icon-pencil').addClass('icon-checkmark');
        $('i.icon-pencil').removeClass('icon-pencil');
        $('#submit-btn').attr('disabled', 'disabled');

    });
    $('#save-site-code').click(function() {
        localStorage.setItem("imf-sitecode", $('#input-sitecode').val());
        $('#undecided-site-code').hide();
        $('#decided-site-code').show();
        $('#decided-site-code-value').html($('#input-sitecode').val());
        $('i.icon-checkmark').addClass('icon-pencil');
        $('i.icon-checkmark').removeClass('icon-checkmark');
        $('#submit-btn').removeAttr('disabled');
    });
    $('#show-btn').click(function() {
        if ($('#input-password').attr('type') === 'password') {
            $('#input-password').attr('type', 'text');
            $('i.icon-eye').addClass('icon-eye-blocked');
            $('i.icon-eye').removeClass('icon-eye');
        } else {
            $('#input-password').attr('type', 'password');
            $('i.icon-eye-blocked').addClass('icon-eye');
            $('i.icon-eye-blocked').removeClass('icon-eye-blocked');
        }
    })
    $('form').submit(function(e){
        e.preventDefault();
        var params = {};
        params.sitecode = $('#decided-site-code-value').html();
        params.username = $('#input-username').val();
        params.password = $('#input-password').val();
        if (params.username === '') {
            alert('Please enter your username.');
            return;
        }
        if (params.password === '') {
            alert('Please enter your password.');
            return;
        }
        if (params.sitecode.toLowerCase() == 'demo' && params.password.toLowerCase() == 'demo' && params.username.toLowerCase() == 'demo') {
            window.location.replace('https://bigbrainz.com/web/?token=demo');
            e.preventDefault();
            return;
        }
        $.ajax( {
            type: 'POST',
            url: baseUrl + '/',
            data: params,
            success: function(res) {
                var results = JSON.parse(res);
                if (results.success) {
                    if (results.type == 'admin') {
                        showAdmin(results.tokens);
                        return
                    }
                    if (params.username == 'school' || params.username ==  'district') {
                        window.location.replace('https://launcher.bigbrainz.com/app-all.html?token=' + results.token);
                    } else {
                        window.location.replace('https://bigbrainz.com/web/?token={"success":true,"token":"' + results.token + '"}');
                    }
                } else if (results.message.indexOf('Too many') > -1) {
                    alert("This district has multiple schools with the same password.\nTo protect student's privacy, each school needs a unique password.\nPlease text: 866-457-8776\nor chat: https://help.imaginelearning.com/, or call 866-457-8776\nto setup a unique password for your school")
                } else {
                    alert("Could not log in.\nIf you need help logging in, please text: 866-457-8776\nor chat: https://help.imaginelearning.com/, or call 866-457-8776")
                }

            },
            error: function(xhr, textStatus) {
                alert("Could not log in.\nIf you need help logging in, please text: 866-457-8776\nor chat: https://help.imaginelearning.com/, or call 866-457-8776")
            }
        });
    });
});