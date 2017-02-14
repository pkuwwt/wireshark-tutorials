const fs = require('fs');
const util = require('util');

function getDirsInDir(d) {
	return fs.readdirSync(d);
}
var walkSync = function(dir, filelist, withPrefix=true) {
	var fs = fs || require('fs'),
		files = fs.readdirSync(dir);
	filelist = filelist || [];
	files.forEach(function(file) {
		if (fs.statSync(dir + file).isDirectory()) {
			filelist = walkSync(dir + file + '/', filelist);
		}
		else {
			filelist.push(withPrefix ? dir + file : file);
		}
	});
	return filelist;
};
function getFilesFullPathInDir(d) {
	if(d[d.length-1]!="/") d = d + "/";
	var filelist = [];
	filelist = walkSync(d, filelist);
	return filelist;
}
function if_file_readable(filename, promptstr, nofile_callback, yes_callback, no_callback) {
	var fs = fs || require('fs');
	fs.open(filename, 'wx', (err,fd) => {
		if(err) {
			if(err.code=="EEXIST") {
				console.log(promptstr + "([Y]es/[N]o): ");
				process.stdin.resume();
				process.stdin.setEncoding('utf8');
				process.stdin.on("data", function(text) {
					text = text.trim().toLowerCase();
					if(text!="n" && text!="no") {
						if(yes_callback) yes_callback(filename);
					}
					else {
						if(no_callback) no_callback(filename);
					}
				});
				return;
			} else {
				throw err;
			}
		}
		nofile_callback(fd);
	});
}

function check_then_write(str, filename) {
	var promptstr = "File " + filename + " exists!!! Do you want to replace? ";
	var nofile_callback = function(fd) {
		console.log("Writing to file " + filename);
		fs.writeFile(fd, str, function(err) {
			if(err) console.log("Wrting to " + outfile + " is failed: " + err);
			process.exit();
		});
	};
	var yes_callback = function(f) {
		console.log("Replacing file " + f);
		fs.writeFile(outfile, str, function(err) {
			if(err) console.log("Wrting to " + outfile + " is failed: " + err);
			process.exit();
		});
	};
	var no_callback = function(f) { 
		process.exit(); 
	}
	if_file_readable(filename, promptstr, nofile_callback, yes_callback, no_callback);
}

var folders = getDirsInDir(".");
folders = folders.filter(function(f) {
	return f.startsWith("tutorial");
});

var output = {};
for(var i=0;i<folders.length;i++) {
	var files = getFilesFullPathInDir(folders[i]);
	files = files.filter(function(f) { return f.endsWith(".mp4"); });
	output[folders[i]] = files;
}
var json = JSON.stringify(output);
if(!process.argv[2]) {
	console.log("ERROR: missing out json filename");
	console.log("USAGE: " + process.argv[0] + " " + process.argv[1] + " filelist.json");
	process.exit();
}
var outfile = process.argv[2];
check_then_write(json, outfile);

