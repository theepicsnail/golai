all: node_modules
	node node_modules/requirejs/bin/r.js -o baseUrl=js name=golai out=golai.min.js
node_modules:
	npm install

