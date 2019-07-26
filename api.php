<?php

$conn = new mysqli("localhost", "root", "1234", "testing");

$action = $_REQUEST['action'];

switch ($action) {
	case "get":
		get_all_tasks();
		break;
	case "add":
		add_task();
		break;
	case "del":
		del_task();
		break;
	case "done":
		done_task();
		break;
	case "undo":
		undo_task();
		break;
	default:
		unknown();
		break;
}

function get_all_tasks() {
	global $conn;
	$result = $conn->query("SELECT * FROM tasks");
	$tasks = [];
	while($row = mysqli_fetch_assoc($result)) {
		$tasks[] = $row;
	}
	echo json_encode($tasks);
}

function add_task() {
	global $conn;
	$subject = $_POST['subject'];
	$status = $_POST['status'];
	$result = $conn->query("INSERT INTO tasks (subject, status, created_date) 
			VALUES('$subject', '$status', now())");
	if($result) {
		$id = mysql_insert_id();
		echo json_encode(["err"=>0, "id"=>$id]);
	}	else {
		echo json_encode(["err"=>1, "msg"=>"Unable to add task"]);
	}
}

function del_task () {
	global $conn;
	$id = $_POST['id'];
	$result = $conn->query("DELETE FROM tasks WHERE id = $id");
	if($result) {
		echo json_encode(["err"=>0]);
	}	else {
		echo json_encode(["err"=>1, "msg"=>"Unable to deleete task"]);
	}
}

function done_task() {
	global $conn;
	$id = $_POST['id'];
	$result = $conn->query("UPDATE tasks SET status = 0 WHERE id = $id");
	if($result) {
		echo json_encode(["err"=>0]);
	}	else {
		echo json_encode(["err"=>1, "msg"=>"Unable to Update task"]);
	}
}

function undo_task() {
	global $conn;
	$id = $_POST['id'];
	$result = $conn->query("UPDATE tasks SET status = 1 WHERE id = $id");
	if($result) {
		echo json_encode(["err"=>0]);
	}	else {
		echo json_encode(["err"=>1, "msg"=>"Unable to Update task"]);
	}
}

function unknown () {
	echo json_encode(["err"=>1, "msg"=> "Unknown Action"]);
}
