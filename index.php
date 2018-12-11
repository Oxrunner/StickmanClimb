<?php
include(__DIR__."/../../classes/LogHit.php");
LogHit::LogAHit("StickManClimb");
?>
<!DOCTYPE html>
<html>
	<head>
		<meta content="text/html; charset=utf-8" http-equiv="Content-Type" >
		<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false"></script>
		<title>My Canvas Page</title>
		<?php include("/../../shared/head.php"); ?>
	</head>
	<body>
		<?php include("/../../shared/header.php"); ?>
		<Section id="MainSection">
			<canvas id="myCanvas" width="600" height="630">
			The Browser you are using does not support canvas.
			</canvas>
		</section>
		<script src="js/Game.js"></script>
		<script src="js/background.js"></script>
	</body>
</html>
