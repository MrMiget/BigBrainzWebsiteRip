// Hierarchy.js



// ######################################################################################################################################
//                                                               GLOBALS
// ######################################################################################################################################



var H;



// ######################################################################################################################################
//                                                               INITIALIZATION
// ######################################################################################################################################



function InitializeHierarchy()
{
	H = new HObj("0", "Earth", "Planet");
}



// ======================================================================================================================================



function HObj(itemName, displayableName, regionType)
{
	this.itemName = itemName;
	this.displayableName = displayableName;
	this.regionType = regionType;
	this.children = new Array();
}



// ######################################################################################################################################
//                                                               RECREATE HTML
// ######################################################################################################################################



function RecreateHTMLFromHierarchy()
{
	// remove old paragraph entries
	var p = document.getElementById("HierarchyList");
	while (p.hasChildNodes())
		p.removeChild(p.lastChild);

	// populate paragraph
	var h = new Array();
	h[0] = H;
	CreateOneLevelFromHierarchy(p, h, "-1");
}



// ======================================================================================================================================



function CreateOneLevelFromHierarchy(p, h, parentID)
{
	for (var n=0; n<h.length; n++)
	{
		var hasChildren = h[n].children.length > 0;

		var clickable = true;
		if (h[n].displayableName == "Earth") clickable = false;
		var a1 = CreateAndAddHierarchyExpander(h[n].itemName, h[n].displayableName, h[n].regionType, parentID, hasChildren);
		var a2 = CreateAndAddHierarchyEntry(h[n].itemName, h[n].displayableName, h[n].regionType, parentID, clickable);
		if (h[n].regionType != "Game")
			p.appendChild(a1);
		p.appendChild(a2);
		p.appendChild(document.createElement("br"));

		// check for children
		if (hasChildren)
			CreateOneLevelFromHierarchy(p, h[n].children, h[n].itemName);
	}
}



// ######################################################################################################################################
//                                                               ACCESSORS
// ######################################################################################################################################



// returns obj
function Action_SearchForItemName(itemName)
{
	if (H.itemName == itemName) return H;
	return SearchChildren(H.children, itemName);
}



// ======================================================================================================================================



function SearchChildren(h, itemName)
{
	for (var n=0; n<h.length; n++)
	{
		if (h[n].itemName == itemName) return h[n];
		var retVal = SearchChildren(h[n].children, itemName);
		if (retVal != null) return retVal;
	}
	return null;
}



// ======================================================================================================================================



// returns obj
function Action_SearchForParentOfItemName(itemName)
{
	if (H.itemName == itemName) return null;
	return SearchChildren2(H, itemName);
}



// ======================================================================================================================================



function SearchChildren2(obj, itemName)
{
	var h = obj.children;
	for (var n=0; n<h.length; n++)
	{
		if (h[n].itemName == itemName) return obj;
		var retVal = SearchChildren2(h[n], itemName);
		if (retVal != null) return retVal;
	}
	return null;
}



// ======================================================================================================================================



function HierarchyLevelSortCB(a, b)
{
	var s1 = a.displayableName;
	var s2 = b.displayableName;
	s1.toLowerCase();
	s2.toLowerCase();
	if (s1 > s2) return 1;
	if (s1 < s2) return -1;
	return 0;
}
