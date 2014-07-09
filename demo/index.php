<!doctype html>
<html>
<head>
	<meta charset="UTF-8" />
	
	<title>CKEditor Inplace</title>
	
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
	<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
	
	<meta name="author" content="Earthchie www.earthchie.com" />
	<meta name="description" content="" />
	<meta name="keywords" content="" />
	
	<style>
		.editable{
			width: 100%;
			margin: 10px 0;
		}
	</style>
	
	<!-- javascript -->
	<script type="text/javascript" src="jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="ckeditor/ckeditor.js"></script>
	<script type="text/javascript" src="../jquery.cke_inplace.min.js"></script>
	
	<!--[if IE]>
	<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
</head>
<body>

	<h1>CKEditor Edit In Place</h1>
	
	<!-- basic -->
	<div class="editable">
		Toolbar ตาม config.js ของ CKEditor
	</div>
	
	<!-- normal-toolbar -->
	<div class="normal-toolbar editable">
		Toolbar แบบพอดีๆ ตัดพวก tool ที่ไม่ค่อยได้ใช้ออก
	</div>
	
	<!-- simple-toolbar -->
	<div class="simple-toolbar editable">
		Toolbar แบบเรียบง่าย มีแค่ ตัวหนา, ตัวเอียง, ขีดเส้นใต้* และขยายเต็มจอ<br>
		<i>* แต่ตัวเอียงไม่โชว์ใน demo นี้ เพราะผมโหลด ckeditor ตัวไม่เต็มมา 55</i>
	</div>
	
	<!-- no-toolbar -->
	<div class="no-toolbar editable">
		แบบไม่มี Toolbar
	</div>
	
	<!-- custom -->
	<div id="custom">
		แบบ Custom เอาเอง
	</div>
	
	<script>
	$(function(){
		$('#custom').editable({
			ajax_var_name: 'content',
			ajax_url: false,
			ajax_success: function(response){},
			ajax_error: function(response){},
			
			callback_save: function(){alert('บันทึกแล้ว');},
			callback_cancel: function(){alert('ยกเลิกแล้ว')},
			
			placeholder_text: 'ดับเบิลคลิกเพื่อแก้ไข',
			placeholder_color: 'red',
			
			button_save_label: 'บันทึก',
			button_loading_label: 'รอซักครู่',
			button_save_class: '',
			button_cancel_label: 'ยกเลิก',
			button_cancel_class: '',
			
			hover_text: 'ดับเบิลคลิกเพื่อแก้ไข',
			hover_background: 'rgba(0,0,0,.9)',
			hover_color: '#fff',
			hover_top: '-2.5em',
			hover_left: '0',
			hover_padding: '0.5em',
			hover_font_size: '0.7em',
			hover_line_height: '1em',
			
			cke_options: {
				height: 50,
			},
		});
	});
	</script>
	
	<hr>
	
	<!-- with data-handler -->
	<div class="editable" data-handler="handler.php">
		<?php
			if(isset($_COOKIE['content'])){
				echo $_COOKIE['content']; // อ่านค่าจากฝั่ง server มาแสดง, ในตัวอย่างนี้คืออ่านค่าจาก cookie; หรือไม่ก็ ajax มายัดเอาก็ได้ แล้วแต่ถนัด
			}else{
				echo "<p>ตัวอย่างการส่งข้อมูลไปเซฟที่ฝั่ง server (Ajax)</p>";
				echo "<p><i>ข้อความจะถูกบันทึกไว้ 1 นาที จากนั้นจะกลับมาเป็นข้อความที่กำลังอ่านอยู่นี้</i></p>";
			}
		?>
	</div>
    
</body>
</html>
