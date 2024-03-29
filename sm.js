function d(d) {
  setInterval(function(){
    const request = require('request');
    const iconv = require("iconv-lite");
    const babyparse = require("babyparse");
    const fs = require("fs");
    request.get({
      url: `https://storage.googleapis.com/play_public/supported_devices.csv`
    }, function(err, response, data){
      if(response.statusCode !== 200) return console.log("error");
      var devices = {};
      function cleanup(str){
        if(!str) return str;
        str = str.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').trim();
        if(str.indexOf("\\x") !== -1){
          var hex = str.split("\\x").slice(1);
          var txt = str.split("\\x")[1];
          for(var i = 0; i < hex.length; i++){
            var h;
            if(hex[i].length > 2){
              h = hex[i].substring(0, 2)
            } else {
              h = hex[i]
            }
            txt += String.fromCharCode(parseInt(h,16));
          }
          if(hex[hex.length - 1].length !== 2){
            txt += hex[hex.length - 1].substr(2)
          }
          str = txt;
        }
        return str;
      }
      babyparse.parse(iconv.decode(Buffer.from(data, 'binary'), 'utf-16le')).data.forEach(parts => {
        if(parts.length === 4){
          if(parts[0] === "Samsung" && cleanup(parts[1]).toLowerCase().search("chromebook") === -1){
            if(cleanup(parts[1]).toLowerCase().search(cleanup(parts[0]).toLowerCase()) !== -1){
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[1]).toLowerCase()) === -1){
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2]}\`: ${parts[1]} (${parts[3]})`)
              } else {
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2]}\`: ${parts[1]}`)
              }
            } else {
              if(cleanup(parts[3]).toLowerCase().search(cleanup(parts[1]).toLowerCase()) === -1){
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2]}\`: ${parts[0]} ${parts[1]} (${parts[3]})`)
              } else {
                devices[parts[3].toLowerCase()] = cleanup(`\`${parts[2]}\`: ${parts[0]} ${parts[1]}`)
              }
            }
          }
        }
      });
      fs.writeFile('./sm.json', JSON.stringify(devices, null, 4), err => {if(err) throw err;});
    });
  }, 1800000)
} module.exports = d;
