$(document).ready(function () {
	$('#field1-field2, #field2-field3, #field1-select, #field2-select, #field3-select').select2();
	$("#logout").on("click", function (e) {
		console.log("logout 3001");
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3001/logout',
		});
	});

	$("#login").on("submit", function (e) {
		var user = {};
		user.username = $("#userName").val();
		user.password = $("#inputPassword").val();
		localStorage.setItem("user", JSON.stringify(user));
	});

	$("#getinfo").on("click", function (e) {
		$.ajax({
			type: 'POST',
			url: '/table/info',
			dataType: 'xml',
			success: function (data) {
				var x2js = new X2JS();
				var info = x2js.xml2json(data.documentElement);
				$("#count").html(info.count);
				$("#avg").html(info.avg);
				$("#max").html(info.max);
				$("#min").html(info.min);
				$('.table-panel').animate({backgroundColor: '#f5f5f5'}).animate({backgroundColor: '#FFF'});
			}
		});
	});
	$("#search").on("click", function (e) {
		if ($("#field1").val().trim() == "") {
			return;
		}
		var data = {};
		data.query = $("#field1-select").val() + "='" + $("#field1").val() + "' ";
		if ($("#field2-select").val() != "" && $("#field2").val().trim() != "") {
			data.query += $("#field1-field2").val() + " ";
			data.query += $("#field2-select").val() + "='" + $("#field2").val() + "' ";
		}
		if ($("#field3-select").val() != "" && $("#field3").val().trim() != "") {
			data.query += $("#field2-field3").val() + " ";
			data.query += $("#field3-select").val() + "='" + $("#field3").val() + "' ";
		}
		var query = JSON.parse(localStorage.getItem("user"));
		query.data = data;
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3001/people/search',
			data: query,
			dataType: 'json',
			success: function (people) {
				var table = "";
				$.each(people, function (i, person) {
					table += '<tr class="row-data" id="' + person.PID + '-row" data-person=\'' + JSON.stringify(person) +'\'>' +
						         '<td><button id="' + person.PID + '-edit" class="edit btn btn-warning">Edit</button></td>' +
						         '<td class="FirstName">' + person.FirstName + '</td>' +
						         '<td class="LastName">' + person.LastName + '</td>' +
						         '<td class="Email">' + person.Email + '</td>' +
						         '<td class="Address">' + person.Address + '</td>' +
						         '<td class="City">' + person.City + '</td>' +
						         '<td class="Province">' + person.Province + '</td>' +
						         '<td class="Country">' + person.Country + '</td>' +
						         '<td class="Birthday">' + person.Birthday + '</td>' +
						         '<td><button id="' + person.PID + '-delete" class="delete btn btn-danger">Delete</button></td>' +
						      '</tr>';
				});
				$("#results").html(table);
				$(".row-data").on("input" ,function (e) {
					var p=$(this).data("person");
					p[e.target.className] = $(e.target).text();
				});
				$(".delete").on("click", function (e) {
					var selector = "#" + this.getAttribute("id").split("-")[0] + "-row";
					var person = $(selector).data("person");
					var query = JSON.parse(localStorage.getItem("user"));
					query.person = person;
					$.ajax({
						type: 'POST',
						url: 'http://localhost:3001/people/delete',
						data: query,
						dataType: 'json',
						success: function (data) {
							if (data.success) {
								$(selector).remove();
							}
						}
					});

				});
				$(".edit").on("click", function (e) {
					var selector = "#" + this.getAttribute("id").split("-")[0] + "-row";
					var cells = $(selector + " td");
					var editable = false;
					if ($(this).hasClass("update")) {
						$(this).text("Edit");
						editable = false;
						var person = $(selector).data("person");
						var query = JSON.parse(localStorage.getItem("user"));
						query.person = person;
						$.ajax({
							type: 'POST',
							url: 'http://localhost:3001/people/update',
							data: query,
							dataType: 'json',
							success: function (data) {
								if (data.success) {
									console.log(data);
								}
							}
						});
					} else {
						$(this).text("Update");
						editable = true;
					}
					for (var i = 1; i < cells.length-1; i++) {
						$(cells[i]).attr("contenteditable", editable);
					};
					$(this).toggleClass("update");
					$(this).toggleClass("btn-success");
				});
			}
		});
	});
});