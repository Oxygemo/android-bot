const Discord = require("discord.js");
const request = require("request");
const pretty = require('prettysize');
const convert = require('xml-js');
const android = require('android-versions');
const fs = require('fs');
require("./device.js")(null);
require("./sm.js")(null);
const config = require('./config.json');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
//Language Verifier
const configlang = config.lang.toLowerCase();
const langfile = require('./lang.json');
if(langfile[configlang] === undefined){
	console.log("Please enter a Language Exist !");
	process.exit(0);
}
//end
var lang = langfile[configlang];
const client = new Discord.Client();
const roms = ["DotOS (dotos)\n", "Evolution-X (evo/evox)\n", "HavocOS (havoc)\n", "PearlOS (pearl)\n", "PixysOS (pixy)\n", "Potato Open Sauce Project (posp/potato)\n", "ViperOS (viper)\n", "LineageOS (los/lineage)\n", "Pixel Experience (pe)\n", "BootleggersROM (btlg/bootleggers)\n", "AOSP Extended (aex)\n", "crDroid (crdroid)\n", "Syberia (syberia)\n", "Clean Open Source Project (cosp/clean)\n", "Resurrection Remix (rr)\n", "SuperiorOS (superior)\n", "RevengeOS (revenge)\n", "Android Open Source illusion Project (aosip)\n", "ArrowOS (arrow)\n", "Liquid Remix (liquid)\n", "Dirty Unicorns (dirty)\n", "XenonHD (xenon)\n", "Kraken Open Tentacles Project (kotp/kraken)\n", "Android Ice Cold Project (aicp)\n", "NitrogenOS (nitrogen)\n", "CerberusOS (cerberus)\n", "MSM Xtended (msm)\n"].sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join('');
function timeConverter(timestamp){
  var a = new Date(timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var dates = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = dates[a.getDate()-1];
  var time = `${year}-${month}-${date}`;
  return time;
}
function devicename(codename){
	const device = require('./device.json');
	if(device[codename] !== undefined){
		return device[codename]; 
	} else {
		return codename;
	}
}
var app = require('firebase').initializeApp({apiKey: "AIzaSyAjfPSshzXoje3pewbnfpJYhlRrbNRmFEU",authDomain: "twrpbuilder.firebaseapp.com",databaseURL: "https://twrpbuilder.firebaseio.com",projectId: "twrpbuilder",storageBucket: "twrpbuilder.appspot.com",messagingSenderId: "1079738297898"});

var prefix = config.prefix;

client.on("ready", () => {
	client.user.setActivity(`${prefix}help`, {type: "STREAMING",url: "https://www.twitch.tv/android"});
	console.log(`${lang.connect} ${client.user.username} - ${client.user.id}`);
});

//Help
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	if(content.startsWith(`${prefix}help`)){
		const embed = new Discord.RichEmbed()
			.setColor(0xFFFFFF)
			.setTitle(lang.help.default.title)
			.setDescription("`"+prefix+"android <version_number>` : "+lang.help.default.android+"\n"+
			"`"+prefix+"magisk <version>`: "+lang.help.default.magisk.text+" \n - "+lang.help.default.magisk.ver+": `Stable`, `Beta`, `Canary`\n"+
			"`"+prefix+"twrp <codename>`: "+lang.help.default.twrp+"\n"+
			"`"+prefix+"gapps <arch> <ver> <variant>`: "+lang.help.default.gapps+"\n"+
			"`"+prefix+"cdn <device>`: "+lang.help.default.cdn+"\n"+
      			"`"+prefix+"sm <model>`: "+lang.help.default.sm+"\n"+
			"`"+prefix+"gplay`: "+lang.help.default.gplay+"\n"+
			"`"+prefix+"ahru <search>`: "+lang.help.default.ahru+"\n"+
			"`"+prefix+"specs <device_name/codename>`: "+lang.help.default.specs+"\n"+
      			"`"+prefix+"miui <version/codename> [<codename>]`: "+lang.help.default.miui+"\n"+
			"`"+prefix+"gcam <mod>`: "+lang.help.default.gcam+"\n"+
			"`"+prefix+"help roms`: "+lang.help.default.roms+"\n"+
			"`"+prefix+"lang`: "+lang.help.default.lang+"\n"+
			"`"+prefix+"prefix`: "+lang.help.default.prefix+"\n"+
			"`"+prefix+"invite`: "+lang.help.default.inv)
			.setFooter(`${lang.help.default.help} | ${prefix}help (here)`);
		const f = content.split(' ')[1];
		if(f === "here"){
			send({embed});
		} else if(f === "roms"){
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle(lang.help.roms.title)
				.setDescription(lang.help.roms.desc)
				.addField(lang.help.roms.available, roms, false)
				.addField(lang.help.roms.use.title, "`"+prefix+"<rom> <codename>`\n"+lang.help.roms.use.example+": `"+prefix+"havoc whyred`\n"+lang.help.roms.use.cmdroms+" `"+prefix+"roms`.\n"+lang.help.roms.use.cdnroms+"`"+prefix+"roms <codename>`\n"+lang.help.roms.use.example+": `"+prefix+"roms daisy`\n\n"+lang.help.roms.use.note, false)
				.setFooter(`${lang.help.roms.help} | ${prefix}help roms (here)`);
			const s = content.split(' ')[2];
			if(s === "here"){
				send({embed})
			} else {
				sendmp({embed})
			}
		} else {
			sendmp({embed});
		}
	}
});

