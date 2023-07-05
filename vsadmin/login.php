<!doctype html>
<html>
<head>
<title>Control panel login</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<!-- Mobile Specific Meta
================================================== -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<link rel="stylesheet" type="text/css" href="adminstyle.css" />
<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script type="text/javascript" src="assets/ectadmin.js"></script>
</head>

<body>
<div class="login">

			<form method="post" name="mainform" action="login.php">
			<input type="hidden" name="posted" value="1">
	<div class="row centerit">
        <div class="login_form round_all">
            <div class="login_header round_all"></div>
			<table>
              <tr>
                <td width="30%" align="right"><strong>Username: </strong></td>
				<td align="left"><input type="text" name="user" id="user" size="20" /></td>
			  </tr>
			  <tr>
                <td align="right"><strong>Password: </strong></td>
				<td align="left"><input type="password" name="pass" size="20" autocomplete="off" /></td>
			  </tr>
			  <tr>
                <td align="right"><input type="checkbox" name="cook" value="ON" /></td>
				<td align="left" class="small"><strong>Click here to write a cookie to remember your username and password.</strong><br /><span style="font-size:10px">(This is not recommended if you are on a shared or public computer)</span></td>
			  </tr>
			</table>
			<p><input type="submit" value="Submit"></p>
			  <p class="credit"><a href="http://www.ecommercetemplates.com/">Shopping Cart Software</a> by Ecommerce Templates</p>
			</form>
        </div>
    </div>
<script type="text/javascript">
<!--
document.getElementById('user').focus();
// -->
</script>
     		
</div>
</body>
</html>
