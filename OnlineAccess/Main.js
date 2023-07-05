// Main.js



// ######################################################################################################################################
//                                                               GLOBALS
// ######################################################################################################################################



var onclickArg;
var cal;

// "school" or "district". Used for setting school and district type, purchase status, and expiration date
var schoolOrDistrict;



// ######################################################################################################################################
//                                                               INITIALIZATION
// ######################################################################################################################################



function InitializeOnlineAccess()
{
	//window.open("http://www.bigbrainz.com/Online/OnlineLicense.html", "_blank", "height=650, width=850, scrollbars=yes");







	InitializeHierarchy();

	CreateTitleAndShadow(50, 10);
	DrawBox(50, 50, 1000, 5, "880000");
	CreateHierarchyDiv();
	CreateDataViewDivs();
	CreateTaskSelection();
	CreateIOViewDiv();
	RecreateHTMLFromHierarchy();

	// open hierarchy to Utah
	SendAjaxRequest(new Array(
		new Array("Action", "GetRegionNamesAndIDs"),
		new Array("RegionType", "Area"),
		new Array("ParentID", 0)
	));
	setTimeout(
		'SendAjaxRequest(new Array(new Array("Action", "GetRegionNamesAndIDs"), new Array("RegionType", "Country"), new Array("ParentID", "BB01NOIP31231348620080617T170516656Z") ))',
		500);
	setTimeout(
		'SendAjaxRequest(new Array(new Array("Action", "GetRegionNamesAndIDs"), new Array("RegionType", "State"), new Array("ParentID", "BB01NOIP82414221620080617T170530968Z") ))',
		1000);
}



// ######################################################################################################################################
//                                                               AJAX
// ######################################################################################################################################



//var xmlHttp = null;
// from http://www.w3schools.com/ajax/ajax_browsers.asp
// $nameValuePairList is an array of two-element arrays
function SendAjaxRequest(nameValuePairList)
{
	var xmlHttp = null;

	try
	{
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	}
	catch (e)
	{
		// Internet Explorer
		try
		{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e)
		{
			try
			{
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e)
			{
				alert("Your browser does not support AJAX!");
			}
		}
	}

	if (xmlHttp != null)
	{
		xmlHttp.onreadystatechange = ReceiveFromServerCB;

		// build url
		var url = "OA_AjaxServer.php";
		var args = "";
		for (var n=0; n<nameValuePairList.length; n++)
		{
			if (n > 0) args += "&";
			args += urlEncode(nameValuePairList[n][0]) + "=" + urlEncode(nameValuePairList[n][1]);
		}
		xmlHttp.open("POST", url, true);

		// from http://www.openjs.com/articles/ajax_xmlhttp_using_post.php
		//Send the proper header information along with the request
		xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlHttp.setRequestHeader("Content-length", args.length);
		xmlHttp.setRequestHeader("Connection", "close");

		xmlHttp.send(args);
	}
}



// ======================================================================================================================================



// add this to top of ajax php page: header('Content-Type: text/xml');
//
// here's a sample xml doc to return
//<?xml version='1.0' encoding='ISO-8859-1'?>
//<company>
//<compname>Big Brainz</compname>
//</company>
// see also http://www.w3.org/TR/XMLHttpRequest/
function ReceiveFromServerCB()
{
	// receive data from server
	if (this.readyState == 4 && this.status == 200)
	{
		//alert(this.responseText); // for debugging
		//AddToDisplay(this.responseText); // for debugging
		// process response
		var xmlDoc = this.responseXML.documentElement;
		var action = xmlDoc.getElementsByTagName("Action")[0].childNodes[0].nodeValue;
		switch (action)
		{
		case "GetRegionNamesAndIDs": Action_GetRegionNamesAndIDs(xmlDoc); break;
		case "GetNameValuePairs": Action_GetNameValuePairs(xmlDoc); break;
		case "Rename": Action_Rename(xmlDoc); break;
		case "RenameStateType": Action_RenameStateType(xmlDoc); break;
		case "Delete": Action_Delete(xmlDoc); break;
		case "Reparent": break;
		case "AddNewArea": Action_AddNewArea(xmlDoc); break;
		case "AddNewRegion": Action_AddNewRegion(xmlDoc); break;
		case "RemoveOrphans": Action_RemoveOrphans(xmlDoc); break;
		case "SetSchoolType": Action_SetSchoolType(xmlDoc); break;
		case "SetSchoolPurchaseStatus": Action_SetSchoolPurchaseStatus(xmlDoc); break;
		case "SetSchoolExpirationDate": Action_SetSchoolExpirationDate(xmlDoc); break;
		case "SetSchoolPassword": Action_SetSchoolPassword(xmlDoc); break;
		case "SetDistrictType": break;
		case "SetDistrictPurchaseStatus": break;
		case "SetDistrictExpirationDate": break;
		case "SchoolsAssigningPassword": Action_SchoolsAssigningPassword(xmlDoc); break;
		case "SchoolsPlayingGameInLastWeek": Action_SchoolsPlayingGameInLastWeek(xmlDoc); break;
		}
	}
}



// ######################################################################################################################################
//                                                               AJAX RESPONSES
// ######################################################################################################################################



function Action_GetRegionNamesAndIDs(xmlDoc)
{
	var regionType = xmlDoc.getElementsByTagName("RegionType")[0].childNodes[0].nodeValue;
	var parentID = "0";
	var parentIDNodes = xmlDoc.getElementsByTagName("Request")[0].getElementsByTagName("ParentID");
	if (parentIDNodes.length > 0) parentID = parentIDNodes[0].childNodes[0].nodeValue;

	// find correct insertion point in hierarchy
	var obj = Action_SearchForItemName(parentID);
	if (obj == null) return;
	obj.children = new Array();

	// populate hierarchy array
	var regionArray = xmlDoc.getElementsByTagName("Region");
	for (var n=0; n<regionArray.length; n++)
	{
		var itemName = regionArray[n].getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
		var displayableName = regionArray[n].getElementsByTagName("DisplayableName")[0].childNodes[0].nodeValue;
		obj.children[n] = new HObj(itemName, displayableName, regionType);
	}
	obj.children.sort(HierarchyLevelSortCB);

	RecreateHTMLFromHierarchy();
}



// ======================================================================================================================================



