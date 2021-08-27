//https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
function executeFunctionByName(functionName, context /*, args */) {
	var args = Array.prototype.slice.call(arguments, 2);
	var namespaces = functionName.split(".");
	var func = namespaces.pop();
	for(var i = 0; i < namespaces.length; i++) {
		context = context[namespaces[i]];
	}
	//console.log(context, functionName, func, args)
	return context[func].apply(context, args);
}

function setParams(vars){
	if (vars){
		if (!Array.isArray(vars)) vars = [vars];
		vars.forEach(function(v){
			var keys = Object.keys(v);
			keys.forEach(function(k,i){
				executeFunctionByName(k, window, v[k])
			});
		});
	}
}

function evalCommand(evalString){
	//console.log(evalString)
	//can I improve on this method?
	eval(evalString);
}

//can use these later, but will need to edit..
function setURLvars(paramsObj, name){
	var keys = Object.keys(paramsObj);
	var vars = "/"+name+"?" //this needs to be the same as what is in flask
	keys.forEach(function(k) {
		if (k != name){
			vars += k+"="+paramsObj[k]+"&";
		}
	});
	window.history.pushState(name+"Params", "updated", vars);
}
//https://html-online.com/articles/get-url-parameters-javascript/
function getURLvars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}
function setParamsFromURL(paramsObj){
	var vars = getURLvars();
	var keys = Object.keys(vars);
	keys.forEach(function(k){
		paramsObj[k] = parseFloat(vars[k])
	});
}

/* FLASK HELPER FUNCTIONS USED A TON */
//function to send events to the GUI
function sendToGUI(GUIInput){
	if (viewerParams.usingSocket){
		socketParams.socket.emit('gui_input',GUIInput);
	} else {
		setParams(GUIInput);
	}
}

//a bit clunky...
function setViewerParamByKey(args){
	//first argument is always the value of the variable that you want to set
	//the remaining values in args are how to reference the variable, going in order for object keys as they would be written to access the variable (see below)
	var value = args[0];
	var key1 = args[1];
	if (args.length == 2) {
		viewerParams[key1] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 3) {
		var key2 = args[2];
		viewerParams[key1][key2] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 4) {
		var key2 = args[2];
		var key3 = args[3];
		viewerParams[key1][key2][key3] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 5) {
		var key2 = args[2];
		var key3 = args[3];
		var key4 = args[4];
		viewerParams[key1][key2][key3][key4] = JSON.parse(JSON.stringify(value));
	} else {
		console.log('!!!! WRONG NUMBER OF ARGUMENTS TO PASS', args.length, args)
	}
	//console.log(args)
}

// function to send events to the viewer
function sendToViewer(viewerInput){
	if (GUIParams.usingSocket){
		socketParams.socket.emit('viewer_input',viewerInput);
	} else {
		setParams(viewerInput);
	}
}

function setGUIParamByKey(args){
	var value = args[0];
	var key1 = args[1];

	if (args.length == 2) {
		GUIParams[key1] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 3) {
		var key2 = args[2];
		GUIParams[key1][key2] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 4) {
		var key2 = args[2];
		var key3 = args[3];
		GUIParams[key1][key2][key3] = JSON.parse(JSON.stringify(value));
	} else if (args.length == 5) {
		var key2 = args[2];
		var key3 = args[3];
		var key4 = args[4];
		GUIParams[key1][key2][key3][key4] = JSON.parse(JSON.stringify(value));
	} else {
		console.log('!!!! WRONG NUMBER OF ARGUMENTS TO PASS', args.length, args)
	}
	//console.log(args)
}