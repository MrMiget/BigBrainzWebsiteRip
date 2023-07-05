// Tasks.js



// ######################################################################################################################################
//                                                               GLOBALS
// ######################################################################################################################################






// ######################################################################################################################################
//                                                               SETUP TASK OPTIONS
// ######################################################################################################################################



function CreateTaskSelectOptions(clickedSpan, removeIOViewChildren)
{
	var select = document.getElementById("TaskSelector");
	while (select.hasChildNodes())
		select.removeChild(select.lastChild);

	// create click-specific options
	if (clickedSpan != null)
	{
		var displayedName = clickedSpan.displayableName;

		// 'select' label
		var option = document.createElement("option");
		option.value = "none";
		option.appendChild(document.createTextNode("Select Task for '" + displayedName + "'"));
		select.appendChild(option);

		// ######################################################
		// SCHOOL STATUS OPTIONS
		// ######################################################

		if (clickedSpan.regionType == "School")
		{
			var optGroup_School = document.createElement("optgroup");
			optGroup_School.label = "School Options";

			// set school type (public, private, charter, other)
			option = document.createElement("option");
			option.value = GetClickArgs("SetSchoolType", clickedSpan);
			option.appendChild(document.createTextNode("Set school type - (Public, Private, Charter, Other)"));
			optGroup_School.appendChild(option);

			// set school purchase status (free, demo, paid, permanent)
			option = document.createElement("option");
			option.value = GetClickArgs("SetSchoolPurchaseStatus", clickedSpan);
			option.appendChild(document.createTextNode("Set school purchase status - (Free, Paid)"));
			optGroup_School.appendChild(option);

			// set school expiration date
			option = document.createElement("option");
			option.value = GetClickArgs("SetSchoolExpirationDate", clickedSpan);
			option.appendChild(document.createTextNode("Set school expiration date"));
			optGroup_School.appendChild(option);

			// set school password
			option = document.createElement("option");
			option.value = GetClickArgs("SetSchoolPassword", clickedSpan);
			option.appendChild(document.createTextNode("Set school password"));
			optGroup_School.appendChild(option);

            // set school sitecode
            option = document.createElement("option");
            option.value = GetClickArgs("SetSchoolSitecode", clickedSpan);
            option.appendChild(document.createTextNode("Set School sitecode"));
            optGroup_School.appendChild(option);

            // set school uselogin
            option = document.createElement("option");
            option.value = GetClickArgs("SetSchoolUseLogin", clickedSpan);
            option.appendChild(document.createTextNode("Set School UseLogin"));
            optGroup_School.appendChild(option);
            select.appendChild(optGroup_School);
		}


		// ######################################################
		// DISTRICT STATUS OPTIONS
		// ######################################################

		if (clickedSpan.regionType == "District")
		{
			var optGroup_District = document.createElement("optgroup");
			optGroup_District.label = "District Options";

			// set district type (public, private, charter, other)
			option = document.createElement("option");
			option.value = GetClickArgs("SetDistrictType", clickedSpan);
			option.appendChild(document.createTextNode("Set all schools type - (Public, Private, Charter, Other)"));
			optGroup_District.appendChild(option);

			// set district purchase status (free, demo, paid, permanent)
			option = document.createElement("option");
			option.value = GetClickArgs("SetDistrictPurchaseStatus", clickedSpan);
			option.appendChild(document.createTextNode("Set all schools purchase status - (Free, Paid)"));
			optGroup_District.appendChild(option);

			// set district expiration date
			option = document.createElement("option");
			option.value = GetClickArgs("SetDistrictExpirationDate", clickedSpan);
			option.appendChild(document.createTextNode("Set all schools expiration date"));
			optGroup_District.appendChild(option);

            // set district password
            option = document.createElement("option");
            option.value = GetClickArgs("SetDistrictPassword", clickedSpan);
            option.appendChild(document.createTextNode("Set District password"));
            optGroup_District.appendChild(option);

            // set district sitecode
            option = document.createElement("option");
            option.value = GetClickArgs("SetDistrictSitecode", clickedSpan);
            option.appendChild(document.createTextNode("Set District sitecode"));
            optGroup_District.appendChild(option);
			select.appendChild(optGroup_District);

            // set district uselogin
            option = document.createElement("option");
            option.value = GetClickArgs("SetDistrictUseLogin", clickedSpan);
            option.appendChild(document.createTextNode("Set District UseLogin"));
            optGroup_District.appendChild(option);
            select.appendChild(optGroup_District);

        }


		// ######################################################
		// ADD / RENAME / DELETE
		// ######################################################

		var optGroup_AddRenameDelete = document.createElement("optgroup");
		optGroup_AddRenameDelete.label = "Add / Rename / Delete";

		// add new
		if (clickedSpan.regionType != "Game")
		{
			option = document.createElement("option");
			option.value = GetClickArgs("AddNewRegion", clickedSpan);
			option.appendChild(document.createTextNode("Add new " + GetChildRegion(clickedSpan.regionType).toLowerCase()));
			optGroup_AddRenameDelete.appendChild(option);
		}

		// add new district/school pairs
		if (clickedSpan.regionType == "State")
		{
			option = document.createElement("option");
			option.value = GetClickArgs("AddNewDistrictSchoolPairs", clickedSpan);
			option.appendChild(document.createTextNode("Add new district/school pairs"));
			optGroup_AddRenameDelete.appendChild(option);
		}

		// rename
		option = document.createElement("option");
		option.value = GetClickArgs("Rename", clickedSpan);
		option.appendChild(document.createTextNode("Rename " + "'" + displayedName + "'"));
		optGroup_AddRenameDelete.appendChild(option);

		// rename 'State' type
		if (clickedSpan.regionType == "Country")
		{
			option = document.createElement("option");
			option.value = GetClickArgs("RenameStateType", clickedSpan);
			option.appendChild(document.createTextNode("Rename state type"));
			optGroup_AddRenameDelete.appendChild(option);
		}

		// // delete
		// option = document.createElement("option");
		// option.value = GetClickArgs("Delete", clickedSpan);
		// option.appendChild(document.createTextNode("Delete " + "'" + displayedName + "'"));
		// optGroup_AddRenameDelete.appendChild(option);
        //
		// // reparent
		// option = document.createElement("option");
		// option.value = GetClickArgs("Reparent", clickedSpan);
		// option.appendChild(document.createTextNode("Reparent " + "'" + displayedName + "' (use carefully)"));
		// optGroup_AddRenameDelete.appendChild(option);
        //
		select.appendChild(optGroup_AddRenameDelete);
	}


	// ######################################################
	// CREATE GENERAL OPTIONS
	// ######################################################

	var optGroup_General = document.createElement("optgroup");
	optGroup_General.label = "Worldwide";

	// add area
	var option_AddArea = document.createElement("option");
	option_AddArea.value = "AddNewArea";
	option_AddArea.appendChild(document.createTextNode("Add new area"));
	optGroup_General.appendChild(option_AddArea);

	// // remove orphans
	// var option_RemoveOrphans = document.createElement("option");
	// option_RemoveOrphans.value = "RemoveOrphans";
	// option_RemoveOrphans.appendChild(document.createTextNode("Remove orphans"));
	// optGroup_General.appendChild(option_RemoveOrphans);

	select.appendChild(optGroup_General);


	// ######################################################
	// CREATE REPORTS
	// ######################################################

	var optGroup_Reports = document.createElement("optgroup");
	optGroup_Reports.label = "Reports";

	// schools assigning passwords
	var option_SchoolsAssigningPassword = document.createElement("option");
	option_SchoolsAssigningPassword.value = "SchoolsAssigningPassword";
	option_SchoolsAssigningPassword.appendChild(document.createTextNode("Schools setting password"));
	optGroup_Reports.appendChild(option_SchoolsAssigningPassword);

	// schools playing games
	var option_SchoolsPlayingGameInLastWeek = document.createElement("option");
	option_SchoolsPlayingGameInLastWeek.value = "SchoolsPlayingGameInLastWeek";
	option_SchoolsPlayingGameInLastWeek.appendChild(document.createTextNode("Schools playing game"));
	optGroup_Reports.appendChild(option_SchoolsPlayingGameInLastWeek);

	select.appendChild(optGroup_Reports);


	// ######################################################
	// FINISH
	// ######################################################

	if (removeIOViewChildren)
		RemoveIOViewChildren();
}