function GetNameValuePairsSortCB(a, b)
{
	var s1 = a.nameText;
	var s2 = b.nameText;
	s1.toLowerCase();
	s2.toLowerCase();
	if (s1 > s2) return 1;
	if (s1 < s2) return -1;
	return 0;
}
function MoveItemToTop(nvpArray, name)
{
	for (var n=0; n<nvpArray.length; n++)
	{
		if (nvpArray[n].nameText == name)
		{
			var tmpObj = nvpArray[n];
			for (var m=n; m>=1; m--)
				nvpArray[m] = nvpArray[m-1];
			nvpArray[0] = tmpObj;
			return;
		}
	}
}
function GetElementByTagName(xmlDoc, tagName)
{
	var retVal = "";

	var elements = xmlDoc.getElementsByTagName(tagName);
	if (elements.length > 0)
	{
		var children = elements[0].childNodes;
		if (children.length > 0)
			retVal = children[0].nodeValue;
	}
	return retVal;
}
function Action_GetNameValuePairs(xmlDoc)
{
	ClearDataView();

	var regionType = xmlDoc.getElementsByTagName("RegionType")[0].childNodes[0].nodeValue;
	var ID = xmlDoc.getElementsByTagName("ID")[0].childNodes[0].nodeValue;

	// populate data view
	var nameValuePairArray = xmlDoc.getElementsByTagName("NameValuePair");
	var nvpArray = new Array();
	for (var n=0; n<nameValuePairArray.length; n++)
	{
		var nameString = "";
		var valueString = "";
		if (nameValuePairArray[n].getElementsByTagName("Name")[0].childNodes.length > 0)
			nameString = nameValuePairArray[n].getElementsByTagName("Name")[0].childNodes[0].nodeValue;
		if (nameValuePairArray[n].getElementsByTagName("Value")[0].childNodes.length > 0)
			valueString = nameValuePairArray[n].getElementsByTagName("Value")[0].childNodes[0].nodeValue;
		nvpArray[n] = new NVP(nameString + ": ", valueString);
	}

	// add hierarchy
	var areaName = GetElementByTagName(xmlDoc, "AreaName");
	var countryName = GetElementByTagName(xmlDoc, "CountryName");
	var stateName = GetElementByTagName(xmlDoc, "StateName");
	var districtName = GetElementByTagName(xmlDoc, "DistrictName");
	var schoolName = GetElementByTagName(xmlDoc, "SchoolName");
	var className = GetElementByTagName(xmlDoc, "ClassName");
	var gameName = GetElementByTagName(xmlDoc, "GameName");

	nvpArray.sort(GetNameValuePairsSortCB);
	MoveItemToTop(nvpArray, "ExpirationDate: ");
	MoveItemToTop(nvpArray, "PurchaseStatus: ");
	MoveItemToTop(nvpArray, "SchoolType: ");
	MoveItemToTop(nvpArray, "DisplayableName: ");
	MoveItemToTop(nvpArray, "ParentID: ");

	// IE needs additional line at top
	if (navigator.platform.toLowerCase().indexOf('win') != -1)
		AddLineToDataView(new NVP("", ""));

	AddLineToDataView(new NVP("Region Type: ", regionType));
	AddLineToDataView(new NVP("Region ID: ", ID));
	AddLineToDataView(new NVP("ParentID: ", nvpArray[0].valueText));
	if (areaName != "") AddLineToDataView(new NVP("Area: ", areaName, "bold"));
	if (countryName != "") AddLineToDataView(new NVP("Country: ", countryName, "bold"));
	if (stateName != "") AddLineToDataView(new NVP("State: ", stateName, "bold"));
	if (districtName != "") AddLineToDataView(new NVP("District: ", districtName, "bold"));
	if (schoolName != "") AddLineToDataView(new NVP("School: ", schoolName, "bold"));
	if (className != "") AddLineToDataView(new NVP("Class: ", className, "bold"));
	if (gameName != "") AddLineToDataView(new NVP("Game: ", gameName, "bold"));
	AddLineToDataView(new NVP("", ""));

	for (var n=2; n<nvpArray.length; n++)
	{
		// bold some values
		nvpArray[n].valueFontWeight = "bold";

		// convert Unix timestamps to readable form
		if (
			nvpArray[n].nameText == "Timestamp_FirstGame: " ||
			nvpArray[n].nameText == "Timestamp_MostRecentGame: " ||
			nvpArray[n].nameText == "Timestamp_PasswordFirstSet: " ||
			nvpArray[n].nameText == "DeletionDate: " ||
			(nvpArray[n].nameText == "ExpirationDate: " && nvpArray[n].valueText.indexOf("/") == -1)
			)
		{
			var date = new Date(nvpArray[n].valueText * 1000);
			nvpArray[n].valueText += " (" + date.toUTCString() + ")";
		}

		AddLineToDataView(nvpArray[n]);
	}
}



// ======================================================================================================================================