//Android Bot
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	//Android
	if(content.startsWith(`${prefix}android`)){
		const version = content.split(' ')[1];
		function name(name){
			if(name === "(no code name)"){
				return "";
			} else {
				return name;
			}
		}
		function color(name){
			if(name === "Pie"){
				return 0xe0f6d9
			} else if(name === "Oreo"){
				return 0xedb405
			} else if(name === "Nougat"){
				return 0x4fc3f6
			} else if(name === "Marshmallow"){
				return 0xe91e63
			} else if(name === "Lollipop"){
				return 0x9c27b1
			} else if(name === "KitKat" || name === "KitKat Watch"){
				return 0x693c20
			} else if(name === "Jellybean"){
				return 0xfe0000
			} else if(name === "Ice Cream Sandwich"){
				return 0x8a4e1d
			} else if(name === "Honeycomb"){
				return 0x00467a
			} else if(name === "Gingerbread"){
				return 0xb28a70
			} else if(name === "Froyo"){
				return 0xa4d229
			} else if(name === "Eclair"){
				return 0xc19d53
			} else if(name === "Donut"){
				return 0xf4f5f7
			} else if(name === "Cupcake"){
				return 0x8cc63c
			} else {
				return 0xffffff
			}
		}
		if(version !== undefined){
			const info = android.get(version);
			if(info !== null){
				const embed = new Discord.RichEmbed()
					.setColor(color(info.name))
					.setTitle(`Android ${info.semver} ${name(info.name)}`)
					.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**"+lang.android.versioncode+"**: `"+info.versionCode+"`")
				send({embed});
			} else {
				if(version === "29" || version === "10.0" || version === "10.0.0"){
					const embed = new Discord.RichEmbed()
						.setColor(0x77c35f)
						.setTitle("Android 10 Q")
						.setDescription("**API**: `29`\n**NDK**: `8`\n**"+lang.android.versioncode+"**: `Q`")
					send({embed});
				} else {
					send(lang.android.error);
				}
			}
		} else {
			const info = android.get(28);
			const embed = new Discord.RichEmbed()
				.setColor(color(info.name))
				.setTitle(`Android ${info.semver} ${name(info.name)}`)
				.setDescription("**API**: `"+info.api+"`\n**NDK**: `"+info.ndk+"`\n**"+lang.android.versioncode+"**: `"+info.versionCode+"`")
			send({embed});
		}
	//Magisk
	} else if(content.startsWith(`${prefix}magisk`)) {
		const version = content.split(' ')[1];
		async function magisk(url) {
			return new Promise(function(resolve, reject) {
				request({
					url
				}, function(err, responses, bodyurl) {
					var response = JSON.parse(bodyurl);
					resolve(response);
				});
			});
		}
		//Stable Version
		if(version === "stable") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`).then(magisks => {
				request({
					url: magisks.magisk.note
				}, function(err, response, logm){
					request({
						url: magisks.app.note
					}, function(err, response, loga){
						var log = logm + "\n" + "Magisk Manager" + loga;
						const embed = new Discord.RichEmbed()
							.setColor(0x30756a)
							.setTitle("Magisk Stable")
							.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`"+`\n**${lang.download}**: [Magisk Manager ${magisks.app.version}](${magisks.app.link})`, true)
							.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})`, true)
							.addField("ChangeLog", "```"+log+"```", false)
						send({embed});
					});
				});
			});
		//Beta Version
		} else if(version === "beta") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`).then(magiskb => {
				request({
					url: magiskb.magisk.note
				}, function(err, response, logm){
					request({
						url: magiskb.app.note
					}, function(err, response, loga){
						var log = logm + "\n" + "Magisk Manager" + loga;
						const embed = new Discord.RichEmbed()
							.setColor(0x30756a)
							.setTitle("Magisk Beta")
							.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`"+`\n**${lang.download}**: [Magisk Manager ${magiskb.app.version}](${magiskb.app.link})`, true)
							.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})`, true)
							.addField("ChangeLog", "```"+log+"```", false)
						send({embed});
					});
				});
			});
		//Canary Version
		} else if(version === "canary") {
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`).then(magiskc => {
				request({
					url: magiskc.magisk.note
				}, function(err, response, log){
					const embed = new Discord.RichEmbed()
						.setColor(0x30756a)
						.setTitle("Magisk Canary")
						.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [SNET ${magiskc.snet.versionCode}](${magiskc.snet.link})`, true)
						.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})`, true)
						.addField("ChangeLog", "```"+log+"```", false)
					send({embed});
				});
			});
		//All (undefined) Version
		} else {
			//Stable
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/stable.json`).then(magisks => {
			//Beta
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/beta.json`).then(magiskb => {
			//Canary
			magisk(`https://raw.githubusercontent.com/topjohnwu/magisk_files/master/canary_builds/canary.json`).then(magiskc => {
				const embed = new Discord.RichEmbed()
					.setColor(0x30756a)
					.setTitle("Magisk")
					.addField("Stable", "** **", false)
					.addField("Magisk Manager", "**"+lang.version+"**: "+magisks.app.version+" `"+magisks.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magisks.app.version}](${magisks.app.link})\n - [ChangeLog](${magisks.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magisks.magisk.version+" `"+magisks.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magisks.magisk.version}](${magisks.magisk.link})\n - [Magisk Uninstaller](${magisks.uninstaller.link})\n - [ChangeLog](${magisks.magisk.note})`, true)
					.addField("Beta", "** **", false)		
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskb.app.version+" `"+magiskb.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskb.app.version}](${magiskb.app.link})\n - [ChangeLog](${magiskb.app.note})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskb.magisk.version+" `"+magiskb.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskb.magisk.version}](${magiskb.magisk.link})\n - [Magisk Uninstaller](${magiskb.uninstaller.link})\n - [ChangeLog](${magiskb.magisk.note})`, true)
					.addField("Canary", "** **", false)						
					.addField("Magisk Manager", "**"+lang.version+"**: "+magiskc.app.version+" `"+magiskc.app.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Manager ${magiskc.app.version}](${magiskc.app.link})\n - [ChangeLog](${magiskc.app.note})\n - [SNET ${magiskc.snet.versionCode}](${magiskc.snet.link})`, true)
					.addField("Magisk Installer", "**"+lang.version+"**: "+magiskc.magisk.version+" `"+magiskc.magisk.versionCode+"`"+`\n**${lang.download}**: \n - [Magisk Installer ${magiskc.magisk.version}](${magiskc.magisk.link})\n - [Magisk Uninstaller](${magiskc.uninstaller.link})\n - [ChangeLog](${magiskc.magisk.note})`, true)
				send({embed})
			})})});
		}
	//Invite
	} else if(content.startsWith(`${prefix}invite`)){
		client.generateInvite().then(link => {
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle("Invite")
				.setURL(link)
			send({embed});
		});
	//TWRP
	} else if(content.startsWith(`${prefix}twrp`)){
		const codename = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1];
		if(codename !== undefined){
      message.channel.startTyping();
			const codenameup = codename.toUpperCase();
			request({
				url: `https://twrp.me/search.json`
			}, function(err, responses, bodyurl) {
				var body = JSON.parse(bodyurl);
				var response = body.find(cdn => cdn.title.toLowerCase().indexOf(`(${codename})`) !== -1);
				if(response !== undefined){
					const embed = new Discord.RichEmbed()
						.setColor(0x0091CA)
						.setTitle(`TWRP | ${devicename(codename)}`)
				    .setDescription(`**${lang.download}**: [${response.title}](https://twrp.me${response.url})`)
					send({embed});
				} else {
          function reverseSnapshot(snap){var reverseSnap = [];snap.forEach(function(data){var val = data.val();reverseSnap.push(val)});return reverseSnap.reverse();}
          app.database().ref("Builds").orderByKey().once("value").then(function(snapshot) {
            var response = reverseSnapshot(snapshot).find(cdn => cdn.codeName.toLowerCase() === codename);
            if(response !== undefined){
              request({
                url: response.url.replace("https://github.com/", "https://api.github.com/repos/") + `?client_id=${config.ci}&client_secret=${config.cs}`, json: true, headers: {'User-Agent': 'android bot'}
              }, function(err, resp, json){
                try {
                  var dl = json.assets.map(d => {return `[${d.name}](${d.browser_download_url}) \`${pretty(d.size)}\``}).join("\n");
                  const embed = new Discord.RichEmbed()
                    .setColor(0x0091CA)
                    .setTitle(`TWRP Builder | ${devicename(codename)}`)
                    .addField(`**${lang.download}**:`, dl)
                  send({embed});
                } catch(e) {
                  send(lang.twrperr+" `"+devicename(codename)+"`");
                }
              })
            } else {
              send(lang.twrperr+" `"+devicename(codename)+"`");
            }
          });
				}
        message.channel.stopTyping();
			});
		} else {
			send(lang.cdnerr)
		}
	//OpenGapps
	} else if(content.startsWith(`${prefix}gapps`)){
		const arch = content.split(' ')[1];
		if(arch === undefined){
			send(lang.gapps.noarch + ' `arm`, `arm64`, `x86`, `x86_64`')
		} else if(arch !== 'arm' && arch !== 'arm64' && arch !== 'x86' && arch !== 'x86_64'){
			send(lang.gapps.archerr + ' `arm`, `arm64`, `x86`, `x86_64`')
		} else {
			const ver = content.split(' ')[2];
			if(ver === undefined){
				if(arch !== 'arm' && arch !== 'x86'){
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
				} else {
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`, `4.4`')
				}
			} else if(ver === '9.0' || ver === '8.1' || ver === '8.0' || ver === '7.1' || ver === '7.0' || ver === '6.0' || ver === '5.1' || ver === '5.0' || ver === '4.4'){
				const variant = content.split(' ')[3];
				function sendembed(){
					request.get({
						url: `https://api.github.com/repos/opengapps/${arch}/tags` + `?client_id=${config.ci}&client_secret=${config.cs}`, headers: {'User-Agent': 'android bot'}
					}, function(err, response, nbody){
						request.get({
							url: `https://api.github.com/repos/opengapps/${arch}/releases/latest` + `?client_id=${config.ci}&client_secret=${config.cs}`, headers: {'User-Agent': 'android bot'}
						}, function(err, response, body){
							var time = JSON.parse(nbody)[0].name;
							var search = JSON.parse(body).assets.find(s => s.name.indexOf(`open_gapps-${arch}-${ver}-${variant}-${time}.zip`) !== -1);
							var dl = search.browser_download_url;
							var size = pretty(search.size);
							var name = search.name;
							const embed = new Discord.RichEmbed()
								.setColor(0x009688)
								.setTitle('OpenGapps')
								.setDescription(`**${lang.date}**:` + ' **`' + `${time.substring(0, 4)}-${time.substring(4, 6)}-${time.substring(6, 8)}` + '`**\n' + `**${lang.size}**:` + ' **`' + size + '`**\n' + `**${lang.download}**: [${name}](${dl})`)
							send(embed);
						});
					});
				}
				if(ver === '8.0'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'full' && variant !== 'mini' && variant !== 'micro' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed()
					}
				} else if(ver === '7.0' || ver === '6.0' || ver === '5.1'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `aroma`, `stock`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'aroma' && variant !== 'stock' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `aroma`, `stock`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed();
					}
				} else if(ver === '5.0'){
					if(variant === undefined){
						send(lang.gapps.novar + ' `nano`, `pico`')
					} else if(variant !== 'nano' && variant !== 'pico'){
						send(lang.gapps.varerr + ' `nano`, `pico`')
					} else {
						sendembed();
					}
				} else if(ver === '4.4'){
					if(arch !== 'arm' && arch !== 'x86'){
						send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
					} else {
						if(variant === undefined){
							send(lang.gapps.novar + ' `nano`, `pico`')
						} else if(variant !== 'nano' && variant !== 'pico'){
							send(lang.gapps.varerr + ' `nano`, `pico`')
						} else {
							sendembed();
						}
					}
				} else {
					if(variant === undefined){
						send(lang.gapps.novar + ' `aroma`, `super`, `stock`, `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else if(variant !== 'aroma' && variant !== 'super' && variant !== 'stock' && variant !== 'full' && variant !== 'mini' && variant !== 'micro' && variant !== 'nano' && variant !== 'pico' && variant !== 'tvstock'){
						send(lang.gapps.varerr + ' `aroma`, `super`, `stock`, `full`, `mini`, `micro`, `nano`, `pico`, `tvstock`')
					} else {
						sendembed()
					}
				}
			} else {
				if(arch !== 'arm' && arch !== 'x86'){
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`')
				} else {
					send(lang.gapps.nover + ' `9.0`, `8.1`, `8.0`, `7.1`, `7.0`, `6.0`, `5.1`, `5.0`, `4.4`')
				}
			}
		}
	//Language
	} else if(content.startsWith(`${prefix}lang`)){
		if(message.channel.type !== "dm"){
			if(message.member.hasPermission(["MANAGE_GUILD"], false, true, true)){
				const lg = content.split(' ')[1]
				if(lg !== undefined){
					if(lg !== "en" && lg !== "fr"){
						send(lang.lang.err + ' `fr`, `en`')
					} else {
						var gld = require("./guild.json");
						gld[message.guild.id]['lang'] = lg
						fs.writeFile("./guild.json", JSON.stringify(gld, null, 4), err => {
							if(err) throw err;
						});
						send(langfile[lg].lang.suc + " `" + lg + "`");
					}
				} else {
					send(lang.lang.nol + ' `fr`, `en`')
				}
			} else {
				send(lang.perm)
			}
		} else {
			send(lang.dm)
		}
	//Prefix
	} else if(content.startsWith(`${prefix}prefix`)){
		if(message.channel.type !== "dm"){
			if(message.member.hasPermission(["MANAGE_GUILD"], false, true, true)){
				const prf = content.split(' ')[1]
				if(prf !== undefined){
						var gld = require("./guild.json");
						gld[message.guild.id]['prefix'] = prf
						fs.writeFile("./guild.json", JSON.stringify(gld, null, 4), err => {
							if(err) throw err;
						});
						send(lang.prefix.suc + " `" + prf + "`");
				} else {
					send(lang.prefix.nop)
				}
			} else {
				send(lang.perm)
			}
		} else {
			send(lang.dm)
		}
	//Codename Search
	} else if(content.startsWith(`${prefix}cdn`)){
		const srch = message.content.split(' ').slice(1).join(' ').trim()
		if(srch !== ""){
      if(srch.startsWith("/s ")){
        const device = require('./device.json');
        var cdn = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[2]
        if(device[cdn] !== undefined){
          return send(lang.cdn.tc+"`"+device[cdn]+"`"); 
        } else {
          return send(lang.cdn.nod);
        }
      } else {
        var values = Object.values(require("./device.json"));
        var keys = Object.keys(require("./device.json"));
        var num = values.map(n => n.toLowerCase().replace(/\s/gm, "")).map(n => n.indexOf(srch.toLowerCase().replace(/\s/gm, "")) !== -1);
        var indices = [];
        var element = true;
        var ids = num.indexOf(element);
        while (ids != -1) {
          indices.push(ids);
          ids = num.indexOf(element, ids + 1);
        }
        var result = indices.map(n => { return `\`${keys[n]}\`: ${values[n]}`})
        var s;
        if(result.length <= 1){
          s = "";
        } else {
          s = "s";
        }
        const embed = new Discord.RichEmbed()
          .setTitle(`${result.length} ${lang.cdn.result + s} | ${srch}`)
          .setColor(0xFFFFFF);
        if(result[0] === undefined){
          return send(lang.cdn.nocdn)
        } else if(result.join("\n").length <= 2048){
          embed.setDescription(result.join("\n"));
        } else {
          var txt;
          var arr = [];
          var i = 0;
          do{
            txt += result[i] + "\n"
            if(txt.length > 1024){
              txt.split("\n").slice(0, -1).join("\n");
              i--
              var n = true
              do {
                if(txt.length > 1024){
                  txt.split("\n").slice(0, -1).join("\n");
                  i--
                  arr.push(txt)
                  txt = "";
                } else {
                  arr.push(txt)
                  txt = "";
                  n = false
                }
              } while(n)
            } else if(txt.length <= 1024 && txt.length >= 985) {
              arr.push(txt)
              txt = "";
            }
            i++
          } while (i <= result.length)
          if(arr.length > 6){
            return send(lang.cdn.lot.replace("{results}", result.length))
          } else {
            for(i=0; i<arr.length; i++){
              embed.addField(i, arr[i].replace(undefined, ""), true)
            }
          }
        }
        send(embed);
      }
		} else {
			send(lang.cdn.nosrch)
		}
	//Samsung Codename Search
	} else if(content.startsWith(`${prefix}sm`)){
		const srch = message.content.split(' ').slice(1).join(' ')
		if(srch !== ""){
			var values = Object.values(require("./sm.json"));
			var keys = Object.keys(require("./sm.json"));
			var num = keys.map(n => n.toLowerCase()).map(n => n.indexOf(srch.toLowerCase()) !== -1);
			var indices = [];
			var element = true;
			var ids = num.indexOf(element);
			while (ids != -1) {
				indices.push(ids);
				ids = num.indexOf(element, ids + 1);
			}
      var result = indices.map(n => values[n]);
      var s;
      if(result.length <= 1){
        s = "";
      } else {
        s = "s";
      }
			const embed = new Discord.RichEmbed()
				.setTitle(`${result.length} ${lang.cdn.result + s} | ${srch}`)
				.setColor(0xFFFFFF);
			if(result[0] === undefined){
				return send(lang.sm.nomodel)
			} else if(result.join("\n").length <= 2048){
				embed.setDescription(result.join("\n"));
			} else {
				var txt;
				var arr = [];
				var i = 0;
				do{
					txt += result[i] + "\n"
					if(txt.length > 1024){
						txt.split("\n").slice(0, -1).join("\n");
						i--
						var n = true
						do {
							if(txt.length > 1024){
								txt.split("\n").slice(0, -1).join("\n");
								i--
								arr.push(txt)
								txt = "";
							} else {
								arr.push(txt)
								txt = "";
								n = false
							}
						} while(n)
					} else if(txt.length <= 1024 && txt.length >= 985) {
						arr.push(txt)
						txt = "";
					}
					i++
				} while (i <= result.length)
				if(arr.length > 6){
					return send(lang.cdn.lot.replace("{results}", result.length))
				} else {
					for(i=0; i<arr.length; i++){
						embed.addField(i, arr[i].replace(undefined, ""), true)
					}
				}
			}
			send(embed);
		} else {
			send(lang.sm.nosrch)
		}
	//Android Host RU Search
	} else if(content.startsWith(`${prefix}ahru`)){
		var srch = message.content.split(" ").slice(1).join(" ");
		request({
			url: `https://androidhost.ru/ajax/_search.ajax.php?sEcho=3&iColumns=1&sColumns=&iDisplayStart=0&iDisplayLength=150&filterText=${srch}&filterType=%20HTTP/1.1`, json: true
		}, function(err, resp, json){
			var totalRecords = json.iTotalRecords;
			var result = json.aaData.map(d => {d = require("node-html-parser").parse(d[0]).childNodes[1].childNodes;var das = d[2].childNodes[0].rawText;return `[${d[0].childNodes[0].childNodes[0].rawText}](${d[1].childNodes[0].rawText}) \`${das.split("Dated Uploaded:")[1].split("&nbsp;")[0].trim().split("/").join("-")}\` \`${das.split("Filesize:")[1].trim().replace(" ", "")}\``})
			const embed = new Discord.RichEmbed()
				.setTitle(`androidhost.ru | ${srch}`)
				.setColor(0xFFFFFF);
			if(result[0] === undefined){
				return send(lang.nofile)
			} else if(result.join("\n").length <= 2048){
				embed.setDescription(result.join("\n"));
			} else {
				var txt;
				var i = 0;
				var n = true
				var desc;
				do{
					txt += (result[i] + "\n")
					if(txt.length >= 2048){
						desc = txt.split("\n").slice(0, -1).slice(0, -1).join("\n");
						n = false
					} else {
						i++
					}
				} while (n)
				console.log(desc.length)
				embed.setDescription(desc.replace("undefined", ""));
			}
			send(embed);
		});
	//DeviceSpecification
	} else if(content.startsWith(`${prefix}specs`)){
		const search = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(1).join(" ")
		if(search !== ""){
      var language;
      if(message.channel.type !== "dm"){
        language = guildfile[message.guild.id].lang;
      } else {
        language = "en";
      }
			request.get({
				url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${search}`
			}, function(err, response, fbody){
				var HTMLParser = require('node-html-parser');
        var reaction_numbers = ["\u0030\u20E3","\u0031\u20E3","\u0032\u20E3","\u0033\u20E3","\u0034\u20E3","\u0035\u20E3", "\u0036\u20E3","\u0037\u20E3","\u0038\u20E3","\u0039\u20E3"]
        async function sendspecs(srch, words){
          var arr = [];
          var desc;
          var n = 0;
          var name = [];
          for(var i=0; i<JSON.parse(srch).length; i++){
            if(JSON.parse(srch)[i] !== undefined){
              var t;
              if(i == 0){
                t = ":one:"
              } else if(i == 1){
                t = ":two:"
              } else if(i == 2){
                t = ":three:"
              } else if(i == 3){
                t = ":four:"
              } else if(i == 4){
                t = ":five:"
              }
              if(i<5){
                desc += `**${t} : ${HTMLParser.parse(JSON.parse(srch)[i].html).childNodes[2].childNodes[0].rawText}**\n`
                n += 1
                arr.push(reaction_numbers[i+1])
              }
              name.push(HTMLParser.parse(JSON.parse(srch)[i].html).childNodes[2].childNodes[0].rawText)
            }
          }
          if(n == 1){
            request.get({
              url: JSON.parse(srch)[0].url
            }, function(err, response, body){
              var root = HTMLParser.parse(body);
              var name = HTMLParser.parse(JSON.parse(srch)[0].html).childNodes[2].childNodes[0].rawText;
              var img;
              try {
                img = root.querySelector('#model-image').rawAttrs.split("url(")[1].replace(');"', '');
              } catch(e){
                img = JSON.parse(srch)[0].html.split("background: url(")[1].split("); ")[0].replace("40/main.jpg", "320/main.jpg");
              }
              var t = root.querySelector('.unconfirmed-specifications')
              var unconfirmed;
              if(t !== null){
                unconfirmed = lang.specs.unconfirmed
              } else {
                unconfirmed = lang.specs.confirmed
              }
              const embed = new Discord.RichEmbed()
                .setColor(0xffffff)
                .setTitle(name)
                .setURL(JSON.parse(srch)[0].url)
                .setDescription(root.querySelector('#model-brief-specifications').toString().replace('<div id="model-brief-specifications">', '').split('<a href="#"')[0].split('<br />').slice(0, -1).slice(0, -1).join("\n").replace("\r\n", "").trim().replace(/(<b>)+/gm, "**").replace(/(<[/]b>)+/gm, "**"))
                .setThumbnail(img)
                .setFooter(`DeviceSpecifications | ${unconfirmed}`, "https://cdn.glitch.com/e06e70b7-0cae-44dd-99e0-73218656fa22%2Ffavicon.png?v=1563951283975")
              message.channel.send(embed).then(async (msg) => {
                var time = new Date().getTime() + 600000
                await msg.react("❌")
                client.on("messageReactionAdd", (reaction, user) => {
                  if(new Date().getTime() > time || reaction.message.id !== msg.id) return;
                  var hasPerm;
                  if(msg.channel.type === "dm") {
                    if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                      msg.delete(500)
                    }
                  } else {
                    if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && msg.guild.members.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true)){
                      msg.delete(500)
                      message.delete(500).catch(e => {return})
                    } else if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                      msg.delete(500)
                      message.delete(500).catch(e => {return})
                    }
                  }
                });
              })
            });
          } else {
            var num = name.map(na => na.toLowerCase().replace(/\s/gm, "").trim()).map(na => na === words.toLowerCase().replace(/\s/gm, "").trim());
            var result = [];
            var element = true;
            var ids = num.indexOf(element);
            while (ids != -1) {
              result.push(ids);
              ids = num.indexOf(element, ids + 1);
            }
		      	if(result[0] !== undefined){
              var n = result[0];
              request.get({
                url: JSON.parse(srch)[n].url
              }, function(err, response, body){
                var root = HTMLParser.parse(body);
                var name = HTMLParser.parse(JSON.parse(srch)[n].html).childNodes[2].childNodes[0].rawText;
                var img;
                try {
                  img = root.querySelector('#model-image').rawAttrs.split("url(")[1].replace(');"', '');
                } catch(e){
                  img = JSON.parse(srch)[n].html.split("background: url(")[1].split("); ")[0].replace("40/main.jpg", "320/main.jpg");
                }
                var t = root.querySelector('.unconfirmed-specifications')
                var unconfirmed;
                if(t !== null){
                  unconfirmed = lang.specs.unconfirmed
                } else {
                  unconfirmed = lang.specs.confirmed
                }
                const embed = new Discord.RichEmbed()
                  .setColor(0xffffff)
                  .setTitle(name)
                  .setURL(JSON.parse(srch)[n].url)
                  .setDescription(root.querySelector('#model-brief-specifications').toString().replace('<div id="model-brief-specifications">', '').split('<a href="#"')[0].split('<br />').slice(0, -1).slice(0, -1).join("\n").replace("\r\n", "").trim().replace(/(<b>)+/gm, "**").replace(/(<[/]b>)+/gm, "**"))
                  .setThumbnail(img)
                  .setFooter(`DeviceSpecifications | ${unconfirmed}`, "https://cdn.glitch.com/e06e70b7-0cae-44dd-99e0-73218656fa22%2Ffavicon.png?v=1563951283975")
                message.channel.send(embed).then(async (msg) => {
                  var time = new Date().getTime() + 600000
                  await msg.react("❌")
                  client.on("messageReactionAdd", (reaction, user) => {
                    if(new Date().getTime() > time || reaction.message.id !== msg.id) return;
                    var hasPerm;
                    if(msg.channel.type === "dm") {
                      if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                        msg.delete(500)
                      }
                    } else {
                      if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && msg.guild.members.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true)){
                        msg.delete(500)
                        message.delete(500).catch(e => {return})
                      } else if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                        msg.delete(500)
                        message.delete(500).catch(e => {return})
                      }
                    }
                  });
                })
              });
            } else {
              var embed = new Discord.RichEmbed()
                .setColor(0xffffff)
                .setTitle(lang.specs.title)
                .setDescription(desc.replace(undefined, ""))
                .setFooter("DeviceSpecifications", "https://cdn.glitch.com/e06e70b7-0cae-44dd-99e0-73218656fa22%2Ffavicon.png?v=1563951283975")
              message.channel.send(embed).then(async (msg) => {
                async function number(){
                  return new Promise(async function(resolve, reject){
                    var time = new Date().getTime() + 600000
                    client.on("messageReactionAdd", (reaction, user) => {
                      if(new Date().getTime() > time || reaction.message.id !== msg.id) return;
                      if(msg.channel.type === "dm") {
                        if(reaction.emoji.name === reaction_numbers[1] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(0)
                        } else if(reaction.emoji.name === reaction_numbers[2] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(1)
                        } else if(reaction.emoji.name === reaction_numbers[3] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(2)
                        } else if(reaction.emoji.name === reaction_numbers[4] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(3)
                        } else if(reaction.emoji.name === reaction_numbers[5] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(4)
                        } else if(reaction.emoji.name === "❌" && user.id !== client.user.id && !user.bot && user.id === message.author.id){
                          msg.delete(500)
                        }
                      } else {
                        if(reaction.emoji.name === reaction_numbers[1] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(0)
                        } else if(reaction.emoji.name === reaction_numbers[2] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(1)
                        } else if(reaction.emoji.name === reaction_numbers[3] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(2)
                        } else if(reaction.emoji.name === reaction_numbers[4] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(3)
                        } else if(reaction.emoji.name === reaction_numbers[5] && user.id !== client.user.id && !user.bot && user.id === message.author.id && reaction.message.edits.length < 3){
                          resolve(4)
                        } else if(reaction.emoji.name === "❌"){
                          if(user.id !== client.user.id && !user.bot && msg.guild.members.get(user.id).hasPermission("MANAGE_MESSAGES", false, true, true)){
                            msg.delete(500)
                            message.delete(500).catch(e => {return})
                          } else if(user.id !== client.user.id && !user.bot && user.id === message.author.id){
                            msg.delete(500)
                            message.delete(500).catch(e => {return})
                          }
                        }
                      }
                    });
                    for(var i=1; i<(n+1); i++){
                      await msg.react(reaction_numbers[i])
                    }
                    await msg.react("❌")
                  });
                }
                number().then(n => {
                  request.get({
                    url: JSON.parse(srch)[n].url
                  }, function(err, response, body){
                    var root = HTMLParser.parse(body);
                    var name = HTMLParser.parse(JSON.parse(srch)[n].html).childNodes[2].childNodes[0].rawText;
                    var img;
                    try {
                      img = root.querySelector('#model-image').rawAttrs.split("url(")[1].replace(');"', '');
                    } catch(e){
                      img = JSON.parse(srch)[n].html.split("background: url(")[1].split("); ")[0].replace("40/main.jpg", "320/main.jpg");
                    }
                    var t = root.querySelector('.unconfirmed-specifications')
                    var unconfirmed;
                    if(t !== null){
                      unconfirmed = lang.specs.unconfirmed
                    } else {
                      unconfirmed = lang.specs.confirmed
                    }
                    const embed = new Discord.RichEmbed()
                      .setColor(0xffffff)
                      .setTitle(name)
                      .setURL(JSON.parse(srch)[n].url)
                      .setDescription(root.querySelector('#model-brief-specifications').toString().replace('<div id="model-brief-specifications">', '').split('<a href="#"')[0].split('<br />').slice(0, -1).slice(0, -1).join("\n").replace("\r\n", "").trim().replace(/(<b>)+/gm, "**").replace(/(<[/]b>)+/gm, "**"))
                      .setThumbnail(img)
                      .setFooter(`DeviceSpecifications | ${unconfirmed}`, "https://cdn.glitch.com/e06e70b7-0cae-44dd-99e0-73218656fa22%2Ffavicon.png?v=1563951283975")
                    msg.edit(embed);
                  });
                })
              });
            }
          }
        }
				if(fbody === "0") {
          var cdn = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1];
          var check = devicename(cdn);
          if(check !== cdn){
            if(message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[2] !== undefined){
              var sword = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(2).join(" ")
              request.get({
                url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check} ${sword}`
              }, function(err, response, fbody){
                if(fbody === "0"){
                  request.get({
                    url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check}`
                  }, function(err, response, fbody){
                    if(fbody === "0") return send(lang.specs.err)
                    sendspecs(fbody, check)
                  })
                } else {
                  sendspecs(fbody, `${check} ${sword}`)
                }
              })
            } else {
              request.get({
                url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check}`
              }, function(err, response, fbody){
                if(fbody === "0") return send(lang.specs.err)
                sendspecs(fbody, check)
              })
            }
          } else {
            return send(lang.specs.err)
          }
        } else {
          var cdn = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1];
          var check = devicename(cdn);
          if(check !== cdn && check.toLowerCase().replace(/\s/gm, "") !== "oneplusx"){
            if(message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[2] !== undefined){
              var sword = message.content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(2).join(" ")
              request.get({
                url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check} ${sword}`
              }, function(err, response, fbody){
                if(fbody === "0"){
                  request.get({
                    url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check}`
                  }, function(err, response, fbody){
                    if(fbody === "0") return sendspecs(fbody, search)
                    sendspecs(fbody, check)
                  })
                } else {
                  sendspecs(fbody, `${check} ${sword}`)
                }
              })
            } else {
              request.get({
                url: `https://www.devicespecifications.com/index.php?action=search&language=${language}&search=${check}`
              }, function(err, response, fbody){
                if(fbody === "0") return sendspecs(fbody, search)
                sendspecs(fbody, check)
              })
            }
          } else {
            sendspecs(fbody, search)
          }
        }
			});
		} else {
			send(lang.specs.nosrch)
		}
	//MIUI Latest
	} else if(content.startsWith(`${prefix}miui`)){
		var cont = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim();
		var cdn = cont.split(" ")[1].replace("_sprout", "");
    var real = cont.split(" ")[1];
		if(cdn !== undefined){
			function eea(rjson, fjson){var r = rjson.filter(c => c.version.indexOf("EU") !== -1)[0];var f = fjson.filter(c => c.version.indexOf("EU") !== -1)[0];if(r !== undefined){return `**EEA**: \`${r.version}\`: [recovery](${r.download}) \`${r.size}\` | [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function china(rjson, fjson){var r = rjson.filter(c => c.version.indexOf("CN") !== -1)[0];var f = fjson.filter(c => c.version.indexOf("CN") !== -1)[0];if(r !== undefined){return `**China**: \`${r.version}\`: [recovery](${r.download}) \`${r.size}\` | [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function global(rjson, fjson){var r = rjson.filter(c => c.version.indexOf("MI") !== -1)[0];var f = fjson.filter(c => c.version.indexOf("MI") !== -1)[0];if(r !== undefined){return `**Global**: \`${r.version}\`: [recovery](${r.download}) \`${r.size}\` | [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function india(rjson, fjson){var r = rjson.filter(c => c.version.indexOf("IN") !== -1)[0];var f = fjson.filter(c => c.version.indexOf("IN") !== -1)[0];if(r !== undefined){return `**India**: \`${r.version}\`: [recovery](${r.download}) \`${r.size}\` | [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function russia(rjson, fjson){var r = rjson.filter(c => c.version.indexOf("RU") !== -1)[0];var f = fjson.filter(c => c.version.indexOf("RU") !== -1)[0];if(r !== undefined){return `**Russia**: \`${r.version}\`: [recovery](${r.download}) \`${r.size}\` | [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function developer(rjson, fjson){return `**MIUI ${lang.version}**: \`${rjson.version}\`\n**Android ${lang.version}**: \`${rjson.android}\`\n**${lang.download}**: [recovery](${rjson.download}) \`${rjson.size}\` | [fastboot](${fjson.download}) \`${fjson.size}\``}
			function feea(fjson){var f = fjson.filter(c => c.version.indexOf("EU") !== -1)[0];if(f !== undefined){return `**EEA**: \`${f.version}\`: [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function fchina(fjson){var f = fjson.filter(c => c.version.indexOf("CN") !== -1)[0];if(f !== undefined){return `**China**: \`${f.version}\`: [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function fglobal(fjson){var f = fjson.filter(c => c.version.indexOf("MI") !== -1)[0];if(f !== undefined){return `**Global**: \`${f.version}\`: [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function findia(fjson){var f = fjson.filter(c => c.version.indexOf("IN") !== -1)[0];if(f !== undefined){return `**India**: \`${f.version}\`: [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function frussia(fjson){var f = fjson.filter(c => c.version.indexOf("RU") !== -1)[0];if(f !== undefined){return `**Russia**: \`${f.version}\`: [fastboot](${f.download}) \`${f.size}\` | \`Android ${f.android}\`\n`} else {return ""}}
			function fdeveloper(fjson){return `**MIUI ${lang.version}**: \`${fjson.version}\`\n**Android ${lang.version}**: \`${fjson.android}\`\n**${lang.download}**: [fastboot](${fjson.download}) \`${fjson.size}\``}
			if(cdn === "stable"){
				cdn = cont.split(" ")[2];
				request({
					url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_fastboot/stable_fastboot.json", json:true
				}, function(ferr, fresp, fjson){
					request({
						url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_recovery/stable_recovery.json", json:true
					}, function(rerr, rresp, rjson){
						fjson = Object.values(fjson).filter(c => c.codename.indexOf(cdn) !== -1);
						rjson = Object.values(rjson).filter(c => c.codename.indexOf(cdn) !== -1);
						if(rjson[0] !== undefined || fjson[0] !== undefined){
							if(rjson[0] !== undefined && fjson[0] !== undefined){
								var e = new Discord.RichEmbed()
									.setTitle(`MIUI Stable | ${devicename(real)}`)
									.setColor(0xFF740E)
									.setDescription(china(rjson, fjson)+global(rjson, fjson)+eea(rjson, fjson)+russia(rjson, fjson)+india(rjson, fjson))
								send(e)
							} else {
								var e = new Discord.RichEmbed()
									.setTitle(`MIUI Stable | ${devicename(real)}`)
									.setColor(0xFF740E)
									.setDescription(fchina(fjson)+fglobal(fjson)+feea(fjson)+frussia(fjson)+findia(fjson))
								send(e)
							}
						} else {
							request({
								url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_fastboot/stable_fastboot.json", json:true
							}, function(ferr, fresp, fjson){
								request({
									url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_recovery/stable_recovery.json", json:true
								}, function(rerr, rresp, rjson){
									fjson = Object.values(fjson).filter(c => c.codename.indexOf(cdn) !== -1);
									rjson = Object.values(rjson).filter(c => c.codename.indexOf(cdn) !== -1);
									if(rjson[0] !== undefined || fjson[0] !== undefined){
										if(rjson[0] !== undefined && fjson[0] !== undefined){
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI Stable | ${devicename(real)}`)
												.setColor(0xFF740E)
												.setDescription(china(rjson, fjson)+global(rjson, fjson)+eea(rjson, fjson)+russia(rjson, fjson)+india(rjson, fjson))
											send(e)
										} else {
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI Stable | ${devicename(real)}`)
												.setColor(0xFF740E)
												.setDescription(fchina(fjson)+fglobal(fjson)+feea(fjson)+frussia(fjson)+findia(fjson))
											send(e)
										}
									} else {
										send(lang.miui.nos.replace("{model}", devicename(real)))
									}
								})
							})
						}
					})
				})
			} else if(cdn === "weekly" || cdn === "developer"){
				cdn = cont.split(" ")[2];
				request({
					url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_fastboot/weekly_fastboot.json", json:true
				}, function(ferr, fresp, fjson){
					request({
						url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_recovery/weekly_recovery.json", json:true
					}, function(rerr, rresp, rjson){
						fjson = Object.values(fjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
						rjson = Object.values(rjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
						if(rjson !== undefined || fjson !== undefined){
							if(rjson !== undefined && fjson !== undefined){
								var e = new Discord.RichEmbed()
									.setTitle(`MIUI Developer | ${devicename(real)}`)
									.setColor(0xFF740E)
									.setDescription(developer(rjson, fjson))
								send(e)
							} else {
								var e = new Discord.RichEmbed()
									.setTitle(`MIUI Developer | ${devicename(real)}`)
									.setColor(0xFF740E)
									.setDescription(fdeveloper(fjson))
								send(e)
							}
						} else {
							request({
								url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_fastboot/weekly_fastboot.json", json:true
							}, function(ferr, fresp, fjson){
								request({
									url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_recovery/weekly_recovery.json", json:true
								}, function(rerr, rresp, rjson){
									fjson = Object.values(fjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
									rjson = Object.values(rjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
									if(rjson !== undefined || fjson !== undefined){
										if(rjson !== undefined && fjson !== undefined){
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI Developer | ${devicename(real)}`)
												.setColor(0xFF740E)
												.setDescription(developer(rjson, fjson))
											send(e)
										} else {
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI Developer | ${devicename(real)}`)
												.setColor(0xFF740E)
												.setDescription(fdeveloper(fjson))
											send(e)
										}
									} else {
										send(lang.miui.nod.replace("{model}", devicename(real)))
									}
								})
							})
						}
					})
				})
			} else {
				request({
					url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_fastboot/stable_fastboot.json", json:true
				}, function(sferr, sfresp, sfjson){
					request({
						url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/stable_recovery/stable_recovery.json", json:true
					}, function(srerr, srresp, srjson){
						request({
							url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_fastboot/weekly_fastboot.json", json:true
						}, function(wferr, wfresp, wfjson){
							request({
								url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/weekly_recovery/weekly_recovery.json", json:true
							}, function(wrerr, wrresp, wrjson){
								sfjson = Object.values(sfjson).filter(c => c.codename.indexOf(cdn) !== -1);
								srjson = Object.values(srjson).filter(c => c.codename.indexOf(cdn) !== -1);
								wfjson = Object.values(wfjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
								wrjson = Object.values(wrjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
								if(srjson[0] !== undefined || sfjson[0] !== undefined){
									if(srjson[0] !== undefined && sfjson[0] !== undefined){
										if(wfjson !== undefined){
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI | ${devicename(real)}\nStable:`)
												.setColor(0xFF740E)
												.setDescription(china(srjson, sfjson)+global(srjson, sfjson)+eea(srjson, sfjson)+russia(srjson, sfjson)+india(srjson, sfjson))
												.addField("Developer:", developer(wrjson, wfjson))
											send(e)
										} else {
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI | ${devicename(real)}\nStable:`)
												.setColor(0xFF740E)
												.setDescription(china(srjson, sfjson)+global(srjson, sfjson)+eea(srjson, sfjson)+russia(srjson, sfjson)+india(srjson, sfjson))
											send(e)
										}
									} else {
										if(wfjson !== undefined){
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI | ${devicename(real)}\nStable:`)
												.setColor(0xFF740E)
												.setDescription(fchina(sfjson)+fglobal(sfjson)+feea(sfjson)+frussia(sfjson)+findia(sfjson))
												.addField("Developer:", fdeveloper(wfjson))
											send(e)
										} else {
											var e = new Discord.RichEmbed()
												.setTitle(`MIUI | ${devicename(real)}\nStable:`)
												.setColor(0xFF740E)
												.setDescription(fchina(sfjson)+fglobal(sfjson)+feea(sfjson)+frussia(sfjson)+findia(sfjson))
											send(e)
										}
									}
								} else {
									request({
										url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_fastboot/stable_fastboot.json", json:true
									}, function(sferr, sfresp, sfjson){
										request({
											url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/stable_recovery/stable_recovery.json", json:true
										}, function(srerr, srresp, srjson){
											request({
												url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_fastboot/weekly_fastboot.json", json:true
											}, function(wferr, wfresp, wfjson){
												request({
													url: "https://raw.githubusercontent.com/XiaomiFirmwareUpdater/miui-updates-tracker/master/EOL/weekly_recovery/weekly_recovery.json", json:true
												}, function(wrerr, wrresp, wrjson){
													sfjson = Object.values(sfjson).filter(c => c.codename.indexOf(cdn) !== -1);
													srjson = Object.values(srjson).filter(c => c.codename.indexOf(cdn) !== -1);
													wfjson = Object.values(wfjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
													wrjson = Object.values(wrjson).filter(c => c.codename.indexOf(cdn) !== -1)[0];
													if(srjson[0] !== undefined || sfjson[0] !== undefined){
														if(srjson[0] !== undefined && sfjson[0] !== undefined){
															if(wfjson !== undefined){
																var e = new Discord.RichEmbed()
																	.setTitle(`MIUI | ${devicename(real)}\nStable:`)
																	.setColor(0xFF740E)
																	.setDescription(china(srjson, sfjson)+global(srjson, sfjson)+eea(srjson, sfjson)+russia(srjson, sfjson)+india(srjson, sfjson))
																	.addField("Developer:", developer(wrjson, wfjson))
																send(e)
															} else {
																var e = new Discord.RichEmbed()
																	.setTitle(`MIUI | ${devicename(real)}\nStable:`)
																	.setColor(0xFF740E)
																	.setDescription(china(srjson, sfjson)+global(srjson, sfjson)+eea(srjson, sfjson)+russia(srjson, sfjson)+india(srjson, sfjson))
																send(e)
															}
														} else {
															if(wfjson !== undefined){
																var e = new Discord.RichEmbed()
																	.setTitle(`MIUI | ${devicename(real)}\nStable:`)
																	.setColor(0xFF740E)
																	.setDescription(fchina(sfjson)+fglobal(sfjson)+feea(sfjson)+frussia(sfjson)+findia(sfjson))
																	.addField("Developer:", fdeveloper(wfjson))
																send(e)
															} else {
																var e = new Discord.RichEmbed()
																	.setTitle(`MIUI | ${devicename(real)}\nStable:`)
																	.setColor(0xFF740E)
																	.setDescription(fchina(sfjson)+fglobal(sfjson)+feea(sfjson)+frussia(sfjson)+findia(sfjson))
																send(e)
															}
														}
													} else {
														send(lang.miui.nog.replace("{model}", devicename(real)));
													}
												})
											})
										})
									})
								}
							})
						})
					})
				})
			}
		} else {
			send(lang.miui.noc.replace("{version}", "`stable`|`developer`/`weekly`"))
		}
	//Gcam
	} else if(content.startsWith(`${prefix}gcam`)){
	    var dev = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1]
	    let Parser = require('rss-parser');
	    let parser = new Parser();
	    let feed = await parser.parseURL('https://www.celsoazevedo.com/files/android/google-camera/dev-feed.xml');
	    var items = feed.items;
	    var desc;
	    if(dev !== undefined){
	      var arr = [];
	      for(var i = 0; i<items.length; i++){
		if(items[i].title.toLowerCase().indexOf(`${dev}:`) !== -1){
		  arr.push(items[i])
		}
	      }
	      if(arr[0] !== undefined){
		for(var i = 0; i<10; i++){
		  try{
		    var a = arr[i].title.split(": ")[0]
		    var d = arr[i].title.split(": ")[1]
		    desc += `[${d}](${arr[i].link})\n`
		  } catch(e){}
		}
		var l;
		if(arr.length > 10){
		  l = 10
		} else {
		  l = arr.length
		}
		var e = new Discord.RichEmbed()
		  .setTitle(`${lang.gcam.latest.replace("{n}", l)} ${lang.gcam.dev} ${arr[0].title.split(": ")[0]}`)
		  .setColor(0xFFFFFF)
		  .setDescription(desc.replace(undefined, ""))
		send(e)
	      } else {
		send(lang.gcam.no)
	      }
	    } else {
	      for(var i = 0; i<10; i++){
		var a = items[i].title.split(": ")[0]
		var d = items[i].title.split(": ")[1]
		desc += `**${a}**: [${d}](${items[i].link})\n`
	      }
	      var e = new Discord.RichEmbed()
		.setTitle(lang.gcam.latest.replace("{n}", "10"))
		.setColor(0xFFFFFF)
		.setDescription(desc.replace(undefined, ""))
	      send(e)
	    }
  } else if(content.startsWith(".reboot") || content.startsWith(".restart")){
    if(message.author.id !== config.owner) return;
    message.channel.send(`Restarting...`).then(msg => process.exit(1))
  } else if(content.startsWith(`${prefix}disable`)){
    if(message.author.id !== config.owner) return;
    var rom = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(' ')[1];
    var json = require("./disable.json");
    var roms = Object.keys(json);
    if(!roms.includes(rom)) return send(`please enter the rom you want to disable/enable : ${roms.map(n => "`"+n+"`").join(", ")}`)
    var status;
    if(!json[rom]){
      status = "enabled"
    } else {
      status = "disabled"
    }
    var e = new Discord.RichEmbed()
      .setTitle(`Disable/Enable \`${rom}\` command`)
      .setDescription(`**Status**: \`${status}\`\n\n✅: Enable\n❌: Disable\n↩: Cancel`)
    message.channel.send(e).then(async (msg) => {
      var time = new Date().getTime() + 150000
      var ed = false;
      const writeFile = require("write-file");
      client.on("messageReactionAdd", (reaction, user) => {
        if(new Date().getTime() > time || reaction.message.id !== msg.id || ed) return;
        if(reaction.emoji.name === "✅" && user.id === config.owner){
          json[rom] = false
          writeFile('./disable.json', JSON.stringify(json, null, 4), function(err){if (err) throw err})
          ed = true
          msg.edit(new Discord.RichEmbed().setTitle(`the command \`${rom}\` have been enabled`))
        } else if(reaction.emoji.name === "❌" && user.id === config.owner){
          json[rom] = true
          writeFile('./disable.json', JSON.stringify(json, null, 4), function(err){if (err) throw err})
          ed = true
          msg.edit(new Discord.RichEmbed().setTitle(`the command \`${rom}\` have been disabled`))
        } else if(reaction.emoji.name === "↩" && user.id === config.owner){
          ed = true
          msg.edit(new Discord.RichEmbed().setTitle(`canceled`))
        }
      });
      await msg.react("✅");
      await msg.react("❌");
      await msg.react("↩");
    });
  }
});

//Play Store
client.on("message", message => {
	const content = message.content.toLowerCase();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	var l;
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			l = guildfile[message.guild.id].lang;
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			l = "en";
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
		l = "en";
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
	function chunk(array, size){const chunked_arr = [];for(let i = 0; i < array.length; i++){const last = chunked_arr[chunked_arr.length - 1];if(!last || last.length === size){chunked_arr.push([array[i]]);} else {last.push(array[i]);}}return chunked_arr}
	function cut(text, length){if(text == null){return "";}if (text.length <= length) {return text;}return text.substring(0, length).substring(0, text.lastIndexOf(" ")) + "..."}
	if(content.startsWith(`${prefix}gplay`)){
		var opt = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1]
		var cont = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(1).join(" ")
		function sendgh(){
			var e = new Discord.RichEmbed()
				.setTitle("Google Play")
				.addField(lang.gplay.sendgh.usage+":", `\`${prefix}gplay <option>\``)
				.addField(lang.gplay.sendgh.opt+":", "`app`: "+lang.gplay.sendgh.apph+"\n`search`: "+lang.gplay.sendgh.searchh+"\n`perms`: "+lang.gplay.sendgh.permsh)
			send(e)
		}
		if(opt !== undefined){
			var check = cont.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1]
			if(opt === "app"){
				if(check !== undefined){
					gplay.app({appId: check, lang: l}).then(json => {
						var e = new Discord.RichEmbed()
							.setTitle(json.title).setURL(json.url).setThumbnail(json.icon)
							.setDescription(json.summary)
							.addField(lang.gplay.app.price, json.priceText, true)
							.addField(lang.gplay.app.installs, json.installs, true)
							.addField(lang.gplay.app.av, json.androidVersionText, true)
							.addField(lang.gplay.app.size, json.size, true)
							.addField(lang.gplay.app.score, json.scoreText, true)
							.addField(lang.gplay.app.genre, json.genre, true)
							.setFooter(`${lang.gplay.app.by} ${json.developer} | ${json.appId}`)
						send(e)
					}).catch(err => {
						send(lang.gplay.app.noapp);
					});
				} else {
					var e = new Discord.RichEmbed()
						.setTitle(lang.gplay.sendgh.app)
						.addField(lang.gplay.sendgh.usage+":", `\`${prefix}gplay app <appID>\``)
						.addField(lang.gplay.sendgh.example+":", `\`${prefix}gplay app com.google.android.apps.messaging\``)
					send(e)
				}
			} else if(opt === "search"){
				if(check !== undefined){
					gplay.search({term: cont.split(" ").slice(1).join(" "), num: 1, lang: l}).then(m => {
						gplay.app({appId: m[0].appId, lang: l}).then(json => {
							var e = new Discord.RichEmbed()
								.setTitle(json.title).setURL(json.url).setThumbnail(json.icon)
								.setDescription(json.summary)
								.addField(lang.gplay.app.price, json.priceText, true)
								.addField(lang.gplay.app.installs, json.installs, true)
								.addField(lang.gplay.app.av, json.androidVersionText, true)
								.addField(lang.gplay.app.size, json.size, true)
								.addField(lang.gplay.app.score, json.scoreText, true)
								.addField(lang.gplay.app.genre, json.genre, true)
								.setFooter(`${lang.gplay.app.by} ${json.developer} | ${json.appId}`)
							send(e)
						})
					}).catch(err => {
						send(lang.gplay.app.nosrch)
					});
				} else {
					var e = new Discord.RichEmbed()
						.setTitle(lang.gplay.sendgh.search)
						.addField(lang.gplay.sendgh.usage+":", `\`${prefix}gplay search <appName>\``)
						.addField(lang.gplay.sendgh.example+":", `\`${prefix}gplay search google message\``)
					send(e)
				}
			} else if(opt === "perms"){
				function sendh(){
					var e = new Discord.RichEmbed()
						.setTitle(lang.gplay.sendgh.perms)
						.addField(lang.gplay.sendgh.usage+":", `${lang.gplay.perms.id}: \`${prefix}gplay perms id <appID>\`\n${lang.gplay.perms.name}: \`${prefix}gplay perms name <appName>\``)
						.addField(lang.gplay.sendgh.example+":", `${lang.gplay.perms.id}: \`${prefix}gplay perms id com.google.android.apps.messaging\`\n${lang.gplay.perms.name}: \`${prefix}gplay perms name google message\``)
					send(e)
				}
				if(check !== undefined){
					opt = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[2]
          cont = content.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ").slice(2).join(" ")
					if(opt !== undefined){
						check = cont.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1]
						if(opt === "id"){
							if(check !== undefined){
                var id = cont.replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim().split(" ")[1]
								gplay.app({appId: id, lang: l}).then(app => {
									gplay.permissions({appId: check, lang: l}).then(json => {
										var desc = `${json[0].permission}`;
										for(let i = 1; i < json.length; i++){
											desc += `**,** ${json[i].permission}`
										}
										var e = new Discord.RichEmbed()
											.setTitle(lang.gplay.perms.for + app.title)
											.setFooter(app.appId)
										    .setDescription(cut(desc, 2045));
										send(e)
									}).catch(err => {
										send(lang.gplay.perms.nopermid);
									})
								}).catch(err => {
									send(lang.gplay.perms.noappid);
								});
							} else {
								sendh()
							}
						} else if(opt === "name"){
							if(check !== undefined){
								gplay.search({term: cont.split(" ").slice(1).join(" "), num: 1, lang: l}).then(m => {
									gplay.app({appId: m[0].appId, lang: l}).then(app => {
										gplay.permissions({appId: app.appId, lang: l}).then(json => {
											var desc = `${json[0].permission}`;
											for(let i = 1; i < json.length; i++){
												desc += `**,** ${json[i].permission}`
											}
											var e = new Discord.RichEmbed()
												.setTitle(lang.gplay.perms.for + app.title)
												.setFooter(app.appId)
											    .setDescription(cut(desc, 2045));
											send(e)
										}).catch(err => {
											send(lang.gplay.perms.nopermname+"\nappName: " + app.title);
										})
									})
								}).catch(err => {
									send(lang.gplay.perms.noappname)
								});
							} else {
								sendh()
							}
						} else {
							sendh()
						}
					} else {
						sendh()
					}
				} else {
					sendh()
				}
			} else {
				sendgh()
			}
		} else {
			sendgh()
		}
	}
});
		
//Custom ROM
client.on("message", message => {
	const content = message.content.toLowerCase().replace( /\\'/g, '\'' ).replace( /\\t/g, '' ).replace(/\s\s+/g, ' ').replace(/(\n|\r)+$/, '').trim();
	const channel = message.channel;
	const member = message.member;
	const author = message.author;
	const guildfile = require('./guild.json');
	if(message.channel.type !== "dm"){
		if(guildfile[message.guild.id] !== undefined){
			lang = langfile[guildfile[message.guild.id].lang];
			prefix = guildfile[message.guild.id].prefix
		} else {
			lang = langfile['en'];
			guildfile[message.guild.id] = {
				lang: 'en',
				prefix: config.prefix
			}
			fs.writeFile('./guild.json', JSON.stringify(guildfile, null, 4), err => {
				if(err) throw err;
			})
		}
	} else {
		lang = langfile['en'];
	}
	function send(msg){channel.send(msg)};
	function sendmp(msg){author.send(msg).catch(() => send(msg))};
  const djson = require("./disable.json");
	async function rom(url, urlup, body, btlg, cosp, crdroid, xml, dirty, error, end, cdn, cdnup, bkpurl, bkpurlup, posp) {
		return new Promise(function(resolve, reject){
			if(body){
				if(error){
					request({
						url
					}, function(err, responses, bodyurl){
						if(responses.statusCode === 200){
							if(end){
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} else {
								resolve(JSON.parse(bodyurl))
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200){
									if(end){
										resolve(JSON.parse(bodyurl).slice(-1)[0])
									} else {
										resolve(JSON.parse(bodyurl))
									}
								} else {
									resolve(false);
								}
							});
						}
					});
				} else {
					request({
						url
					}, function(err, responses, bodyurl){
						if(responses.statusCode === 200 && JSON.parse(bodyurl).error === "false" || !JSON.parse(bodyurl).error){
							if(end){
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} else {
								resolve(JSON.parse(bodyurl))
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).error === "false" || !JSON.parse(bodyurl).error){
									if(end){
										resolve(JSON.parse(bodyurl).slice(-1)[0])
									} else {
										resolve(JSON.parse(bodyurl))
									}
								} else {
									resolve(false);
								}
							});
						}
					});
				}
			} else if(btlg){
				request({
					url
				}, function(err, responses, bodyurl){
					if(responses.statusCode === 200 && JSON.parse(bodyurl)[cdn] !== undefined){
						resolve(JSON.parse(bodyurl)[cdn])
					} else {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							if(responses.statusCode === 200 && JSON.parse(bodyurl)[cdnup] !== undefined){
								resolve(JSON.parse(bodyurl)[cdnup])
							} else {
								resolve(false);
							}
						});
					}
				});
			} else if(cosp){
				request({
					url: `https://mirror.codebucket.de/cosp/getdevices.php`
				}, function(err, responses, bodyurl) {
					var body = JSON.parse(bodyurl);
					var response = body.includes(cdn);
					if(response){
						request({
							url: `https://ota.cosp-project.org/latestDownload?device=${cdn}`
						}, function(err, responses, bodyurl) {
							if(JSON.parse(bodyurl).error) return resolve(false);
							resolve(JSON.parse(bodyurl))
						});
					} else {
						request({
							url: `https://mirror.codebucket.de/cosp/getdevices.php`
						}, function(err, responses, bodyurl) {
							var body = JSON.parse(bodyurl);
							var response = body.includes(cdnup);
							if(response){
								request({
									url: `https://ota.cosp-project.org/latestDownload?device=${cdn}`
								}, function(err, responses, bodyurl) {
									if(JSON.parse(bodyurl).error) return resolve(false);
									resolve(JSON.parse(bodyurl))
								});
							} else {
								resolve(false)
							}
						});
					}
				});
			} else if(xml){
				request({
					url
				}, function(err, responses, bodyurl) {
					try {
						var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
						resolve(body);
					} catch(err) {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							try {
								var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
								resolve(body);
							} catch(err) {
								resolve(false);
							}
						});
					}
				});
			} else if(crdroid){
				request({
					url
				}, function(err, responses, bodyurl) {
					var body = convert.xml2json(bodyurl, {compact: true, spaces: 4});
					function resp(){
						try {
							return JSON.parse(body).OTA.manufacturer.find((m) => m[cdn] !== undefined)[cdn];
						} catch (err) {
							try {
								return JSON.parse(body).OTA.manufacturer.find((m) => m[cdnup] !== undefined)[cdnup];
							} catch (err) {
								return false;
							}
						}
					}
					var response = resp()
					if(response){
						resolve(response);
					} else {
						resolve(false);
					}
				});
			} else if(dirty){
				request({
					url
				}, function(err, responses, bodyurl){
					try {
						resolve(JSON.parse(bodyurl).slice(-1)[0])
					} catch(err) {
						request({
							url: urlup
						}, function(err, responses, bodyurl) {
							try {
								resolve(JSON.parse(bodyurl).slice(-1)[0])
							} catch(err) {
								resolve(false);
							}
						});
					}
				});
			} else {
				request({
					url
				}, function(err, responses, bodyurl){
					try{
						if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
							if(end){
								if(posp){
									var json = {};
									json["bkp"] = false
									json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
									resolve(json)
								} else {
									resolve(JSON.parse(bodyurl).response.slice(-1)[0])
								}
							} else {
								resolve(JSON.parse(bodyurl).response[0])
							}
						} else {
							request({
								url: urlup
							}, function(err, responses, bodyurl) {
								if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
									if(end){
										if(posp){
											var json = {};
											json["bkp"] = false
											json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
											resolve(json)
										} else {
											resolve(JSON.parse(bodyurl).response.slice(-1)[0])
										}
									} else {
										resolve(JSON.parse(bodyurl).response[0])
									}
								} else {
									resolve(false);
								}
							});
						}
					} catch (err) {
						request({
							url: bkpurl
						}, function(err, responses, bodyurl){
							if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
								if(end){
									if(posp){
										var json = {};
										json["bkp"] = true
										json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
										resolve(json)
									} else {
										resolve(JSON.parse(bodyurl).response.slice(-1)[0])
									}
								} else {
									resolve(JSON.parse(bodyurl).response[0])
								}
							} else {
								request({
									url: bkpurlup
								}, function(err, responses, bodyurl) {
									if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
										if(posp){
											var json = {};
											json["bkp"] = true
											json["json"] = JSON.parse(bodyurl).response.slice(-1)[0]
											resolve(json)
										} else {
											resolve(JSON.parse(bodyurl).response[0])
										}
									} else {
										resolve(false);
									}
								});
							}
						});
					}
				});
			}
		});
	}
	//HavocOS
	if(content.startsWith(`${prefix}havoc`) || content.startsWith(`${prefix}havocos`)){
    if(djson.havoc){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0x1A73E8)
              .setTitle(`HavocOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed})
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//PixysOS
	} else if(content.startsWith(`${prefix}pixy`) || content.startsWith(`${prefix}pixys`) || content.startsWith(`${prefix}pixysos`)){
    if(djson.pixys){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/"
        rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0x9abcf2)
              .setTitle(`PixysOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//PearlOS
	} else if(content.startsWith(`${prefix}pearl`) || content.startsWith(`${prefix}pearlos`)){
    if(djson.pearl){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/PearlOS/OTA/master/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0x4d7dc4)
              .setTitle(`PearlOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//DotOS
	} else if(content.startsWith(`${prefix}dotos` || content.startsWith(`${prefix}dot`))){
    if(djson.dot){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/DotOS/ota_config/dot-p/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xef2222)
              .setTitle(`DotOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//ResurrectionRemix
	} else if(content.startsWith(`${prefix}rr`) || content.startsWith(`${prefix}resurrection`) || content.startsWith(`${prefix}resurrectionremix`) || content.startsWith(`${prefix}rros`)){
    if(djson.rr){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            var url = response.url;
            if(url.includes("sourceforge")) url = `https://get.resurrectionremix.com/${response.filename.split("-")[4]}/${response.filename}`
            const embed = new Discord.RichEmbed()
              .setColor(0x1A1C1D)
              .setTitle(`Resurrection Remix | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//SuperiorOS
	} else if(content.startsWith(`${prefix}superior`) || content.startsWith(`${prefix}superioros`)){
    if(djson.superior){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase
        const start = "https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xbe1421)
              .setTitle(`SuperiorOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//ViperOS
	} else if(content.startsWith(`${prefix}viper`) || content.startsWith(`${prefix}viperos`)){
    if(djson.viper){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/Viper-Devices/official_devices/master/"
        if(codename === "daisy"){
          rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`, true).then(response => {
            if(response){
              const embed = new Discord.RichEmbed()
                .setColor(0x4184f4)
                .setTitle(`ViperOS | ${devicename(codename)}`)
                .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
              send({embed});
            } else {
              send(lang.romerr+" `"+devicename(codename)+"`")
            }
          });
        } else {
          rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
            if(response){
              const embed = new Discord.RichEmbed()
                .setColor(0x4184f4)
                .setTitle(`ViperOS | ${devicename(codename)}`)
                .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
              send({embed});
            } else {
              send(lang.romerr+" `"+devicename(codename)+"`")
            }
          });
        }
      } else {
        send(lang.cdnerr)
      }
    }
	//LineageOS
	} else if(content.startsWith(`${prefix}lineage`) || content.startsWith(`${prefix}los`)){
    if(djson.los){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://download.lineageos.org/api/v1/"
        rom(`${start}${codename}/nightly/*`, `${start}${codenameup}/nightly/*`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0x167C80)
              .setTitle(`LineageOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Evolution-X
	} else if(content.startsWith(`${prefix}evo`) || content.startsWith(`${prefix}evox`) || content.startsWith(`${prefix}evolutionx`)){
    if(djson.evo){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, false, false, true).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xb0c9ce)
              .setTitle(`Evolution-X | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//AOSP Extended AEX
	} else if(content.startsWith(`${prefix}aex`) || content.startsWith(`${prefix}aospextended`)){
    if(djson.aex){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://api.aospextended.com/ota/"
        //Pie
        rom(`${start}${codename}/pie`, `${start}${codenameup}/pie`, true).then(pie => {
        //Oreo
        rom(`${start}${codename}/oreo`, `${start}${codenameup}/oreo`, true).then(oreo => {
          function check(response){
            if(response){
              return "**"+lang.date+"**: **`"+`${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+pretty(response.filesize)+"`**\n**"+lang.version+"**: **`"+response.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0xf8ba00)
            .setTitle(`AEX | ${devicename(codename)}`)
            .addField("Pie", check(pie))
            .addField("Oreo", check(oreo))
          send({embed})
        })});
      } else {
        send(lang.cdnerr)
      }
    }
	//BootleggersROM
	} else if(content.startsWith(`${prefix}bootleggers`) || content.startsWith(`${prefix}btlg`)){
    if(djson.btlg){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://bootleggersrom-devices.github.io/api/devices.json"
        rom(start, start, false, true, false, false, false, false, false, false, codename, codenameup).then(response => {
          if(response){
            function size(size, prettysize){
              if(prettysize === "0 Bytes"){
                if(size.indexOf("(") !== -1){
                  return size.split('(')[0]
                } else {
                  return size
                }
              } else {
                return prettysize
              }
            }
            const embed = new Discord.RichEmbed()
              .setColor(0x515262)
              .setTitle(`BootleggersROM | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `${response.filename.split('-')[4].substring(0, 4)}-${response.filename.split('-')[4].substring(4, 6)}-${response.filename.split('-')[4].substring(6, 8)}` +"`**\n**"+lang.size+"**: **`"+size(response.buildsize, pretty(response.buildsize))+"`**\n**"+lang.version+"**: **`"+`${response.filename.split('-')[1].split('.')[1]}.${response.filename.split('-')[1].split('.')[2]}`+"`**\n"+`**${lang.download}**: [${response.filename}](${response.download})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Pixel Experience
	} else if(content.startsWith(`${prefix}pe`) || content.startsWith(`${prefix}pixelexperience`)){
    if(djson.pe){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://download.pixelexperience.org/ota_v2/"
        //Pie
        rom(`${start}${codename}/pie`, `${start}${codenameup}/pie`, true).then(pie => {
        //CAF
        rom(`${start}${codename}/pie_caf`, `${start}${codenameup}/pie_caf`, true).then(caf => {
        //Go
        rom(`${start}${codename}/pie_go`, `${start}${codenameup}/pie_go`, true).then(go => {
        //Oreo
        rom(`${start}${codename}/oreo`, `${start}${codenameup}/oreo`, true).then(oreo => {
          function check(response){
            if(response){
              return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0xf8ba00)
            .setTitle(`Pixel Experience | ${devicename(codename)}`)
            .addField("Pie", check(pie))
            .addField("Pie-CAF", check(caf))
            .addField("Pie Go", check(go))
            .addField("Oreo", check(oreo))
          send({embed})
        })})})});
      } else {
        send(lang.cdnerr)
      }
    }
	//Potato Open Source Project POSP
	} else if(content.startsWith(`${prefix}posp`) || content.startsWith(`${prefix}potato`) || content.startsWith(`${prefix}potatorom`)){
    if(djson.posp){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://api.potatoproject.co/checkUpdate?device="
        const bkp = "http://api.strangebits.co.in/checkUpdate?device="
        //Weekly
        rom(`${start}${codename}&type=weekly`, `${start}${codenameup}&type=weekly`, false, false, false, false, false, false, false, true, '', '', `${bkp}${codename}&type=weekly`, `${bkp}${codenameup}&type=weekly`, true).then(week => {
        //Mashed
        rom(`${start}${codename}&type=mashed`, `${start}${codenameup}&type=mashed`, false, false, false, false, false, false, false, true, '', '', `${bkp}${codename}&type=mashed`, `${bkp}${codenameup}&type=mashed`, true).then(mash => {
          function check(resp){
            if(resp.json !== undefined){
              if(resp.bkp){
                var response = resp.json;
                var dl;
                if(response.url.indexOf('mirror.potatoproject.co') !== -1){
                  dl = response.url.replace("mirror.potatoproject.co", "mirror.sidsun.com")
                } else {
                  dl = response.url
                }
                return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
              } else {
                var response = resp.json;
                return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
              }
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0x6a16e2)
            .setTitle(`Potato Open Sauce Project | ${devicename(codename)}`)
            .addField('Weekly', check(week))
            .addField('Mashed', check(mash))
          send({embed})
        })});
      } else {
        send(lang.cdnerr)
      }
    }
	//RevengeOS
	} else if(content.startsWith(`${prefix}revenge`) || content.startsWith(`${prefix}revengeos`)){
    if(djson.revenge){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/RevengeOS/releases/master/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true, false, false, false, false, false, true, true).then(response => {
          if(response){
            var date = response.date.split('/');
            const embed = new Discord.RichEmbed()
              .setColor(0x1395FA)	
              .setTitle(`RevengeOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+`${date[0]}-${date[1]}-${date[2]}`+"`**\n**"+lang.size+"**: **`"+response.size+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.file_name}](https://acc.dl.osdn.jp/storage/g/r/re/revengeos/${codename}/${response.file_name})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//crDroid
	} else if(content.startsWith(`${prefix}crdroid`)){
    if(djson.crdroid){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        rom("https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml", '', false, false, false, true, false, false, false, false, codename, codenameup).then(response => {
          if(response){
            var filename = response.filename._text;
            const embed = new Discord.RichEmbed()
              .setColor(0x31423F)	
              .setTitle(`crDroid | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `${filename.split('-')[2].substring(0, 4)}-${filename.split('-')[2].substring(4, 6)}-${filename.split('-')[2].substring(6, 8)}` +"`**\n**"+lang.version+"**: **`"+filename.split('-')[4]+"`**\n"+`**${lang.download}**: [${filename}](${response.download._text})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Clean Open Source Project COSP
	} else if(content.startsWith(`${prefix}cosp`) || content.startsWith(`${prefix}clean`)){
    if(djson.cosp){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://mirror.codebucket.de/cosp/getdevices.php"
        rom(start, start, false, false, true, false, false, false, false, '', codename, codenameup).then(response => {
          if(response){
            const date = response.date.toString();
            const embed = new Discord.RichEmbed()
              .setColor(0x010101)	
              .setTitle(`Clean Open Source Project | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `20${date.substring(0, 2)}-${date.substring(2, 4)}-${date.substring(4, 6)}` +"`**\n"+`**${lang.download}**: [${response.download.split('/')[5]}](${response.download})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//SyberiaOS
	} else if(content.startsWith(`${prefix}syberia`)){
    if(djson.syberia){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/syberia-project/official_devices/master"
        rom(`${start}/a-only/${codename}.json`, `${start}/a-only/${codenameup}.json`, true, false, false, false, false, false, true).then(a => {
          if(a){
            const embed = new Discord.RichEmbed()
              .setColor(0xDF766E)
              .setTitle(`Syberia | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `${a.build_date.substring(0, 4)}-${a.build_date.substring(4, 6)}-${a.build_date.substring(6, 8)}` +"`**\n**"+lang.size+"**: **`"+pretty(a.filesize)+"`**\n**"+lang.version+"**: **`"+a.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${a.filename}](${a.url})`)
            send({embed});
          } else {
            function abcdn(code){
              if(code === 'fajita' || code === 'FAJITA'){
                return 'OnePlus6T'
              } else if(code === 'enchilada' || code === 'ENCHILADA'){
                return 'OnePlus6'
              } else {
                return code
              }
            }
            rom(`${start}/ab/${abcdn(codename)}.json`, `${start}/ab/${abcdn(codenameup)}.json`).then(ab => {
              if(ab){
                const embed = new Discord.RichEmbed()
                  .setColor(0xDF766E)
                  .setTitle(`Syberia | ${devicename(codename)}`)
                  .setDescription("**"+lang.date+"**: **`"+timeConverter(ab.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(ab.size)+"`**\n**"+lang.version+"**: **`"+ab.version+"`**\n"+`**${lang.download}**: [${ab.filename}](${ab.url})`)
                send({embed});
              } else {
                send(lang.romerr+" `"+devicename(codename)+"`")
              }
            })
          }
        })
      } else {
        send(lang.cdnerr)
      }
    }
	//AOSiP
	} else if(content.startsWith(`${prefix}aosip`) || content.startsWith(`${prefix}illusion`)){
    if(djson.aosip){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://aosip.dev/"
        //Official
        rom(`${start}${codename}/official`, `${start}${codenameup}/official`).then(off => {
        //Beta
        rom(`${start}${codename}/beta`, `${start}${codenameup}/beta`).then(beta => {
          function check(response){
            if(response){
              return "**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0x20458B)
            .setTitle(`Android Open Source illusion Project | ${devicename(codename)}`)
            .addField(lang.official, check(off))
            .addField(lang.beta, check(beta))
          send({embed})
        })});
      } else {
        send(lang.cdnerr)
      }
    }
	//ArrowOS
	} else if(content.startsWith(`${prefix}arrow`) || content.startsWith(`${prefix}arrowos`)){
    if(djson.arrow){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://update.arrowos.net/api/v1/"
        rom(`${start}${codename}/official`, `${start}${codenameup}/official`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xe6e6e6)
              .setTitle(`ArrowOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed})
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Liquid Remix
	} else if(content.startsWith(`${prefix}liquid`) || content.startsWith(`${prefix}liquidremix`)){
    if(djson.liquid){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/"
        function op(cdn){
          if(cdn === 'enchilada'){
            return 'oneplus'
          } else {
            return cdn
          }
        }
        rom(`${start}${op(codename)}.xml`, `${start}${codenameup}.xml`, false, false, false, false, true).then(body => {
          if(body){
            function resp(cdn, cdnup) {
              var info = body.SlimOTA.Official[cdn]
              if(info !== undefined){
                return body.SlimOTA.Official[cdn]
              } else {
                return body.SlimOTA.Official[cdnup]
              }
            }
            var response = resp(codename, codenameup);
            var filename = response.Filename._text;
            const embed = new Discord.RichEmbed()
              .setColor(0x2D8CFD)	
              .setTitle(`Liquid Remix | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `${filename.split('-')[1].substring(0, 4)}-${filename.split('-')[1].substring(4, 6)}-${filename.split('-')[1].substring(6, 8)}` +"`**\n"+`**${lang.download}**: [${filename}](${response.RomUrl._text})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Dirty Unicorns
	} else if(content.startsWith(`${prefix}dirty`) || content.startsWith(`${prefix}dirtyunicorns`)){
    if(djson.dirty){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = 'https://download.dirtyunicorns.com/api/files/'
        //Official
        rom(`${start}${codename}/Official`, `${start}${codenameup}/Official`, false, false, false, false, false, true).then(off => {
        //Rc
        rom(`${start}${codename}/Rc`, `${start}${codenameup}/Rc`, false, false, false, false, false, true).then(rc => {
        //Weeklies
        rom(`${start}${codename}/Weeklies`, `${start}${codenameup}/Weeklies`, false, false, false, false, false, true).then(week => {
          function check(response, ver){
            if(response){
              return "**"+lang.date+"**: **`"+`${response.filename.split('-')[2].substring(0, 4)}-${response.filename.split('-')[2].substring(4, 6)}-${response.filename.split('-')[2].substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+response.filesize+"`**\n**"+lang.version+"**: **`"+response.filename.split('-')[1]+"`**\n"+`**${lang.download}**: [${response.filename}](https://download.dirtyunicorns.com/api/download/${response.filename.split('-')[0].split('_')[1]}/${ver}/${response.filename})`
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0xB00300)
            .setTitle(`Dirty Unicorns | ${devicename(codename)}`)
            .addField(lang.official, check(off, "Official"))
            .addField("Rc", check(rc, "Rc"))
            .addField("Weeklies", check(week, "Weeklies"))
          send({embed})
        })})});
      } else {
        send(lang.cdnerr)
      }
    }
	//XenonHD
	} else if(content.startsWith(`${prefix}xenon`) || content.startsWith(`${prefix}xenonhd`)){
    if(djson.xenon){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://mirrors.c0urier.net/android/teamhorizon/P/OTA/"
        //Official
        rom(`${start}ota_${codename}_official.xml`, `${start}ota_${codenameup}_official.xml`, false, false, false, false, true).then(off => {
        //Experimental
        rom(`${start}ota_${codename}_experimental.xml`, `${start}ota_${codenameup}_experimental.xml`, false, false, false, false, true).then(exp => {
          function check(respo, n){
            if(respo){
              function resp(cdn, cdnup) {
                function ver(){
                  if(n === "off"){
                    return off
                  } else {
                    return exp
                  }
                }
                var body = ver();
                var info = body.XenonOTA.Pie[cdn]
                if(info !== undefined){
                  return body.XenonOTA.Pie[cdn]
                } else {
                  return body.XenonOTA.Pie[cdnup]
                }
              }
              var response = resp(codename, codenameup)
              var filename = response.Filename._text;
              return "**"+lang.date+"**: **`"+ `20${filename.split('-')[1].substring(0, 2)}-${filename.split('-')[1].substring(2, 4)}-${filename.split('-')[1].substring(4, 6)}` +"`**\n"+`**${lang.download}**: [${filename}](${response.RomUrl._text})`
            } else {
              return lang.norom
            }
          }
          const embed = new Discord.RichEmbed()
            .setColor(0x009688)
            .setTitle(`XenonHD | ${devicename(codename)}`)
            .addField(lang.official, check(off, "off"))
            .addField(lang.experimental, check(exp, "exp"))
          send({embed})
        })});
      } else {
        send(lang.cdnerr)
      }
    }
	//Kraken Open Tentacles Project KOTP
	} else if(content.startsWith(`${prefix}kotp`) || content.startsWith(`${prefix}kraken`)){
    if(djson.kotp){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xA373EF)
              .setTitle(`Kraken Open Tentacles Project | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(response.datetime)+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//Android Ice Cold Project AICP
	} else if(content.startsWith(`${prefix}aicp`)){
    if(djson.aicp){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "http://ota.aicp-rom.com/update.php?device="
        rom(`${start}${codename}`, `${start}${codenameup}`, true).then(response => {
          if(response){
            response = response.updates[0]
            var filename = response.name;
            const embed = new Discord.RichEmbed()
              .setColor(0xB3B5B3)
              .setTitle(`Android Ice Cold Project | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+`${filename.split("-")[3].substring(0, 4)}-${filename.split("-")[3].substring(4, 6)}-${filename.split("-")[3].substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+response.size+"MB"+"`**\n**"+lang.version+"**: **`"+response.version.split("\n")[0]+"`**\n"+`**${lang.download}**: [${filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//NitrogenOS
	} else if(content.startsWith(`${prefix}nitrogen`) || content.startsWith(`${prefix}nitrogenos`)){
    if(djson.nitrogen){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase
        const start = "https://raw.githubusercontent.com/nitrogen-project/OTA/p/"
        rom(`${start}${codename}.json`, `${start}${codenameup}.json`, true).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0x009999)
              .setTitle(`NitrogenOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+`${response.build_date.substring(0, 4)}-${response.build_date.substring(4, 6)}-${response.build_date.substring(6, 8)}`+"`**\n**"+lang.size+"**: **`"+pretty(response.filesize)+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//CerberusOS 
	} else if(content.startsWith(`${prefix}cerberus`) || content.startsWith(`${prefix}cerberusos`)){
    if(djson.cerberus){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        const start = "https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/"
        rom(`${start}${codename}/build.json`, `${start}${codenameup}/build.json`).then(response => {
          if(response){
            const embed = new Discord.RichEmbed()
              .setColor(0xE92029)
              .setTitle(`CerberusOS | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+timeConverter(parseInt(response.datetime))+"`**\n**"+lang.size+"**: **`"+pretty(response.size)+"`**\n**"+lang.version+"**: **`"+response.version+"`**\n"+`**${lang.download}**: [${response.filename}](${response.url})`)
            send({embed})
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//MSM Xtended
	} else if(content.startsWith(`${prefix}msm`) || content.startsWith(`${prefix}xtended`) || content.startsWith(`${prefix}msmxtended`)){
    if(djson.msm){
      send(lang.disable)
    } else {
      const codename = content.split(' ')[1];
      if(codename !== undefined){
        const codenameup = content.split(' ')[1].toUpperCase();
        rom("https://raw.githubusercontent.com/Xtended-Pie/vendor_xtended_DevicesOTA/xp/ota.xml", '', false, false, false, true, false, false, false, false, codename, codenameup).then(response => {
          if(response){
            var filename = response.filename._text;
            const embed = new Discord.RichEmbed()
              .setColor(0x940000)	
              .setTitle(`MSM Xtended | ${devicename(codename)}`)
              .setDescription("**"+lang.date+"**: **`"+ `${filename.split('-')[2].substring(0, 4)}-${filename.split('-')[2].substring(4, 6)}-${filename.split('-')[2].substring(6, 8)}` +"`**\n**"+lang.version+"**: **`"+filename.split('-')[6].split(".")[0]+"`**\n"+`**${lang.download}**: [${filename}](${response.download._text})`)
            send({embed});
          } else {
            send(lang.romerr+" `"+devicename(codename)+"`")
          }
        });
      } else {
        send(lang.cdnerr)
      }
    }
	//ROMs
	} else if(content.startsWith(`${prefix}roms`)){
		const codename = content.split(' ')[1];
		if(codename !== undefined){
			const codenameup = content.split(' ')[1].toUpperCase();
      message.channel.send("Fetching ROMs...").then(msg => {
        async function roms(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200){
                resolve(`${name}\n`);
              } else {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200){
                    resolve(`${name}\n`);
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function rombody(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200){
                resolve(`${name}\n`);
              } else {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200){
                    resolve(`${name}\n`);
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function romlos(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                resolve(`${name}\n`);
              } else {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                    resolve(`${name}\n`);
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function romposp(url, urlup, bkpurl, bkpurlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              try {
                if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                  resolve(`${name}\n`);
                } else {
                  request({
                    url: urlup
                  }, function(err, responses, bodyurl) {
                    if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                      resolve(`${name}\n`);
                    } else {
                      resolve(false);
                    }
                  });
                }
              } catch(err) {
                request({
                  url: bkpurl
                }, function(err, responses, bodyurl){
                  if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                    resolve(`${name}\n`);
                  } else {
                    request({
                      url: bkpurlup
                    }, function(err, responses, bodyurl) {
                      if(responses.statusCode === 200 && JSON.parse(bodyurl).response.join() !== ""){
                        resolve(`${name}\n`);
                      } else {
                        resolve(false);
                      }
                    });
                  }
                });
              }
            });
          });
        }
        async function rompe(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
                resolve(`${name}\n`);
              } else {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200 && !JSON.parse(bodyurl).error){
                    resolve(`${name}\n`);
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function rombtlg(url, codename, codenameup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200 && JSON.parse(bodyurl)[codename] !== undefined){
                resolve(`${name}\n`);
              } else {
                request({
                  url
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200 && JSON.parse(bodyurl)[codenameup] !== undefined){
                    resolve(`${name}\n`);
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function romcosp(code, codeup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url: `https://mirror.codebucket.de/cosp/getdevices.php`
            }, function(err, responses, bodyurl) {
              var body = JSON.parse(bodyurl);
              var response = body.includes(codename);
              if(response){
                resolve(`${name}\n`)
              } else {
                request({
                  url: `https://mirror.codebucket.de/cosp/getdevices.php`
                }, function(err, responses, bodyurl) {
                  var body = JSON.parse(bodyurl);
                  var response = body.includes(codename);
                  if(response){
                    resolve(`${name}\n`)
                  } else {
                    resolve(false)
                  }
                });
              }
            });
          });
        }
        async function romcrd(code, codeup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url: "https://raw.githubusercontent.com/crdroidandroid/android_vendor_crDroidOTA/9.0/update.xml"
            }, function(err, responses, bodyurl) {
              var body = convert.xml2json(bodyurl, {compact: true, spaces: 4});
              function resp(){
                try {
                  return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
                } catch (err) {
                  try {
                    return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
                  } catch (err) {
                    return false;
                  }
                }
              }
              if(resp() === false){
                resolve(false)
              } else {
                resolve(`${name}\n`)
              }
            });
          });
        }
        async function rommsm(code, codeup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url: "https://raw.githubusercontent.com/Xtended-Pie/vendor_xtended_DevicesOTA/xp/ota.xml"
            }, function(err, responses, bodyurl) {
              var body = convert.xml2json(bodyurl, {compact: true, spaces: 4});
              function resp(){
                try {
                  return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
                } catch (err) {
                  try {
                    return JSON.parse(body).OTA.manufacturer.find((m) => m[codename] !== undefined)[codename] !== undefined;
                  } catch (err) {
                    return false;
                  }
                }
              }
              if(resp() === false){
                resolve(false)
              } else {
                resolve(`${name}\n`)
              }
            });
          });
        }
        async function romsyb(coden, codenup, name, disable){
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/a-only/${coden}.json`
            }, function(err, responses, bodyurl) {
              if(responses.statusCode === 200){
                var response = JSON.parse(bodyurl);
                resolve(`${name}\n`);
              } else {
                request({
                  url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/a-only/${codenup}.json`
                }, function(err, responses, bodyurl) {
                  if(responses.statusCode === 200){
                    var response = JSON.parse(bodyurl);
                    resolve(`${name}\n`);
                  } else {
                    function ab(code){
                      if(code === 'fajita'){
                        return 'OnePlus6T'
                      } else if(code === 'enchilada'){
                        return 'OnePlus6'
                      } else if(code === 'FAJITA'){
                        return 'OnePlus6T'
                      } else if(code === 'ENCHILADA'){
                        return 'OnePlus6'
                      } else {
                        return code
                      }
                    }
                    request({
                      url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/ab/${ab(coden)}.json`
                    }, function(err, responses, bodyurl) {
                      if(responses.statusCode === 200){
                        var body = JSON.parse(bodyurl);
                        var response = body.response[0]
                        resolve(`${name}\n`);
                      } else {
                        request({
                          url: `https://raw.githubusercontent.com/syberia-project/official_devices/master/ab/${ab(codenup)}.json`
                        }, function(err, responses, bodyurl) {
                          if(responses.statusCode === 200){
                            var body = JSON.parse(bodyurl);
                            var response = body.response[0]
                            resolve(`${name}\n`);
                          } else {
                            resolve(false);
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          });
        }
        async function romxml(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            function urlcheck(u){
              if(u === 'https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/enchilada.xml'){
                return 'https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/oneplus.xml'
              } else {
                return u
              }
            }
            request({
              url: urlcheck(url)
            }, function(err, responses, bodyurl) {
              try {
                var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
                resolve(`${name}\n`);
              } catch(err) {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  try {
                    var body = JSON.parse(convert.xml2json(bodyurl, {compact: true, spaces: 4}));
                    resolve(`${name}\n`);
                  } catch(err) {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function romdirty(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl){
              try {
                var body = JSON.parse(bodyurl).slice(-1)[0];
                resolve(`${name}\n`)
              } catch(err) {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  try {
                    var body = JSON.parse(bodyurl).slice(-1)[0];
                    resolve(`${name}\n`)
                  } catch(err) {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        async function romaicp(url, urlup, name, disable) {
          return new Promise(function(resolve, reject) {
            if(disable) return resolve(false);
            request({
              url
            }, function(err, responses, bodyurl){
              if(JSON.parse(bodyurl).error === undefined){
                resolve(`${name}\n`)
              } else {
                request({
                  url: urlup
                }, function(err, responses, bodyurl) {
                  if(JSON.parse(bodyurl).error === undefined){
                    resolve(`${name}\n`)
                  } else {
                    resolve(false);
                  }
                });
              }
            });
          });
        }
        //HavocOS
        roms(`https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codename}.json`, `https://raw.githubusercontent.com/Havoc-Devices/android_vendor_OTA/pie/${codenameup}.json`, "HavocOS (havoc)", djson.havoc).then(havoc => {
        //PixysOS
        roms(`https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/PixysOS-Devices/official_devices/master/${codenameup}/build.json`, "PixysOS (pixy)", djson.pixys).then(pixy => {
        //LineageOS
        romlos(`https://download.lineageos.org/api/v1/${codename}/nightly/*`, `https://download.lineageos.org/api/v1/${codenameup}/nightly/*`, "LineageOS (los/lineage)", djson.los).then(los => {
        //PearlOS
        roms(`https://raw.githubusercontent.com/PearlOS/OTA/master/${codename}.json`, `https://raw.githubusercontent.com/PearlOS/OTA/master/${codenameup}.json`, "PearlOS (pearl)", djson.pearl).then(pearl => {
        //DotOS
        roms(`https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codename}.json`, `https://raw.githubusercontent.com/DotOS/ota_config/dot-p/${codenameup}.json`, "DotOS (dotos)", djson.dot).then(dotos => {
        //ViperOS
        roms(`https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codename}/build.json`, `https://raw.githubusercontent.com/Viper-Devices/official_devices/master/${codenameup}/build.json`, "ViperOS (viper)", djson.viper).then(viper => {
        //Potato Open Sauce Project POSP (Weekly)
        romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=weekly`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=weekly`,`http://api.strangebits.co.in/checkUpdate?device=${codename}&type=weekly`, `http://api.strangebits.co.in/checkUpdate?device=${codenameup}&type=weekly`, "Potato Open Sauce Project (Weekly) (posp/potato)", djson.posp).then(pospw => {
        //Potato Open Sauce Project POSP (Mashed)
        romposp(`https://api.potatoproject.co/checkUpdate?device=${codename}&type=mashed`, `https://api.potatoproject.co/checkUpdate?device=${codenameup}&type=mashed`,`http://api.strangebits.co.in/checkUpdate?device=${codename}&type=mashed`, `http://api.strangebits.co.in/checkUpdate?device=${codenameup}&type=mashed`, "Potato Open Sauce Project (Mashed) (posp/potato)", djson.posp).then(pospm => {
        //Evolution-X EVO-X
        rombody(`https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codename}.json`, `https://raw.githubusercontent.com/evolution-x-devices/official_devices/master/builds/${codenameup}.json`, "Evolution-X (evo/evox)", djson.evo).then(evo => {
        //AOSP Extended AEX (Pie)
        rombody(`https://api.aospextended.com/ota/${codename}/pie`, `https://api.aospextended.com/ota/${codenameup}/pie`, "AOSP Extended (Pie) (aex)", djson.aex).then(aexpie => {
        //AOSP Extended AEX (Oreo)
        rombody(`https://api.aospextended.com/ota/${codename}/oreo`, `https://api.aospextended.com/ota/${codenameup}/oreo`, "AOSP Extended (Oreo) (aex)", djson.aex).then(aexoreo => {
        //BootleggersROM BTLG
        rombtlg(`https://bootleggersrom-devices.github.io/api/devices.json`, codename, codenameup, "BootleggersROM (btlg/bootleggers)", djson.btlg).then(btlg => {
        //Pixel Experience (Pie)
        rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie`, "Pixel Experience (Pie) (pe)", djson.pe).then(pepie => {
        //Pixel Experience (CAF)
        rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie_caf`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie_caf`, "Pixel Experience (CAF) (pe)", djson.pe).then(pecaf => {
        //Pixel Experience (Go)
        rompe(`https://download.pixelexperience.org/ota_v2/${codename}/pie_go`, `https://download.pixelexperience.org/ota_v2/${codenameup}/pie_go`, "Pixel Experience (Pie Go) (pe)", djson.pe).then(pego => {
        //Pixel Experience (Oreo)
        rompe(`https://download.pixelexperience.org/ota_v2/${codename}/oreo`, `https://download.pixelexperience.org/ota_v2/${codenameup}/oreo`, "Pixel Experience (Oreo) (pe)", djson.pe).then(peoreo => {
        //SyberiaOS
        romsyb(codename, codenameup, "Syberia (syberia)", djson.syberia).then(syberia => {
        //crDroid
        romcrd(codename, codenameup, "crDroid (crdroid)", djson.crdroid).then(crdroid => {
        //Clean Open Source Porject COSP
        romcosp(codename, codenameup, "Clean Open Source Project (cosp/clean)", djson.cosp).then(cosp => {
        //ResurrectionRemix RR
        roms(`https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/${codename}.json`, `https://raw.githubusercontent.com/ResurrectionRemix-Devices/api/master/${codenameup}.json`, "Resurrection Remix (rr)", djson.rr).then(rr => {
        //SuperiorOS
        roms(`https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/${codename}.json`, `https://raw.githubusercontent.com/SuperiorOS/official_devices/pie/${codenameup}.json`, "SuperiorOS (superior)", djson.superior).then(superior => {
        //RevengeOS
        roms(`https://raw.githubusercontent.com/RevengeOS/releases/master/${codename}.json`, `https://raw.githubusercontent.com/RevengeOS/releases/master/${codenameup}.json`, "RevengeOS (revenge)", djson.revenge).then(revenge => {
        //AOSiP Official
        roms(`https://aosip.dev/${codename}/official`, `https://aosip.dev/${codenameup}/official`, `Android Open Source illusion Project (${lang.official}) (aosip)`, djson.aosip).then(aosipo => {
        //AOSiP Beta
        roms(`https://aosip.dev/${codename}/beta`, `https://aosip.dev/${codenameup}/beta`, `Android Open Source illusion Project (${lang.beta}) (aosip)`, djson.aosip).then(aosipb => {
        //ArrowOS
        roms(`https://update.arrowos.net/api/v1/${codename}/official`, `https://update.arrowos.net/api/v1/${codenameup}/official`, "ArrowOS (arrow)", djson.arrow).then(arrow => {
        //Liquid Remix
        romxml(`https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/${codename}.xml`, `https://raw.githubusercontent.com/LiquidRemix-Devices/LROTA/pie/${codenameup}.xml`, "Liquid Remix (liquid)", djson.liquid).then(liquid => {
        //Dirty Unicorns (Official)
        romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Official`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Official`, `Dirty Unicorns (${lang.official}) (dirty)`, djson.dirty).then(dirtyo => {
        //Dirty Unicorns (RC)
        romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Rc`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Rc`, "Dirty Unicorns (RC) (dirty)", djson.dirty).then(dirtyr => {
        //Dirty Unicorns (Weeklies)
        romdirty(`https://download.dirtyunicorns.com/api/files/${codename}/Weeklies`, `https://download.dirtyunicorns.com/api/files/${codenameup}/Weeklies`, "Dirty Unicorns (Weeklies) (dirty)", djson.dirty).then(dirtyw => {
        //XenonHD (Official)
        romxml(`https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codename}_official.xml`, `https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codenameup}_official.xml`, `XenonHD (${lang.official}) (xenon)`, djson.xenon).then(xenono => {
        //XenonHD (Experimental)
        romxml(`https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codename}_experimental.xml`, `https://mirrors.c0urier.net/android/teamhorizon/P/OTA/ota_${codenameup}_experimental.xml`, `XenonHD (${lang.experimental}) (xenon)`, djson.xenon).then(xenone => {
        //Kraken Open Tentacles Project KOTP
        roms(`https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/${codename}.json`, `https://raw.githubusercontent.com/KrakenProject/official_devices/master/builds/${codenameup}.json`, "Kraken Open Tentacles Project (kotp/kraken)", djson.kotp).then(kotp => {
        //Android Ice Cold Project AICP
        romaicp(`http://ota.aicp-rom.com/update.php?device=${codename}`, `http://ota.aicp-rom.com/update.php?device=${codenameup}`, "Android Ice Cold Project (aicp)", djson.aicp).then(aicp => {
        //NitrogenOS
        roms(`https://raw.githubusercontent.com/nitrogen-project/OTA/p/${codename}.json`, `https://raw.githubusercontent.com/nitrogen-project/OTA/p/${codenameup}.json`, "NitrogenOS (nitrogen)", djson.nitrogen).then(nitrogen => {
        //CerberusOS
        roms(`https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/${codename}/build.json`, `https://raw.githubusercontent.com/CerberusOS/official_devices/Pie/${codenameup}/build.json`, "CerberusOS (cerberus)", djson.cerberus).then(cerberus => {
        //MSM Xtended
        rommsm(codename, codenameup, "MSM Xtended (msm)", djson.msm).then(msm => {

          //havoc, pixy, los, pearl, dotos, viper, pospw, pospm, evo, aexpie, aexoreo, btlg, pepie, pecaf, peoreo, pego, syberia, crdroid, cosp, rr, superior, revenge, aosipo, aosipb, arrow, liquid, dirtyo, dirtyr, dirtyw, xenono, xenone, kotp, aicp, nitrogen, cerberus, msm


          if(havoc === false && pixy === false && los === false && pearl === false && dotos === false && viper === false && pospw === false && pospm === false && evo === false && aexpie === false && aexoreo == false && btlg === false && pepie === false && pecaf === false && peoreo === false && syberia === false && crdroid === false && cosp === false && rr === false && pego === false && superior === false && revenge === false && aosipo === false && aosipb === false && arrow === false && liquid === false && dirtyo === false && dirtyr === false && dirtyw === false && xenone === false && xenono === false && kotp === false && aicp === false && nitrogen === false && cerberus === false && msm === false){
                  msg.edit(lang.romserr+" `"+devicename(codename)+"`");
          } else {

            function tof(f){
              if(f !== false){
                return `${f}`
              } else {
                return "";
              }
            }

            const embed = new Discord.RichEmbed()
              .setColor(0xFFFFFF)
              .setTitle(`${lang.roms} ${devicename(codename)}`)
              .setDescription([tof(havoc), tof(pixy), tof(los), tof(pearl), tof(dotos), tof(viper), tof(pospw), tof(pospm), tof(evo), tof(aexpie), tof(aexoreo), tof(btlg), tof(pepie), tof(pecaf), tof(peoreo), tof(pego), tof(syberia), tof(crdroid), tof(cosp), tof(rr), tof(superior), tof(revenge), tof(aosipo), tof(aosipb), tof(arrow), tof(liquid), tof(dirtyo), tof(dirtyr), tof(dirtyw), tof(xenono), tof(xenone), tof(kotp), tof(aicp), tof(nitrogen), tof(cerberus), tof(msm)].sort(function (a, b) {return a.toLowerCase().localeCompare(b.toLowerCase())}).join(''))
            msg.edit(embed);
          }
        })})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})});
      });
		} else {
			const embed = new Discord.RichEmbed()
				.setColor(0xFFFFFF)
				.setTitle(lang.help.roms.available)
				.setDescription(roms)
			send({embed});
		}
	}
});

client.login(config.token);