// ======================================================================================================================================



function GetClickArgs(action, clickedSpan)
{
	var args = "Action=" + action + "&";
	args += "ItemName=" + clickedSpan.id + "&";
	args += "DisplayableName=" + clickedSpan.displayableName + "&";
	args += "RegionType=" + clickedSpan.regionType + "&";
	args += "ChildRegionType=" + GetChildRegion(clickedSpan.regionType) + "&";
	args += "ParentID=" + clickedSpan.parentID;
	return args;
}



// ######################################################################################################################################
//                                                               DO-IT EVENTS
// ######################################################################################################################################



function OnClick_DoItButton()
{
	var select = document.getElementById("TaskSelector");
	if (select.value == "none") return false;

	// general
	if (select.value == "AddNewArea")
	{
		AddNewAreaTask();
		return false;
	}
	if (select.value == "RemoveOrphans")
	{
		RemoveOrphansTask();
		return false;
	}
	if (select.value == "SchoolsAssigningPassword")
	{
		SchoolsAssigningPasswordTask();
		return false;
	}
	if (select.value == "SchoolsPlayingGameInLastWeek")
	{
		SchoolsPlayingGameInLastWeekTask();
		return false;
	}

	// region-specific
	var obj = DecodeClickArgs(select.value);
	switch (obj.action)
	{
	case "AddNewRegion": AddNewRegionTask(obj); break;
	case "AddNewDistrictSchoolPairs": AddNewDistrictSchoolPairsTask(obj); break;
	case "Rename": RenameTask(obj); break;
	case "RenameStateType": RenameStateTypeTask(obj); break;
	case "Delete": DeleteTask(obj); break;
	case "AddNewArea": AddNewAreaTask(obj); break;

	case "SetSchoolType": SetSchoolTypeTask(obj); break;
	case "SetSchoolPurchaseStatus": SetSchoolPurchaseStatusTask(obj); break;
	case "SetSchoolExpirationDate": SetSchoolExpirationDateTask(obj); break;
	case "SetSchoolPassword": SetSchoolPasswordTask(obj); break;
	case "SetSchoolSitecode": SetSchoolSitecodeTask(obj); break;
	case "SetSchoolUseLogin": SetSchoolUseLogin(obj); break;

	case "SetDistrictUseLogin": SetDistrictUseLogin(obj); break;

	case "SetDistrictType": SetDistrictTypeTask(obj); break;
	case "SetDistrictPurchaseStatus": SetDistrictPurchaseStatusTask(obj); break;
	case "SetDistrictExpirationDate": SetDistrictExpirationDateTask(obj); break;
	case "SetDistrictPassword": SetDistrictPasswordTask(obj); break;
	case "SetDistrictSitecode": SetDistrictSitecodeTask(obj); break;

	case "Reparent": ReparentTask(obj); break;
	}

	return false;
}



