
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><!-- InstanceBegin template="/Templates/BigBrainzTemplate2014.dwt" codeOutsideHTMLIsLocked="false" --> 
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /> 
<!-- InstanceBeginEditable name="doctitle" -->
<title>Big Brainz Pilot Application</title>
<!-- InstanceEndEditable -->

<link href="/Templates/BigBrainzStyle2014.css" rel="stylesheet" type="text/css">
<link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
<!--[if !IE 7]><style type="text/css">#wrap {display:table;height:100%}</style><![endif]-->
<script language="JavaScript" type="text/javascript" src="/Assets/Scripts/PopUpWindow.txt"></script>



<!-- InstanceBeginEditable name="Desciption and Keywords" -->

<!-- InstanceEndEditable -->

<!-- Google Analytics Code -->
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-94233-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
<!-- End Google Analaytics Code -->

</head> 
<body> 
  <div id="pagewrapper">
	<div id="header"> 
		<h1><a href="http://www.bigbrainz.com">Multiplication Games</a></h1> 
		<ul id="topMenu"> 
			<li><a href="/Store.php">Store</a></li>
			<li><a href="/Downloads.html">Downloads<br>(Home-Use)</a></li>
			<li><a href="/Schools.php">Schools</a></li>
			<li><a href="/Support.php">Support</a></li>
			<li><a href="/games/launcher/app.html">Reports</a></li>
			<li><a href=""></a></li>			
			<li><a href="/blog/">Blog</a></li>
			<li><a href="/cart.php">Checkout</a></li>
		</ul> 
	</div> 



	<div id="main">
		<div id="boxmain">
<!-- InstanceBeginEditable name="Edit Region 1" -->
	  <div align="center">
	    <div id="wrapper" align="center"></div>
        <p>
          <script language="JavaScript" type="text/javascript">
function UpdateTotal()
{
	var num3rdGraders = parseInt(document.getElementById("Num3rdGraders").value);
	var numOtherGraders = parseInt(document.getElementById("NumOtherGraders").value);
	var totalStudents = num3rdGraders + numOtherGraders;
	document.getElementById("TotalStudents").innerHTML = totalStudents;

	var totalCost = num3rdGraders * 15;
	var costPer = totalCost/totalStudents;
	//var costPer = Math.round((totalCost/totalStudents)*100)/100;
	var costPer=Math.round(costPer*100)/100

	document.getElementById("TotalCost").innerHTML = "$" + totalCost;
	document.getElementById("CostPerStudent").innerHTML = "$" + costPer;
	
	//benz idea
	//document.getElementById("Num3rdGraders").value = "";
	//document.getElementById("NumOtherGraders").value = "";
	
	document.getElementsByName("State")[0].value = "";
}
function FocusOnCaptcha()
{
	if (document.getElementById('focusOnCaptcha') != null)
	{
	    document.getElementById('6_letters_code').focus();
	}	
}
          </script>
          <script>FocusOnCaptcha();</script>
          <script language='JavaScript' type='text/javascript'>
function refreshCaptcha()
{
	var img = document.images['captchaimg'];
	img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}
          </script><span class="schoolUse">See for yourself how powerful Big Brainz is.</span></p>
        <table width="100%" class="Padded" id="indexTable">
          <tr>
            <td width="50%" align="left" valign="top"><p>The National Mathematics Advisory Board   emphasizes  that developing automatic recall of core math facts is &ldquo;critical&rdquo; because  students need to free up working memory in order to master higher-order  concepts. They also emphasize that most curricula fail in this pivotal area.<br />
            </p></td>
            <td width="50%" align="left" valign="top"><p>That&rsquo;s why we&rsquo;ve spent the past decade pioneering such   high-end gameplay and cutting-edge curriculum. We know that schools need a solution powerful enough to ensure that  EVERY student  will walk away with the complete fluency and confidence they need to succeed.</p></td>
          </tr>
        </table>
        <p class="smalltext">&nbsp;</p>
        <table width="100%" border="0" cellpadding="0">
          <tr>
            <td width="64%"><div id="videoColumnLeft">
              <p>
                <script>
