<?php
	if(isset($_POST['content'])){
		setcookie('content',$_POST['content'],time()+60); // 1 min cookie
	}
?>