$(document).ready(function() {

	$("#new-task button").click(function () {
		var task = $("#new-task input").val();
		if(!task) return false;
		$.post("api.php", {action:"add", subject: task, status: 1}, function (res) {
			// console.log(res);
			if(res.err == 1) {
				alert(res.msg);
			}	else {
				buildTask(task, res.id).appendTo("#tasks");
			}
			$("h1 span").html($("#tasks li").length);
		}, "json");
		$("#new-task input").val("").focus();
	});

	$("#new-task input").keydown(function(e) {
		if(e.which == 13)
			$("#new-task button").click();
	});

	$.get("api.php", {action: "get"}, function (res) {
		$.each(res, function (index, value){
			if(value.status == 1) {
				buildTask(value.subject, value.id).appendTo("#tasks");
			}	else {
				buildTask(value.subject, value.id).appendTo("#done");
			}
		});
		
		$("#done input").attr("checked", "checked");
		$("h1 span").html($("#tasks li").length);
	}, "json");

});


function buildTask (msg, id) {
	var checkbox = $("<input>", {
		type: "checkbox"
	}).click (function () {
		var task = $(this).parent();
		var task_id = task.data("id");
		if($(this).is(":checked")){
			$.post("api.php", {action: "done", id: task_id}, function (res) {
				if (res.err == 1) {
					alert(res.msg);
				}	else {
					task.prependTo("#done");
				}
				$("h1 span").html($("#tasks li").length);
			}, "json");
		}	else {
			$.post("api.php", {action: "undo", id: task_id}, function (res) {
				if (res.err == 1) {
					alert(res.msg);
				}	else {
					task.appendTo("#tasks");
				}
				$("h1 span").html($("#tasks li").length);
			}, "json");

		}
	});
	var task = $("<span>").html(msg);
	var del = $("<a>").html("&times;").click(function () {
		var task = $(this).parent();
		var task_id = task.data("id");
		$.post("api.php", {action: "del", id: task_id}, function (res) {
			i$("h1 span").html($("#tasks li").length);
		}, "json");
		$(task).remove();
		$("h1 span").html($("#tasks li").length);
		
	});

	return $("<li>").data("id", id)
					.append(checkbox)
					.append(task)
					.append(del);
}