function Action_Rename(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var newLaunderedRegionName = xmlDoc.getElementsByTagName("NewLaunderedRegionName")[0].childNodes[0].nodeValue;
	var itemName = "0";
	var itemNameNodes = xmlDoc.getElementsByTagName("Request")[0].getElementsByTagName("ItemName");
	if (itemNameNodes.length > 0) itemName = itemNameNodes[0].childNodes[0].nodeValue;

	// find correct insertion point in hierarchy
	var obj = Action_SearchForItemName(itemName);
	if (obj == null) return;
	obj.displayableName = newLaunderedRegionName;

	RecreateHTMLFromHierarchy();
	span = document.getElementById(obj.itemName);
	if (span != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(span)', 500);
}



// ======================================================================================================================================



function Action_RenameStateType(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(anchor)', 500);
}



// ======================================================================================================================================



function Action_Delete(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = "0";
	var itemNameNodes = xmlDoc.getElementsByTagName("Request")[0].getElementsByTagName("ItemName");
	if (itemNameNodes.length > 0) itemName = itemNameNodes[0].childNodes[0].nodeValue;

	// find correct deletion point in hierarchy
	var objParent = Action_SearchForParentOfItemName(itemName);
	if (objParent == null) return;

	for (var n=0; n<objParent.children.length; n++)
	{
		if (objParent.children[n].itemName == itemName)
		{
			objParent.children.splice(n, 1);
			break;
		}
	}

	RecreateHTMLFromHierarchy();
	span = document.getElementById(objParent.itemName);
	if (span != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(span)', 500);
}



// ======================================================================================================================================



function Action_AddNewArea(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	setTimeout('SendAjaxRequest(new Array(new Array("Action", "GetRegionNamesAndIDs"), new Array("RegionType", "Area"), new Array("ParentID", 0) ))', 500);
}



// ======================================================================================================================================



function Action_AddNewRegion(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnDblClick_Hierarchy_DoTheWork(anchor, true)', 500);
}



// ======================================================================================================================================



function Action_RemoveOrphans(xmlDoc)
{
	var numOrphansRemoved = xmlDoc.getElementsByTagName("NumOrphansRemoved")[0].childNodes[0].nodeValue;
	alert(numOrphansRemoved + "orphans removed");
}



// ======================================================================================================================================



function Action_SetSchoolType(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(anchor)', 500);
}



// ======================================================================================================================================



function Action_SetSchoolPurchaseStatus(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(anchor)', 500);
}



// ======================================================================================================================================



function Action_SetSchoolExpirationDate(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(anchor)', 500);
}



// ======================================================================================================================================



function Action_SetSchoolPassword(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	var itemName = xmlDoc.getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
	anchor = document.getElementById(itemName);
	if (anchor != null)
		setTimeout('OnClick_Hierarchy_DoTheWork(anchor)', 500);
}



// ======================================================================================================================================



function SortSchoolNodes_Timestamp_PasswordFirstSet(a, b)
{
	var timestampA = a.getElementsByTagName("Timestamp_PasswordFirstSet")[0].childNodes[0].nodeValue;
	var timestampB = b.getElementsByTagName("Timestamp_PasswordFirstSet")[0].childNodes[0].nodeValue;
	return timestampB - timestampA;
}
function Action_SchoolsAssigningPassword(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	RemoveIOViewChildren();
	var div = document.getElementById("IOView");

	// containing div
	var div2 = document.createElement("div");
	div2.style.position = "fixed";
	div2.style.left = "550px";
	div2.style.top = "470px";
	div2.style.width = "490px";
	div2.style.height = "280px";
	div2.style.backgroundColor = "#f4f4f4";
	div2.style.overflow = "auto";
	div2.style.border = "thick solid #aaaaaa";
	div.appendChild(div2);

	// paragraph
	var p = document.createElement("p");
	p.style.whiteSpace = "nowrap";
	p.style.textAlign = "left";
	div2.appendChild(p);

	// data
	var schoolNodeElements = xmlDoc.getElementsByTagName("School");
	var schoolNodes = new Array();
	for (var n=0; n<schoolNodeElements.length; n++)
		schoolNodes[n] = schoolNodeElements[n];
	schoolNodes.sort(SortSchoolNodes_Timestamp_PasswordFirstSet);

	for (var n=0; n<schoolNodes.length; n++)
	{
		var schoolID = schoolNodes[n].getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
		var districtID = schoolNodes[n].getElementsByTagName("ParentID")[0].childNodes[0].nodeValue;
		var displayableName = schoolNodes[n].getElementsByTagName("DisplayableName")[0].childNodes[0].nodeValue;

		var timestamp = schoolNodes[n].getElementsByTagName("Timestamp_PasswordFirstSet")[0].childNodes[0].nodeValue;
		var date = new Date();
		date.setTime(timestamp * 1000);
		var monthNames = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.");
		var playDate = " (" + monthNames[date.getUTCMonth()] + " " + date.getUTCDate() + ") ";

		var span1 = CreateAndAddHierarchyEntry("", (n+1) + ". ", "Area", "", false); span1.style.left = "2px";
		var span2 = CreateAndAddHierarchyEntry("", playDate, "Game", "", false); span2.style.left = "2px";
		var a1 = CreateAndAddReportViewEntry(schoolID, displayableName, "School", districtID, displayableName);

		p.appendChild(span1);
		p.appendChild(span2);
		p.appendChild(a1);
		p.appendChild(document.createElement("br"));
	}
}



// ======================================================================================================================================



function SortSchoolNodes_Timestamp_MostRecentGame(a, b)
{
	var timestampA = a.getElementsByTagName("Timestamp_MostRecentGame")[0].childNodes[0].nodeValue;
	var timestampB = b.getElementsByTagName("Timestamp_MostRecentGame")[0].childNodes[0].nodeValue;
	return timestampB - timestampA;
}
function Action_SchoolsPlayingGameInLastWeek(xmlDoc)
{
	var result = xmlDoc.getElementsByTagName("Result")[0].childNodes[0].nodeValue;
	if (result == "false") return;

	RemoveIOViewChildren();
	var div = document.getElementById("IOView");

	// containing div
	var div2 = document.createElement("div");
	div2.style.position = "fixed";
	div2.style.left = "550px";
	div2.style.top = "470px";
	div2.style.width = "490px";
	div2.style.height = "280px";
	div2.style.backgroundColor = "#f4f4f4";
	div2.style.overflow = "auto";
	div2.style.border = "thick solid #aaaaaa";
	div.appendChild(div2);

	// paragraph
	var p = document.createElement("p");
	p.style.whiteSpace = "nowrap";
	p.style.textAlign = "left";
	div2.appendChild(p);

	// data
	var schoolNodeElements = xmlDoc.getElementsByTagName("School");
	var schoolNodes = new Array();
	for (var n=0; n<schoolNodeElements.length; n++)
		schoolNodes[n] = schoolNodeElements[n];
	schoolNodes.sort(SortSchoolNodes_Timestamp_MostRecentGame);

	for (var n=0; n<schoolNodes.length; n++)
	{
		var schoolID = schoolNodes[n].getElementsByTagName("ItemName")[0].childNodes[0].nodeValue;
		var districtID = schoolNodes[n].getElementsByTagName("ParentID")[0].childNodes[0].nodeValue;
		var displayableName = schoolNodes[n].getElementsByTagName("DisplayableName")[0].childNodes[0].nodeValue;

		var timestamp = schoolNodes[n].getElementsByTagName("Timestamp_MostRecentGame")[0].childNodes[0].nodeValue;
		var date = new Date();
		date.setTime(timestamp * 1000);
		var monthNames = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec.");
		var playDate = " (" + monthNames[date.getUTCMonth()] + " " + date.getUTCDate() + ") ";

		var span1 = CreateAndAddHierarchyEntry("", (n+1) + ". ", "Area", "", false); span1.style.left = "2px";
		var span2 = CreateAndAddHierarchyEntry("", playDate, "Game", "", false); span2.style.left = "2px";
		var a1 = CreateAndAddReportViewEntry(schoolID, displayableName, "School", districtID, displayableName);

		p.appendChild(span1);
		p.appendChild(span2);
		p.appendChild(a1);
		p.appendChild(document.createElement("br"));
	}
}



// ======================================================================================================================================



function AddToDisplay(text)
{
	t1 = document.createTextNode(text);
	br1 = document.createElement("br");
	p = document.getElementById("HierarchyList");

	p.appendChild(t1);
	p.appendChild(br1);
}



// ======================================================================================================================================



function AddSpanToDisplay(text)
{
	var span = document.createElement("span");
	span.appendChild(document.createTextNode("hear hear"));

	span.style.position = "relative";
	span.style.left = "-10px";
	//divL.style.top = "110px";
	//divL.style.width = "170px";
	//divL.style.height = "290px";

	//span.style.width = "200px";
	//span.style.left = "0px";
	//span.style.textAlign = "right";
	br1 = document.createElement("br");
	p = document.getElementById("HierarchyList");

	p.appendChild(span);
	p.appendChild(br1);
}



// ######################################################################################################################################
//                                                               TITLE
// ######################################################################################################################################



function CreateTitleAndShadow(x, y)
{
	for (var j=-1; j<=1; j++)
	for (var i=-1; i<=1; i++)
		CreateTitle(x+i, y+j, "black");
	CreateTitle(x, y, "red");
}



// ======================================================================================================================================



function CreateTitle(x, y, color)
{
	var span = document.createElement("span");
	ApplyStyle_Region(span);

	span.style.fontStyle = "italic";
	span.style.position = "fixed";
	span.style.left = x + "px";
	span.style.top = y + "px";
	span.style.color = color;
	span.style.fontSize = "30px";
	span.appendChild(document.createTextNode("Online Access"));
	document.body.appendChild(span);
}



// ######################################################################################################################################
//                                                               HIERARCHY DIV
// ######################################################################################################################################



function CreateHierarchyDiv()
{
	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.left = "50px";
	div.style.top = "100px";
	div.style.width = "470px";
	div.style.height = "650px";
	div.style.backgroundColor = "#f4f4f4";
	div.style.overflow = "auto";
	div.style.border = "thick solid #aaaaaa";

	var p = document.createElement("p");
	p.id = "HierarchyList";
	p.style.whiteSpace = "nowrap";

	div.appendChild(p);
	document.body.appendChild(div);
}



// ======================================================================================================================================



function CreateAndAddHierarchyEntry(itemName, displayableName, regionType, parentID, clickable)
{
	var a;
	if (clickable)
		a = document.createElement("a");
	else
		a = document.createElement("span");
	a.id = itemName;
	a.displayableName = displayableName;
	a.regionType = regionType;
	a.parentID = parentID;

	if (clickable)
	{
		// a.href = "http://www.bigbrainz.com";
        a.href = "#";
		a.onclick = OnClick_Hierarchy;
		a.onmouseover = OnMouseOver_Hierarchy;
		a.onmouseout = OnMouseOut_Hierarchy;
		a.onmouseup = OnMouseOver_Hierarchy;
		a.onmousedown = OnMouseDown_Hierarchy;
	}
	a.style.position = "relative";
	a.style.left = GetPrefixSpacingFromRegionType(regionType, false) + "px";

	ApplyStyle_AllRegions(a);
	ApplyStyle_Region(a, regionType);
	a.colorNormal = a.style.color;
	a.colorOver = "#aaaaaa";
	a.colorDown = "#dddddd";

	a.appendChild(document.createTextNode(displayableName));
	return a;
}



// ======================================================================================================================================



function CreateAndAddHierarchyExpander(itemName, displayableName, regionType, parentID, hasChildren)
{
	var a = document.createElement("a");
	a.id = itemName;
	a.displayableName = displayableName;
	a.regionType = regionType;
	a.parentID = parentID;

	// a.href = "http://www.bigbrainz.com";
    a.href = "#";
	a.onclick = OnDblClick_Hierarchy;
	a.onmouseover = OnMouseOver_Hierarchy;
	a.onmouseout = OnMouseOut_Hierarchy;
	a.onmouseup = OnMouseOver_Hierarchy;
	a.onmousedown = OnMouseDown_Hierarchy;
	a.style.position = "relative";
	a.style.left = GetPrefixSpacingFromRegionType(regionType, true) + "px";

	ApplyStyle_AllRegions(a);
	ApplyStyle_Region(a, regionType);
	a.style.color = "#ff0000";
	a.colorNormal = a.style.color;
	a.colorOver = "#aaaaaa";
	a.colorDown = "#dddddd";

	if (hasChildren)
		a.appendChild(document.createTextNode("-"));
	else
		a.appendChild(document.createTextNode("+"));

	return a;
}



// ======================================================================================================================================



function CreateAndAddReportViewEntry(itemName, displayableName, regionType, parentID, menuName)
{
	var a = CreateAndAddHierarchyEntry(itemName, displayableName, regionType, parentID, true);
	a.displayableName = menuName;
	a.style.left = "2px";
	a.onclick = OnClick_ReportView;

	return a;
}



// ======================================================================================================================================



function GetPrefixSpacingFromRegionType(regionType, isExpander)
{
	var retVal = 0;
	if (!isExpander) retVal += 5;
	var spacingPerLevel = 15;

	retVal += spacingPerLevel; if (regionType == "Area") return retVal;
	retVal += spacingPerLevel; if (regionType == "Country") return retVal;
	retVal += spacingPerLevel; if (regionType == "State") return retVal;
	retVal += spacingPerLevel; if (regionType == "District") return retVal;
	retVal += spacingPerLevel; if (regionType == "School") return retVal;
	retVal += spacingPerLevel; if (regionType == "Class") return retVal;
	retVal += spacingPerLevel; if (regionType == "Game") return retVal;

	retVal = 0;
	if (!isExpander) retVal += 5;

	return retVal;
}



// ######################################################################################################################################
//                                                               DATA VIEW DIVS
// ######################################################################################################################################



function CreateDataViewDivs()
{
	// containing div
	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.left = "550px";
	div.style.top = "100px";
	div.style.width = "490px";
	div.style.height = "300px";
	div.style.backgroundColor = "#f4f4f4";
	div.style.overflow = "auto";
	div.style.border = "thick solid #aaaaaa";
	document.body.appendChild(div);

	// left div
	var divL = document.createElement("div");
	divL.style.position = "fixed";
	divL.style.left = "560px";
	divL.style.top = "110px";
	divL.style.width = "485px";
	divL.style.height = "290px";
	divL.style.overflow = "auto";
	//divL.style.backgroundColor = "#ffdddd";

	var pL = document.createElement("p");
	pL.id = "DataViewL";
	pL.style.whiteSpace = "nowrap";
	pL.style.textAlign = "left";
	pL.style.lineHeight = ".9";

	divL.appendChild(pL);
	document.body.appendChild(divL);
}



// ======================================================================================================================================



function ClearDataView()
{
	var pL = document.getElementById("DataViewL");
	while (pL.hasChildNodes())
		pL.removeChild(pL.lastChild);
}



// ======================================================================================================================================



function NVP(nameText, valueText, valueFontWeight) { this.nameText = nameText; this.valueText = valueText; this.valueFontWeight = valueFontWeight; }
function AddLineToDataView(nvp)
{
	// determine position (because I can't right-justify a span to a specifed pixel position)
	var dxL = 0;
	var posL = 20;
	if (nvp.nameText == "Region Type: ") posL = 100;
	if (nvp.nameText == "Region ID: ") posL = 115;
	if (nvp.nameText == "ParentID: ") posL = 122;
	if (nvp.nameText == "Area: ") posL = 144;
	if (nvp.nameText == "Country: ") posL = 127;
	if (nvp.nameText == "ChildType: ") posL = 114;
	if (nvp.nameText == "State: ") posL = 142;
	if (nvp.nameText == "District: ") posL = 133;
	if (nvp.nameText == "School: ") posL = 132;
	if (nvp.nameText == "Class: ") posL = 139;
	if (nvp.nameText == "Game: ") posL = 137;
	if (nvp.nameText == "Data: ") posL = 144;

	if (nvp.nameText == "SchoolType: ") posL = 105;
	if (nvp.nameText == "PurchaseStatus: ") posL = 84;
	if (nvp.nameText == "ExpirationDate: ") posL = 89;
	if (nvp.nameText == "DefaultStudentPassword: ") posL = 35;
	if (nvp.nameText == "Passphrase: ") posL = 105;
	if (nvp.nameText == "Password: ") posL = 116;
	if (nvp.nameText == "Timestamp_FirstGame: ") posL = 47;
	if (nvp.nameText == "Timestamp_MostRecentGame: ") posL = 5;
	if (nvp.nameText == "Timestamp_PasswordFirstSet: ") posL = 8;

	// James recently added
	if (nvp.nameText == "Contacts_Name: ") posL = 82;
	if (nvp.nameText == "Contacts_Title: ") posL = 91;
	if (nvp.nameText == "Contacts_EmailAddress: ") posL = 39;
	if (nvp.nameText == "Contacts_PhoneNumber: ") posL = 35;
	if (nvp.nameText == "DisclosePassword: ") posL = 68;
	if (nvp.nameText == "CustomStudentPassword: ") posL = 32;
	if (nvp.nameText == "StudentsCreateGame: ") posL = 51;

	if (nvp.nameText == "DeletionDate: ") posL = 50;


	// left span
	var spanL = document.createElement("span");
	ApplyStyle_AllRegions(spanL);
	ApplyStyle_Region(spanL, "Area");
	spanL.style.fontWeight = "normal";
	spanL.appendChild(document.createTextNode(nvp.nameText));
	spanL.style.position = "absolute";
	spanL.style.left = (posL + dxL) + "px";

	// right span
	var spanR = document.createElement("span");
	ApplyStyle_AllRegions(spanR);
	ApplyStyle_Region(spanR, "Area");
	spanR.style.fontWeight = "normal";
	if (nvp.valueFontWeight == "bold")
		spanR.style.fontWeight = "bold";
	spanR.appendChild(document.createTextNode(nvp.valueText));
	spanR.style.position = "absolute";
	spanR.style.left = "180px";

	// left paragraph
	var pL = document.getElementById("DataViewL");
	pL.appendChild(spanL);
	pL.appendChild(spanR);
	pL.appendChild(document.createElement("br"));
}



// ######################################################################################################################################
//                                                               TASK OPTIONS
// ######################################################################################################################################



function CreateTaskSelection()
{
	// create label span
	//var span = document.createElement("span");
	//span.style.position = "fixed";
	//span.style.left = "570px";
	//span.style.top = "424px";
	//ApplyStyle_AllRegions(span);
	//ApplyStyle_Region(span, "Area");
	//span.appendChild(document.createTextNode("Select Task: "));
	//document.body.appendChild(span);

	// create selection
	var select = document.createElement("select");
	select.id = "TaskSelector";
	select.style.position = "fixed";
	select.style.left = "560px";
	select.style.top = "420px";
	select.style.width = "380px";
	//select.style.height = "300px";
	document.body.appendChild(select);
	CreateTaskSelectOptions(null, true); // in Tasks.js

	// create button
	var button = document.createElement("button");
	button.style.position = "fixed";
	button.style.left = "970px";
	button.style.top = "419px";
	button.style.width = "80px";
	button.onclick = OnClick_DoItButton;
//	button.type = "button"; // IE won't allow this for some reason
	button.appendChild(document.createTextNode("Do It"));
	document.body.appendChild(button);
}



// ######################################################################################################################################
//                                                               IO VIEW DIVS
// ######################################################################################################################################



function CreateIOViewDiv()
{
	var div = document.createElement("div");
	div.id = "IOView";
	document.body.appendChild(div);
}



// ======================================================================================================================================



function RemoveIOViewChildren()
{
	var div = document.getElementById("IOView");
	if (div)
		while (div.hasChildNodes())
			div.removeChild(div.lastChild);
}



// ======================================================================================================================================



// obj.itemName is a state ID
function BuildDistrictSchoolInput(obj)
{
	RemoveIOViewChildren();
	var div = document.getElementById("IOView");

	// label
	var span = document.createElement("span");
	span.style.position = "fixed";
	span.style.left = "555px";
	span.style.top = "470px";
	ApplyStyle_AllRegions(span);
	ApplyStyle_Region(span, "Area");
	span.style.fontWeight = "normal";
	span.appendChild(document.createTextNode("Enter list of district/school pairs (end each with LF):"));
	div.appendChild(span);

	// input
	var textarea = document.createElement("textarea");
	textarea.id = "IOViewTextarea";
	textarea.stateID = obj.itemName;
	textarea.style.position = "fixed";
	textarea.style.left = "550px";
	textarea.style.top = "490px";
	textarea.style.width = "495px";
	textarea.style.height = "235px";
	div.appendChild(textarea);
	textarea.focus();

	// submit button
	var button1 = document.createElement("button");
	button1.style.position = "fixed";
	button1.style.left = "690px";
	button1.style.top = "735px";
	button1.style.width = "70px";
	button1.onclick = OnClick_SubmitDistrictsAndSchoolsButton;
//	button1.type = "button"; // IE won't allow this for some reason
	button1.appendChild(document.createTextNode("Submit"));
	div.appendChild(button1);

	// cancel button
	var button2 = document.createElement("button");
	button2.style.position = "fixed";
	button2.style.left = "820px";
	button2.style.top = "735px";
	button2.style.width = "70px";
	button2.onclick = OnClick_CancelDistrictsAndSchoolsButton;
//	button2.type = "button"; // IE won't allow this for some reason
	button2.appendChild(document.createTextNode("Cancel"));
	div.appendChild(button2);
}



// ======================================================================================================================================



function OnClick_SubmitDistrictsAndSchoolsButton()
{
	var textarea = document.getElementById("IOViewTextarea");

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "AddNewDistrictSchoolPairs"),
		new Array("ItemName", textarea.stateID),
		new Array("List", textarea.value),
		new Array("DoNotIncludeRequestInResponse", "true")
	));

	RemoveIOViewChildren();
}