// ======================================================================================================================================



function DecodeClickArgs(args)
{
	var obj = new Object();
	var argArray = args.split("&");
	for (var n=0; n<argArray.length; n++)
	{
		var nvpArray = argArray[n].split("=");
		switch (nvpArray[0])
		{
		case "Action": obj.action = nvpArray[1]; break;
		case "ItemName": obj.itemName = nvpArray[1]; break;
		case "DisplayableName": obj.displayableName = nvpArray[1]; break;
		case "RegionType": obj.regionType = nvpArray[1]; break;
		case "ChildRegionType": obj.childRegionType = nvpArray[1]; break;
		case "ParentID": obj.parentID = nvpArray[1]; break;
		}
	}
	return obj;
}



// ======================================================================================================================================



// ######################################################################################################################################
//                                                               DO-IT TASKS
// ######################################################################################################################################



function AddNewRegionTask(obj)
{
	var retVal = prompt("Enter new " + obj.childRegionType.toLowerCase() + " name:", "");
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "AddNewRegion"),
		new Array("RegionType", obj.regionType),
		new Array("NewRegionType", obj.childRegionType),
		new Array("ItemName", obj.itemName),
		new Array("DisplayableName", obj.displayableName),
		new Array("ParentID", obj.ParentID),
		new Array("NewRegionName", retVal)
	));

	return false;
}



// ======================================================================================================================================



function AddNewDistrictSchoolPairsTask(obj)
{
	BuildDistrictSchoolInput(obj);
	return false;
}



// ======================================================================================================================================



function RenameTask(obj)
{
	var retVal = prompt("Enter new name for '" + obj.displayableName + "':", obj.displayableName);
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "Rename"),
		new Array("RegionType", obj.regionType),
		new Array("ItemName", obj.itemName),
		new Array("DisplayableName", obj.displayableName),
		new Array("ParentID", obj.ParentID),
		new Array("NewRegionName", retVal)
	));

	return false;
}



// ======================================================================================================================================



function RenameStateTypeTask(obj)
{
	var retVal = prompt("Enter new name for state type ('State', 'Province', etc.)':", "");
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "RenameStateType"),
		new Array("RegionType", obj.regionType),
		new Array("ItemName", obj.itemName),
		new Array("DisplayableName", obj.displayableName),
		new Array("ParentID", obj.ParentID),
		new Array("NewStateTypeName", retVal)
	));

	return false;
}



// ======================================================================================================================================



