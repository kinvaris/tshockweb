(function (namespace, $) {
	"use strict";

    var TShockDashboard = function () {
		// Create reference to this instance
		var o = this;
		// Initialize app when document is ready
		$(document).ready(function () {
			o.initialize();
		});

	};

    console.log("Starting collecting data for dashboard");
    var tshock = JSON.parse(Cookies.get('tshockweb'));
    var base_url = window.location.protocol + "//" + window.location.host + "/";

    // display general information about the server
    function load_general_information() {
        $.ajax({
            type: 'POST',
            url: base_url + "api/model/lists/server/get_server_details",
            data: JSON.stringify({token: tshock.token}),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.status == 200) {
                    $('#tshockweb_amountonserver').html(data.result.output.playercount + "/" + data.result.output.maxplayers);
                    $('#tshockweb_uptime').html(data.result.output.uptime);
                    $('#tshockweb_server').html(data.result.output.serverversion);
                    $('#tshockweb_world').html(data.result.output.world);
                } else {
                    console.log("Collecting data for amount of players on server has failed: " + JSON.stringify(data));
                }
            }
        });
    }

    // display registered users in the database
    function load_registered_users() {
        $.ajax({
            type: 'POST',
            url: base_url + "api/model/lists/players/get_users_in_database",
            data: JSON.stringify({token: tshock.token}),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.status == 200) {
                    // empty registered users
                    $("#tshockweb_registeredusers").html("");
                    // fill registered users
                    var i;
                    for (i = 0; i < data.result.output.length; i++) {
                        $("#tshockweb_registeredusers").append("<li class='tile'><a class='tile-content ink-reaction' " +
                            "href='" + base_url + "webapps/html/pages/profile.html?username="
                            + data.result.output[i].name + "&registered=true'>" +
                            "<div class='tile-icon'>" +
                            "<img src='../../assets/img/terraria/user_logo.png' alt='' /></div>" +
                            "<div class='tile-text'>" + data.result.output[i].name + "<small>" +
                            "" + data.result.output[i].group + "</small></div></a></li>");
                    }
                } else {
                    console.log("Collecting data for registered users on server has failed: " + JSON.stringify(data));
                }
            }
        });
    }

    // display online users
    // display registered users in the database
    function load_online_users() {
        $.ajax({
            type: 'POST',
            url: base_url + "api/model/lists/players/get_current_players",
            data: JSON.stringify({token: tshock.token}),
            dataType: 'json',
            contentType: "application/json",
            success: function (data) {
                if (data.status == 200) {
                    // empty registered users
                    $("#tshockweb_onlineusers").html("");
                    // fill registered users
                    var i;
                    for (i = 0; i < data.result.output.length; i++) {
                        var username = data.result.output[i].nickname;
                        var group = data.result.output[i].group;
                        var registered = false;

                        // check if user is logged in or registered
                        if (data.result.output[i].username != "") {
                            registered = true;
                        }

                        $.ajax({
                            type: 'POST',
                            url: base_url + "api/model/lists/players/get_user_ip_in_world",
                            data: JSON.stringify({token: tshock.token, username: username}),
                            dataType: 'json',
                            contentType: "application/json",
                            success: function (sub_data) {
                                if (sub_data.status == 200) {
                                    $("#tshockweb_onlineusers").append("<li class='tile'><a class='tile-content ink-reaction'" +
                                        "href='" + base_url + "webapps/html/pages/profile.html?username=" + username +
                                        "&registered="+registered+"'>" +
                                        "<div class='tile-icon'>" +
                                        "<img src='../../assets/img/terraria/user_logo.png' alt='' /></div>" +
                                        "<div class='tile-text'>" + username + "<small>" +
                                        "" + group + ", " + sub_data.result.output + "</small></div>" +
                                        "<a class='btn btn-flat ink-reaction'><i class='fa md-mic-off'></i></a>" +
                                        "<a class='btn btn-flat ink-reaction'><i class='fa fa-warning'></i></a>" +
                                        "<a class='btn btn-flat ink-reaction'><i class='fa fa-times'></i></a></a></li>");
                                } else {
                                    console.log("Collecting ip for online user on server has failed: " + JSON.stringify(data));
                                }
                            }
                        });
                    }
                } else {
                    console.log("Collecting data for online users on server has failed: " + JSON.stringify(data));
                }
            }
        });
    }

    $('#tshockweb_refresh_registeredusers').on('click', function (e) {
        load_registered_users();
    });

    $('#tshockweb_refresh_onlineusers').on('click', function (e) {
        load_online_users();
    });

    $('#tshockweb_refresh_general').on('click', function (e) {
        load_general_information();
    });

    // load dashboard data
    load_general_information();
    load_online_users();
    load_registered_users();


	namespace.TShockDashboard = new TShockDashboard;
}(this.materialadmin, jQuery)); // pass in (namespace, jQuery):