// ======================================================================================================================================



function OnClick_CancelDistrictsAndSchoolsButton()
{
	RemoveIOViewChildren();
}



// ======================================================================================================================================



// obj.itemName is a school ID
function BuildSchoolTypeSelection(obj)
{
	RemoveIOViewChildren();
	var div = document.getElementById("IOView");

	// label
	var span = document.createElement("span");
	span.style.position = "fixed";
	span.style.left = "700px";
	span.style.top = "470px";
	ApplyStyle_AllRegions(span);
	ApplyStyle_Region(span, "Area");
	span.style.fontWeight = "normal";
	span.style.fontSize = "15px";
	if (schoolOrDistrict == "school")
		span.appendChild(document.createTextNode("Select school type:"));
	else
		span.appendChild(document.createTextNode("Select type for all schools in district:"));
	div.appendChild(span);

	// input
	var p = document.createElement("p");
	p.style.position = "fixed";
	p.style.left = "740px";
	p.style.top = "490px";
	div.appendChild(p);

	var input1 = document.createElement("input");
	input1.id = "IOViewSchoolTypeSelectionInput1";
	input1.type = "radio";
	input1.name = "IOViewSchoolTypeSelection";
	input1.value = "public";
	input1.schoolID = obj.itemName;
	p.appendChild(input1);
	p.appendChild(document.createTextNode(" public"));
	p.appendChild(document.createElement("br"));
	var input2 = document.createElement("input");
	input2.id = "IOViewSchoolTypeSelectionInput2";
	input2.type = "radio";
	input2.name = "IOViewSchoolTypeSelection";
	input2.value = "private";
	p.appendChild(input2);
	p.appendChild(document.createTextNode(" private"));
	p.appendChild(document.createElement("br"));
	var input3 = document.createElement("input");
	input3.id = "IOViewSchoolTypeSelectionInput3";
	input3.type = "radio";
	input3.name = "IOViewSchoolTypeSelection";
	input3.value = "charter";
	p.appendChild(input3);
	p.appendChild(document.createTextNode(" charter"));
	p.appendChild(document.createElement("br"));
	var input4 = document.createElement("input");
	input4.id = "IOViewSchoolTypeSelectionInput4";
	input4.type = "radio";
	input4.name = "IOViewSchoolTypeSelection";
	input4.value = "other";
	p.appendChild(input4);
	p.appendChild(document.createTextNode(" other"));

	// submit button
	var button1 = document.createElement("button");
	button1.style.position = "fixed";
	button1.style.left = "690px";
	button1.style.top = "600px";
	button1.style.width = "70px";
	button1.onclick = OnClick_SubmitSchoolTypeSelectionButton;
//	button1.type = "button"; // IE won't allow this for some reason
	button1.appendChild(document.createTextNode("Submit"));
	div.appendChild(button1);

	// cancel button
	var button2 = document.createElement("button");
	button2.style.position = "fixed";
	button2.style.left = "780px";
	button2.style.top = "600px";
	button2.style.width = "70px";
	button2.onclick = OnClick_CancelSchoolTypeSelectionButton;
//	button2.type = "button"; // IE won't allow this for some reason
	button2.appendChild(document.createTextNode("Cancel"));
	div.appendChild(button2);
}