var image = new Image();
image.src = "http://youtube.com/favicon.ico";
image.onload = function(){
	// The user can access youtube
	var youtube_html = '<iframe width="560" height="315" src="//www.youtube.com/embed/ud4lQC39pn0" frameborder="0" controls=2 allowfullscreen></iframe>';
	document.getElementById('youtube').innerHTML = youtube_html;
};
image.onerror = function(){
// The user can't access youtube
	var youtube_html = '<a href="http://s3.amazonaws.com/BigBrainz/Quick-Start-Video-2014.mp4" title="TA_30Sec" target="_new" rel="#voverlay"><img src="Assets/Images/Quick-Start-Video-Play-Image.png" alt="TA_30Sec" width="560" height="315" border="0" /></a>';
	document.getElementById('youtube').innerHTML = youtube_html;

};

                    </script>
              </p>
              <div id = "youtube">:)</div>
              </p>
            </div></td>
            <td width="36%" align="center"><a href="Assets/HISD Big Brainz Case Study.pdf" class="notice3"></a><img src="../Assets/Images/Pilot-Study-Results-Tall-300.png" width="300" height="323" alt="Pilot Study Results" /><br /></td>
          </tr>
        </table>
        <p><span class="schoolUse">Pilot Application<br />
        </span><span class="text">Or call toll-free (877) 356-7040</span></p>
        <table width="90%" border="0" cellpadding="10">
          <tr>
            <td align="center"><form action="../Pilot/Pilot.php" method="post" name="contact_form" id="contact_form" onsubmit="return validate_form()">
              <fieldset class="text">
                <p><br />
                </p>
                <table width="750" border="0" cellspacing="5" cellpadding="0">
                  <tr>
                    <td width="92"><div align="right" class="labelsmall" id = "nameID">Name:</div></td>
                    <td width="279"><div align="left">
                      <input name="Name" type="text" class="textfieldsmall" value = '' />
                    </div></td>
                    <td width="115"><div align="right" class="labelsmall" id = "emailID">Email (school) </div></td>
                    <td width="264"><div align="left">
                      <input name="Email" type="text" class="textfieldsmall" value = '' />
                    </div></td>
                  </tr>
                  <tr>
                    <td><div align="right" class="labelsmall" id = "roleID">Your Role: </div></td>
                    <td><div align="left">
                      <input name="Role" type="text" class="textfieldsmall" value = '' />
                    </div></td>
                    <td><div align="right" class="labelsmall" id = "districtID">District:</div></td>
                    <td><div align="left">
                      <input name="District" type="text" class="textfieldsmall" value = '' />
                    </div></td>
                  </tr>
                  <tr>
                    <td><div align="right" class="labelsmall"  id = "schoolID">School:</div></td>
                    <td><div align="left">
                      <input type="text" class="textfieldsmall" name="School" value='' />
                      </div></td>
                    <td><div align="right" class="labelsmall" id = "phoneID">Phone:</div></td>
                    <td><div align="left">
                      <input name="Phone" type="text" class="textfieldsmall" value = '' />
                      </div></td>
                  </tr>
                  </table>
                <p align="center" class="textBoldBigBlack">&nbsp;</p>
                <p align="left" class="textBoldBigBlack">&nbsp;</p>
                <table width="339" border="0" cellspacing="0">
                  <tr>
                    <td width="232" colspan="2"><div align="center">
                                            <br />
                                            <img src="../captcha_code_file.php?rand=1351294828" id='captchaimg' /><br />
                      Please enter the above code into the box below <br />
                      (to keep the robots out:) <br />
                      <input id="6_letters_code" name="6_letters_code" type="text" />
                      <br />
                      <input type="submit" value="Submit" name='submit' />
                    </div></td>
                  </tr>
                  <tr>
                    <td colspan="2"><div align="center" class="BigBrainzStyle"><small>Can't read the image? click <a href='javascript: refreshCaptcha();'>here</a> to refresh</small></div></td>
                  </tr>
              </table>
                <p>&nbsp;</p>
              </fieldset>
            </form></td>
          </tr>
        </table>
        <p class="text">&nbsp;</p>
</div>
    <!-- InstanceEndEditable -->
	  	</div>
		
	  <!-- InstanceBeginEditable name="EditRegion4" -->
	  <!-- InstanceEndEditable -->
		
		<!-- InstanceBeginEditable name="EditRegion5" -->
		<!-- InstanceEndEditable -->
	</div>
	  
</div>
<div id="footer">
		<ul id="bottomMenu"> 
			<li><a href="/Contact.php">Contact</a></li> 
			<li><a href="/reviews/web/">Reviews</a></li> 
			<li><a href="/Articles">Articles</a></li> 
			
			<li><a href="/LinkToUs/LinkToUs.html">Link<br /> 
		    To Us</a></li> 
			<li><a href="/affiliate1.php">Affiliates</a></li> 
			<li><a href="/Shipping.php">Shipping</a></li> 
			<li><a href="/Guarantee.php">Guarantee</a></li> 
			<li><a href="/TermsOfUse.php">Terms <br />
		    of Use</a></li> 
			<li><a href="/Legal.php">Legal</a></li> 
			<li><a href="/About.php">About</a></li> 
			<li><a href="/orderstatus.php">My Orders </a></li>
		</ul> 
<div id="copyright">&copy; 2004 - 2014 Big Brainz, Inc.</div>
</div>

<!-- NEW Google Analytics Tracking Code-->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-94233-1");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- END Google Analytics Tracking Code-->

<!-- BEGIN AdRoll Tracking Code-->
<script type="text/javascript">
adroll_adv_id = "X36G6FX3ABDDTKTJBOZMWT";
adroll_pix_id = "UFCWAPQTOJBVNAE2Q4G3XI";
(function () {
var oldonload = window.onload;
window.onload = function(){
   __adroll_loaded=true;
   var scr = document.createElement("script");
   var host = (("https:" == document.location.protocol) ? "https://s.adroll.com" : "http://a.adroll.com");
   scr.setAttribute('async', 'true');
   scr.type = "text/javascript";
   scr.src = host + "/j/roundtrip.js";
   ((document.getElementsByTagName('head') || [null])[0] ||
    document.getElementsByTagName('script')[0].parentNode).appendChild(scr);
   if(oldonload){oldonload()}};
}());
</script>
<!-- END AdRoll Tracking Code-->

</body>

<!-- InstanceEnd --></html>