function DeleteTask(obj)
{
	var retVal = confirm("Really delete '" + obj.displayableName + "'?", obj.displayableName);
	if (retVal == false) return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "Delete"),
		new Array("RegionType", obj.regionType),
		new Array("ItemName", obj.itemName),
		new Array("DisplayableName", obj.displayableName),
		new Array("ParentID", obj.ParentID)
	));

	return false;
}



// ======================================================================================================================================



function AddNewAreaTask()
{
	var retVal = prompt("Enter new area name:", "");
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "AddNewArea"),
		new Array("NewRegionName", retVal)
	));

	return false;
}



// ======================================================================================================================================



function RemoveOrphansTask()
{
	var retVal = confirm("Remove orphans now?\n(this will take a while)", "");
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "RemoveOrphans")
	));

	return false;
}



// ======================================================================================================================================



function SetSchoolTypeTask(obj)
{
	schoolOrDistrict = "school";
	BuildSchoolTypeSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetSchoolPurchaseStatusTask(obj)
{
	schoolOrDistrict = "school";
	BuildSchoolPurchaseStatusSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetSchoolExpirationDateTask(obj)
{
	schoolOrDistrict = "school";
	BuildSchoolExpirationDateSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetSchoolPasswordTask(obj)
{
	var retVal = prompt("Enter new school password:", "");
	if (retVal == null) return false;
	if (retVal == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "SetSchoolPassword"),
		new Array("ItemName", obj.itemName),
		new Array("NewSchoolPassword", urlEncode(retVal))
	));

	return false;
}



// ======================================================================================================================================



function SetSchoolSitecodeTask(obj)
{
    var retVal = prompt("Enter new school sitecode:", "");
    if (retVal == null) return false;
    if (retVal == "") return false;

    // send Ajax request
    SendAjaxRequest(new Array(
        new Array("Action", "SetSchoolSitecode"),
        new Array("ItemName", obj.itemName),
        new Array("NewSchoolSitecode", urlEncode(retVal))
    ));

    return false;
}



// ======================================================================================================================================



function SetSchoolUseLogin(obj)
{
    schoolOrDistrict = "school";
    BuildUseLoginSelection(obj);
    return false;
}


// ======================================================================================================================================



function SetDistrictUseLogin(obj)
{
    schoolOrDistrict = "district";
    BuildUseLoginSelection(obj);
    return false;
}


// ======================================================================================================================================



function SetDistrictTypeTask(obj)
{
	schoolOrDistrict = "district";
	BuildSchoolTypeSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetDistrictPurchaseStatusTask(obj)
{
	schoolOrDistrict = "district";
	BuildSchoolPurchaseStatusSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetDistrictExpirationDateTask(obj)
{
	schoolOrDistrict = "district";
	BuildSchoolExpirationDateSelection(obj);
	return false;
}



// ======================================================================================================================================



function SetDistrictPasswordTask(obj)
{
    var retVal = prompt("Enter new district password:", "");
    if (retVal == null) return false;
    if (retVal == "") return false;

    // send Ajax request
    SendAjaxRequest(new Array(
        new Array("Action", "SetDistrictPassword"),
        new Array("ItemName", obj.itemName),
        new Array("NewDistrictPassword", urlEncode(retVal))
    ));

    return false;
}



// ======================================================================================================================================



function SetDistrictSitecodeTask(obj)
{
    var retVal = prompt("Enter new district sitecode:", "");
    if (retVal == null) return false;
    if (retVal == "") return false;

    // send Ajax request
    SendAjaxRequest(new Array(
        new Array("Action", "SetDistrictSitecode"),
        new Array("ItemName", obj.itemName),
        new Array("NewDistrictSitecode", urlEncode(retVal))
    ));

    return false;
}



// ======================================================================================================================================



function SchoolsAssigningPasswordTask()
{
	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "SchoolsAssigningPassword")
	));

	return false;
}



// ======================================================================================================================================



function SchoolsPlayingGameInLastWeekTask()
{
	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "SchoolsPlayingGameInLastWeek")
	));

	return false;
}



// ======================================================================================================================================



function ReparentTask(obj)
{
	var newParentID = prompt("Enter new parent ID:");
	if (newParentID == "") return false;

	// send Ajax request
	SendAjaxRequest(new Array(
		new Array("Action", "Reparent"),
		new Array("RegionType", obj.regionType),
		new Array("ItemName", obj.itemName),
		new Array("DisplayableName", obj.displayableName),
		new Array("ParentID", obj.ParentID),
		new Array("NewParentID", newParentID)
	));

	return false;
}