// ======================================================================================================================================



function OnClick_SubmitSchoolTypeSelectionButton()
{
	var input1 = document.getElementById("IOViewSchoolTypeSelectionInput1");
	var input2 = document.getElementById("IOViewSchoolTypeSelectionInput2");
	var input3 = document.getElementById("IOViewSchoolTypeSelectionInput3");
	var input4 = document.getElementById("IOViewSchoolTypeSelectionInput4");

	var newSchoolType = input1.value;
	if (input1.checked) newSchoolType = input1.value;
	if (input2.checked) newSchoolType = input2.value;
	if (input3.checked) newSchoolType = input3.value;
	if (input4.checked) newSchoolType = input4.value;

	// send Ajax request
	if (schoolOrDistrict == "school")
		SendAjaxRequest(new Array(
			new Array("Action", "SetSchoolType"),
			new Array("ItemName", input1.schoolID),
			new Array("NewSchoolType", newSchoolType)
		));
	else
		SendAjaxRequest(new Array(
			new Array("Action", "SetDistrictType"),
			new Array("ItemName", input1.schoolID),
			new Array("NewDistrictType", newSchoolType)
		));

	RemoveIOViewChildren();
}



// ======================================================================================================================================



function OnClick_CancelSchoolTypeSelectionButton()
{
	RemoveIOViewChildren();
}



