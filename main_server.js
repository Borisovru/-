const http = require("http");
const urlapi = require("url");
const csv = require('fast-csv');
const fs = require("fs");
const path = require("path");
const nStatic = require("node-static");
const random = require('random');
rand = random.int((min = 1), (max = 50))
const filePath = path.join(__dirname, "lib/leaflet.html");
var allFileServer = new nStatic.Server(path.join(__dirname, "/"));
function getset () {
    var set = []
    return new Promise((resolve, reject) => {
        fs.createReadStream('cities.csv')
            .pipe(csv.parse({ headers: false }))
            .on('error', error => console.error(error))
            .on('data', data => {set.push(data);})
            .on('end', () => {resolve(set);});
    })
}
async function cities(req, res) {
    try {
        rand = random.int((min = 1), (max = 50))
        set_cites = await getset();
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(
            {
                'city' : set_cites[rand][0] + ' (' + set_cites[rand][3] + ')',
                'lat' : set_cites[rand][1],
                'long' : set_cites[rand][2]
            }
        ));
    } catch (error) {
        console.error("testGetSet: An error occurred: ", error.message);
    }
}
function index(req, res) {
    fs.readFile(filePath, {encoding: "utf-8"}, function(err, data) {
        if (!err) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(data);
        } else {
            console.log(err);
        }
    });
}


function error404(req, res) {
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end("404 Not Found :(");
}



async function handle(req, res) {
    var url = urlapi.parse(req.url);
    var pathname = url.pathname;

    switch(true) {
        case pathname === "/":
            index(req, res);
            break;
        case pathname === "/cities":
            await cities(req, res);
        case pathname.startsWith("/"):
            allFileServer.serve(req, res);
            break;

        default:
            error404(req, res);
            break;
    }
}

var app = http.createServer(handle);
app.listen(8080);
console.log("Listening on 8080");