// ======================================================================================================================================



// obj.itemName is a school ID
function BuildUseLoginSelection(obj)
{
    RemoveIOViewChildren();
    var div = document.getElementById("IOView");

    // label
    var span = document.createElement("span");
    span.style.position = "fixed";
    span.style.left = "700px";
    span.style.top = "470px";
    ApplyStyle_AllRegions(span);
    ApplyStyle_Region(span, "Area");
    span.style.fontWeight = "normal";
    span.style.fontSize = "15px";
    if (schoolOrDistrict == "school")
        span.appendChild(document.createTextNode("Does this school use usernames and passwords:"));
    else
        span.appendChild(document.createTextNode("Does this district use usernames and passwrods:"));
    div.appendChild(span);

    // input
    var p = document.createElement("p");
    p.style.position = "fixed";
    p.style.left = "740px";
    p.style.top = "490px";
    div.appendChild(p);

    var input1 = document.createElement("input");
    input1.id = "IOViewUseLoginSelectionInput1";
    input1.type = "radio";
    input1.name = "IOViewUseLoginSelection";
    input1.value = "public";
    input1.schoolID = obj.itemName;
    p.appendChild(input1);
    p.appendChild(document.createTextNode(" Yes"));
    p.appendChild(document.createElement("br"));
    var input2 = document.createElement("input");
    input2.id = "IOViewUseLoginSelectionInput2";
    input2.type = "radio";
    input2.name = "IOViewUseLoginSelection";
    input2.value = "private";
    p.appendChild(input2);
    p.appendChild(document.createTextNode(" No"));
    p.appendChild(document.createElement("br"));

    // submit button
    var button1 = document.createElement("button");
    button1.style.position = "fixed";
    button1.style.left = "690px";
    button1.style.top = "600px";
    button1.style.width = "70px";
    button1.onclick = OnClick_SubmitUseLoginSelectionButton;
//	button1.type = "button"; // IE won't allow this for some reason
    button1.appendChild(document.createTextNode("Submit"));
    div.appendChild(button1);

    // cancel button
    var button2 = document.createElement("button");
    button2.style.position = "fixed";
    button2.style.left = "780px";
    button2.style.top = "600px";
    button2.style.width = "70px";
    button2.onclick = OnClick_CancelUseLoginSelectionButton;
//	button2.type = "button"; // IE won't allow this for some reason
    button2.appendChild(document.createTextNode("Cancel"));
    div.appendChild(button2);
}



// ======================================================================================================================================



function OnClick_SubmitUseLoginSelectionButton()
{
    var input1 = document.getElementById("IOViewUseLoginSelectionInput1");
    var input2 = document.getElementById("IOViewUseLoginSelectionInput2");

    var newUseLogin = input1.value;
    if (input1.checked) newUseLogin = true;
    if (input2.checked) newUseLogin = false;

    // send Ajax request
    if (schoolOrDistrict == "school")
        SendAjaxRequest(new Array(
            new Array("Action", "SetUseLogin"),
            new Array("ItemName", input1.schoolID),
            new Array("NewUseLogin", newUseLogin),
			new Array("Index", 'School_Index')
        ));
    else
        SendAjaxRequest(new Array(
            new Array("Action", "SetUseLogin"),
            new Array("ItemName", input1.schoolID),
            new Array("NewUseLogin", newUseLogin),
            new Array("Index", 'District_Index')
        ));

    RemoveIOViewChildren();
}



// ======================================================================================================================================



function OnClick_CancelUseLoginSelectionButton()
{
    RemoveIOViewChildren();
}



// ======================================================================================================================================// obj.itemName is a school ID



function BuildSchoolPurchaseStatusSelection(obj)
{
	RemoveIOViewChildren();
	var div = document.getElementById("IOView");

	// label
	var span = document.createElement("span");
	span.style.position = "fixed";
	span.style.left = "700px";
	span.style.top = "470px";
	ApplyStyle_AllRegions(span);
	ApplyStyle_Region(span, "Area");
	span.style.fontWeight = "normal";
	span.style.fontSize = "15px";
	if (schoolOrDistrict == "school")
		span.appendChild(document.createTextNode("Select school purchase status:"));
	else
		span.appendChild(document.createTextNode("Select purchase status for all schools in district:"));
	div.appendChild(span);

	// input
	var p = document.createElement("p");
	p.style.position = "fixed";
	p.style.left = "740px";
	p.style.top = "490px";
	div.appendChild(p);

	var input1 = document.createElement("input");
	input1.id = "IOViewSchoolPurchaseStatusSelectionInput1";
	input1.type = "radio";
	input1.name = "IOViewSchoolPurchaseStatusSelection";
	input1.value = "free";
	input1.schoolID = obj.itemName;
	p.appendChild(input1);
	p.appendChild(document.createTextNode(" free"));
	p.appendChild(document.createElement("br"));
	var input3 = document.createElement("input");
	input3.id = "IOViewSchoolPurchaseStatusSelectionInput3";
	input3.type = "radio";
	input3.name = "IOViewSchoolPurchaseStatusSelection";
	input3.value = "paid";
	p.appendChild(input3);
	p.appendChild(document.createTextNode(" paid"));
	p.appendChild(document.createElement("br"));

	// submit button
	var button1 = document.createElement("button");
	button1.style.position = "fixed";
	button1.style.left = "690px";
	button1.style.top = "600px";
	button1.style.width = "70px";
	button1.onclick = OnClick_SubmitSchoolPurchaseStatusSelectionButton;
//	button1.type = "button"; // IE won't allow this for some reason
	button1.appendChild(document.createTextNode("Submit"));
	div.appendChild(button1);

	// cancel button
	var button2 = document.createElement("button");
	button2.style.position = "fixed";
	button2.style.left = "780px";
	button2.style.top = "600px";
	button2.style.width = "70px";
	button2.onclick = OnClick_CancelSchoolPurchaseStatusSelectionButton;
//	button2.type = "button"; // IE won't allow this for some reason
	button2.appendChild(document.createTextNode("Cancel"));
	div.appendChild(button2);
}



// ======================================================================================================================================



function OnClick_SubmitSchoolPurchaseStatusSelectionButton()
{
	var input1 = document.getElementById("IOViewSchoolPurchaseStatusSelectionInput1");
	// var input2 = document.getElementById("IOViewSchoolPurchaseStatusSelectionInput2");
	var input3 = document.getElementById("IOViewSchoolPurchaseStatusSelectionInput3");
	// var input4 = document.getElementById("IOViewSchoolPurchaseStatusSelectionInput4");

	var newSchoolPurchaseStatus = input1.value;
	if (input1.checked) newSchoolPurchaseStatus = input1.value;
	// if (input2.checked) newSchoolPurchaseStatus = input2.value;
	if (input3.checked) newSchoolPurchaseStatus = input3.value;
	// if (input4.checked) newSchoolPurchaseStatus = input4.value;

	// send Ajax request
	if (schoolOrDistrict == "school")
		SendAjaxRequest(new Array(
			new Array("Action", "SetSchoolPurchaseStatus"),
			new Array("ItemName", input1.schoolID),
			new Array("NewSchoolPurchaseStatus", newSchoolPurchaseStatus)
		));
	else
		SendAjaxRequest(new Array(
			new Array("Action", "SetDistrictPurchaseStatus"),
			new Array("ItemName", input1.schoolID),
			new Array("NewDistrictPurchaseStatus", newSchoolPurchaseStatus)
		));

	RemoveIOViewChildren();
}



// ======================================================================================================================================



function OnClick_CancelSchoolPurchaseStatusSelectionButton()
{
	RemoveIOViewChildren();
}



// ======================================================================================================================================



// obj.itemName is a school ID
function BuildSchoolExpirationDateSelection(obj)
{
	RemoveIOViewChildren();
	var div = document.getElementById("IOView");
	var IOX = 560;

	// label
	var span = document.createElement("span");
	span.style.position = "fixed";
	span.style.left = IOX + "px";
	span.style.top = "490px";
	ApplyStyle_AllRegions(span);
	ApplyStyle_Region(span, "Area");
	span.style.fontWeight = "normal";
	span.style.fontSize = "14px";
	span.appendChild(document.createTextNode("Specify expiration date:"));
	div.appendChild(span);

	// input field
	var input1 = document.createElement("input");
	input1.id = "IOViewSchoolExpirationDateSelectionInput1";
	input1.style.position = "fixed";
	input1.style.left = (IOX + 150) + "px";
	input1.style.top = "487px";
	input1.style.width = "100px";
	input1.type = "text";
	input1.schoolID = obj.itemName;
	div.appendChild(input1);

	// expires in 30 days
	var a1 = document.createElement("a");
	a1.style.position = "fixed";
	a1.style.left = (IOX + 265) + "px";
	a1.style.top = "490px";
	a1.appendChild(document.createTextNode("30 Days"));
	a1.href = "javascript:PopulateDateInNDays(30);";
	div.appendChild(a1);

	// expires in 100 days
	var a2 = document.createElement("a");
	a2.style.position = "fixed";
	a2.style.left = (IOX + 330) + "px";
	a2.style.top = "490px";
	a2.appendChild(document.createTextNode("100 Days"));
	a2.href = "javascript:PopulateDateInNDays(100);";
	div.appendChild(a2);

	// expires in 1 year
	var a3 = document.createElement("a");
	a3.style.position = "fixed";
	a3.style.left = (IOX + 402) + "px";
	a3.style.top = "490px";
	a3.appendChild(document.createTextNode("1 Year"));
	a3.href = "javascript:PopulateDateInNDays(365);";
	div.appendChild(a3);

	// calendar anchor and thumbnail image
	cal = new calendar2(input1);
	cal.year_scroll = true;
	cal.time_comp = false;
	var a4 = document.createElement("a");
	a4.href = "javascript:cal.popup();";
	div.appendChild(a4);

	var img = document.createElement("img");
	img.src = "calendar_img/cal.gif";
	img.style.position = "fixed";
	img.style.left = (IOX + 465) + "px";
	img.style.top = "490px";
//	img.width = "16px";
//	img.height = "16px";
//	img.border = "0";
	img.alt = "Calendar";
	a4.appendChild(img);

	// submit button
	var button1 = document.createElement("button");
	button1.style.position = "fixed";
	button1.style.left = "710px";
	button1.style.top = "525px";
	button1.style.width = "70px";
	button1.onclick = OnClick_SubmitSchoolExpirationDateSelectionButton;
//	button1.type = "button"; // IE won't allow this for some reason
	button1.appendChild(document.createTextNode("Submit"));
	div.appendChild(button1);

	// cancel button
	var button2 = document.createElement("button");
	button2.style.position = "fixed";
	button2.style.left = "800px";
	button2.style.top = "525px";
	button2.style.width = "70px";
	button2.onclick = OnClick_CancelSchoolExpirationDateSelectionButton;
//	button2.type = "button"; // IE won't allow this for some reason
	button2.appendChild(document.createTextNode("Cancel"));
	div.appendChild(button2);
}



// ======================================================================================================================================



function OnClick_SubmitSchoolExpirationDateSelectionButton()
{
	var input1 = document.getElementById("IOViewSchoolExpirationDateSelectionInput1");

	if (input1 && input1.value != "")
	{
		var ms = Date.parse(input1.value);
		var seconds = ms / 1000;

		// send Ajax request
		if (schoolOrDistrict == "school")
			SendAjaxRequest(new Array(
				new Array("Action", "SetSchoolExpirationDate"),
				new Array("ItemName", input1.schoolID),
				new Array("NewSchoolExpirationDate", seconds)
			));
		else
			SendAjaxRequest(new Array(
				new Array("Action", "SetDistrictExpirationDate"),
				new Array("ItemName", input1.schoolID),
				new Array("NewDistrictExpirationDate", seconds)
			));
	}

	RemoveIOViewChildren();
}



// ======================================================================================================================================



function OnClick_CancelSchoolExpirationDateSelectionButton()
{
	RemoveIOViewChildren();
}



// ======================================================================================================================================



function PopulateDateInNDays(numDaysFromToday)
{
	var date = new Date();
	if (numDaysFromToday == 365)
	{
		var utcFullYear = date.getUTCFullYear();
		date.setUTCFullYear(utcFullYear + 1);
	}
	else
	{
		var ms = date.getTime();
		ms += numDaysFromToday * 24 * 60 * 60 * 1000;
		date.setTime(ms);
	}
	var month = date.getUTCMonth() + 1;
	var day = date.getUTCDate();
	var year = date.getUTCFullYear();
	document.getElementById("IOViewSchoolExpirationDateSelectionInput1").value = month + "/" + day + "/" + year;
}



// ######################################################################################################################################
//                                                               STYLES
// ######################################################################################################################################



function ApplyStyle_AllRegions(element)
{
	element.style.fontFamily = "Ariel, sans-serif";
	element.style.fontWeight = "bold";
	element.style.fontStyle = "normal";
	element.style.fontSize = "12px";
	element.style.textDecoration = "none";
	element.style.letterSpacing = "0px";
}



// ======================================================================================================================================



function ApplyStyle_Region(element, regionType)
{
	switch (regionType)
	{
	case "Planet":   element.style.color = "#0000ff"; break;
	case "Area":     element.style.color = "#000000"; break;
	case "Country":  element.style.color = "#006600"; break;
	case "State":    element.style.color = "#000088"; break;
	case "District": element.style.color = "#660066"; break;
	case "School":   element.style.color = "#4444ff"; break;
	case "Class":    element.style.color = "#cc6600"; break;
	case "Game":     element.style.color = "#aa0000"; break;
	}
}



// ######################################################################################################################################
//                                                               BOX
// ######################################################################################################################################



function DrawBox(x, y, w, h, color)
{
	var div = document.createElement("div");
	div.style.position = "fixed";
	div.style.left = x + "px";
	div.style.top = y + "px";
	div.style.width = w + "px";
	div.style.height = h + "px";
	div.style.backgroundColor = "#" + color;
	document.body.appendChild(div);
}



// ======================================================================================================================================



// ######################################################################################################################################
//                                                               ENCODE/DECODE URL
// ######################################################################################################################################



// from http://www.phpbuilder.com/board/showthread.php?t=10318476
function urlEncode(str)
{
	str = escape(str);
	str = str.replace('+', '%2B');
	str = str.replace('%20', '+');
	str = str.replace('*', '%2A');
	str = str.replace('/', '%2F');
	str = str.replace('@', '%40');
	return str;
}

function urlDecode(str)
{
	str = str.replace('+', ' ');
	str = unescape(str);
	return str;
}


// ######################################################################################################################################
//                                                               HIERARCHY EVENTS
// ######################################################################################################################################



function OnClick_Hierarchy()
{
	return OnClick_Hierarchy_DoTheWork(this);
}



// ======================================================================================================================================



function OnClick_Hierarchy_DoTheWork(clickedSpan)
{
	// send Ajax request
	if (clickedSpan.regionType != "Planet")
		SendAjaxRequest(new Array(
			new Array("Action", "GetNameValuePairs"),
			new Array("RegionType", clickedSpan.regionType),
			new Array("ID", clickedSpan.id)
		));
	CreateTaskSelectOptions(clickedSpan, true);

	return false;
}



// ======================================================================================================================================



function OnClick_ReportView()
{
	return OnClick_ReportView_DoTheWork(this);
}



// ======================================================================================================================================



function OnClick_ReportView_DoTheWork(clickedSpan)
{
	// send Ajax request
	if (clickedSpan.regionType != "Planet")
		SendAjaxRequest(new Array(
			new Array("Action", "GetNameValuePairs"),
			new Array("RegionType", clickedSpan.regionType),
			new Array("ID", clickedSpan.id)
		));
	CreateTaskSelectOptions(clickedSpan, false);

	return false;
}



// ======================================================================================================================================



function OnDblClick_Hierarchy()
{
	return OnDblClick_Hierarchy_DoTheWork(this, false);
}



// ======================================================================================================================================



function OnDblClick_Hierarchy_DoTheWork(clickedAnchor, expandAlways)
{
	clickedAnchor.style.color = clickedAnchor.colorNormal;

	// check for children
	var obj = Action_SearchForItemName(clickedAnchor.id);
	if (obj == null) return false;

	if (expandAlways)
	{
		obj.children = new Array();
	}
	else
	{
		if (obj.children.length > 0)
		{
			obj.children = new Array();
			RecreateHTMLFromHierarchy();
			return false;
		}
	}

	// send Ajax request
	if (clickedAnchor.regionType != "Game")
		SendAjaxRequest(new Array(
			new Array("Action", "GetRegionNamesAndIDs"),
			new Array("RegionType", GetChildRegion(clickedAnchor.regionType)),
			new Array("ParentID", clickedAnchor.regionType == "Planet" ? "0" : clickedAnchor.id)
		));

	return false;
}



// ======================================================================================================================================



function GetChildRegion(regionType)
{
	retVal = "Area";
	switch (regionType)
	{
	case "Planet":   retVal = "Area"; break;
	case "Area":     retVal = "Country"; break;
	case "Country":  retVal = "State"; break;
	case "State":    retVal = "District"; break;
	case "District": retVal = "School"; break;
	case "School":   retVal = "Class"; break;
	case "Class":    retVal = "Game"; break;
	}
	return retVal;
}



// ======================================================================================================================================



function OnMouseDown_Hierarchy()
{
	this.style.color = this.colorDown;
	return false;
}



// ======================================================================================================================================



function OnMouseOver_Hierarchy()
{
	this.style.color = this.colorOver;
	return false;
}



// ======================================================================================================================================



function OnMouseOut_Hierarchy()
{
	this.style.color = this.colorNormal;
	return false;
}
