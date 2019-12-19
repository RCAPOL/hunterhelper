var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var http = require('http');
var express = require('express');
var app = express();
app.get("/", function (request, response) {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(function () {
    http.get("http://" + process.env.PROJECT_DOMAIN + ".glitch.me/");
}, 280000);
// BaseNode
var fs = require("fs");
var jSelfReloadJSON = require("self-reload-json");
var glob = require("glob");
var yt = require("ytdl-core");
var ffmpeg = require("ffmpeg");
var forever = require("forever");
var path = require("path");
var jProcess = require("process");
// Web Scrapping
var rp = require("request-promise");
var jCheerio = require("cheerio");
// DiscordJS
var Discord = require("discord.js");
var config = require("./data/config.json");
var client = new Discord.Client();
var prefix = "!";
// Arquivos Gerais
var AdminInfo = require("./data/admin.json");
var Animais = require("./gameContent/animais.json");
var Armas = require("./gameContent/armas.json");
var BotSentences = require("./data/botsentences.json");
var Calibres = require("./gameContent/calibres.json");
var Chamarizes = require("./gameContent/chamarizes.json");
var Itens = require("./gameContent/itens.json");
var Outros = require("./gameContent/outros.json");
var tokens = require("./data/tokens.json");
// Deixa-lo vivo no Glitch
/* const http = require('http')
const express = require('express')
const app = express()
app.get("/", (request, response) => {
  console.log(Date.now() + " VOLTEI A VIDA")
  response.sendStatus(200)
})
app.listen(jProcess.env.PORT)
setInterval(() => {
  http.get(`http://${jProcess.env.PROJECT_DOMAIN}.glitch.me/`)
}, 280000)
 */
// Método de inicialização, ponto vital do bot
var wait = require("util").promisify(setTimeout);
var invites = {};
// Musica Discord
var queue = {};
var commands = {
    'tocar': function (message) {
        if (queue[message.guild.id] === undefined) {
            return message.channel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("N\u00E3o h\u00E1 m\u00FAsicas para serem reproduzidas atualmente...")
                .setDescription("Adicione algumas musicas \u00E0 fila com o comando " + tokens.prefix + "add"));
        }
        if (!message.guild.voiceConnection)
            return commands.aqui(message).then(function () { return commands.tocar(message); });
        if (queue[message.guild.id].playing) {
            return message.channel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("Ops, parece que eu estou tocando essa m\u00FAsica no momento..."));
        }
        var dispatcher;
        queue[message.guild.id].playing = true;
        //console.log(queue)
        (function play(song) {
            console.log(song);
            if (song === undefined) {
                return message.channel.send(new Discord.RichEmbed()
                    .setColor("#E84C3D")
                    .setTitle("N\u00E3o h\u00E1 m\u00FAsicas na fila...")).then(function () {
                    queue[message.guild.id].playing = false;
                    message.member.voiceChannel.leave();
                });
            }
            message.channel.send(new Discord.RichEmbed()
                .setColor("#2DCC70")
                .setTitle("Tocando: **" + song.title + "**")
                .setDescription("Ao pedido de **" + song.requester + "**"));
            dispatcher = message.guild.voiceConnection.playStream(yt(song.url, {
                audioonly: true
            }), {
                passes: tokens.passes
            });
            var collector = message.channel.createCollector(function (m) { return m; });
            collector.on("message", function (m) {
                if (m.content.startsWith(tokens.prefix + "pausar")) {
                    message.channel.send("Pausado").then(function () {
                        dispatcher.pause();
                    });
                }
                else if (m.content.startsWith(tokens.prefix + "resumir")) {
                    message.channel.send("Resumindo").then(function () {
                        dispatcher.resume();
                    });
                }
                else if (m.content.startsWith(tokens.prefix + "pular")) {
                    message.channel.send("Pulado").then(function () {
                        dispatcher.end();
                    });
                }
                else if (m.content.startsWith("volume+")) {
                    if (Math.round(dispatcher.volume * 50) >= 100)
                        return message.channel.send("Volume: " + Math.round(dispatcher.volume * 50) + "%");
                    dispatcher.setVolume(Math.min((dispatcher.volume * 50 + (2 * (m.content.split("+").length - 1))) / 50, 2));
                    message.channel.send("Volume: " + Math.round(dispatcher.volume * 50) + "%");
                }
                else if (m.content.startsWith("volume-")) {
                    if (Math.round(dispatcher.volume * 50) <= 0)
                        return message.channel.send("Volume: " + Math.round(dispatcher.volume * 50) + "%");
                    dispatcher.setVolume(Math.max((dispatcher.volume * 50 - (2 * (m.content.split("-").length - 1))) / 50, 0));
                    message.channel.send("Volume: " + Math.round(dispatcher.volume * 50) + "%");
                }
                else if (m.content.startsWith(tokens.prefix + "tempo")) {
                    message.channel.send("tempo: " + Math.floor(dispatcher.time / 60000) + ":" + (Math.floor((dispatcher.time % 60000) / 1000) < 10 ? "0" + Math.floor((dispatcher.time % 60000) / 1000) : Math.floor((dispatcher.time % 60000) / 1000)));
                }
            });
            dispatcher.on("end", function () {
                collector.stop();
                play(queue[message.guild.id].songs.shift());
            });
            dispatcher.on("error", function (err) {
                return message.channel.semd("error: " + err).then(function () {
                    collector.stop();
                    play(queue[message.guild.id].songs.shift());
                });
            });
        })(queue[message.guild.id].songs.shift());
    },
    'aqui': function (message) {
        return new Promise(function (resolve, reject) {
            var voiceChannel = message.member.voiceChannel;
            if (!voiceChannel || voiceChannel.type !== "voice")
                return message.reply("N\u00E3o posso me conectar \u00E0 sua sala...");
            voiceChannel.join().then(function (connection) { return resolve(connection); })["catch"](function (err) { return reject(err); });
        });
    },
    'add': function (message) {
        var url = message.content.split(" ")[1];
        if (url == "" || url === undefined) {
            return message.channel.send("Voc\u00EA precisa adicionar um link ou ID do v\u00EDdeo ap\u00F3s o comando " + tokens.prefix + "add");
        }
        yt.getInfo(url, function (err, info) {
            if (err) {
                return message.channel.send(new Discord.RichEmbed()
                    .setColor("#E84C3D")
                    .setTitle("Link do YouTube inv\u00E1lido: " + err));
            }
            if (!queue.hasOwnProperty(message.guild.id)) {
                queue[message.guild.id] = {}, queue[message.guild.id].playing = false, queue[message.guild.id].songs = [];
                queue[message.guild.id].songs.push({
                    url: url,
                    title: info.title,
                    requester: message.author.username
                });
                message.channel.send(new Discord.RichEmbed()
                    .setColor("#2DCC70")
                    .setTitle("**" + info.title + "** foi adicionado \u00E0 fila!"));
            }
        });
    },
    'fila': function (message) {
        if (queue[message.guild.id] === undefined)
            return message.channel.send("Adicione m\u00FAsicas \u00E0 fila com o comando " + tokens.prefix + "add");
        var tosend = [];
        queue[message.guild.id].songs.forEach(function (song, i) {
            tosend.push(i + 1 + ". " + song.title + " - Ao pedido de: " + song.requester);
        });
        message.channel.send("Fila de m\u00FAsicas tem atualmente **" + tosend.length + "** som(ns) na fila " + (tosend.length > 15 ? '*[Apenas as próximas 15 são exibidas]*' : '') + "\n```" + tosend.slice(0, 15).join('\n') + "```");
    },
    'ajuda': function (message) {
        var tosend = ["xl", tokens.prefix + "aqui : \"Se junta ao canal do ca\u00E7ador\"", tokens.prefix + "add : \"Adiciona um link do YouTube a fila de espera\"", tokens.prefix + "fila : \"Mostra a fila de m\u00FAsicas. No m\u00E1ximo at\u00E9 15\"", tokens.prefix + "tocar : \"Reproduz a fila de espera caso esteja numa sala\"", "", "Os comandos a seguir s\u00F3 podem ser usados enquanto o comando tocar est\u00E1 em uso:".toUpperCase(), tokens.prefix + "pausar : \"Pausa a m\u00FAsica\"", tokens.prefix + "resumir : \"Resume a m\u00FAsica\"", tokens.prefix + " pular : \"Pula para o pr\u00F3ximo som da fila\"", tokens.prefix + "tempo : \"Mostra o tempo total de m\u00FAsica\"", "volume+(+++) : \"Aumenta o volume em 2%/+\"", "volume-(---) : \"Diminui o volume em 2%/-\"", ""];
        message.channel.send(tosend.join("\n"));
    },
    'dc': function (message) {
        if (message.author.id == tokens.adminID) {
            message.member.voiceChannel.leave();
        }
    }
};
client.on("ready", function () {
    console.log("HunterHelper est\u00E1 no ar!");
    client.user.setActivity("os ca\u00E7adores", {
        type: "LISTENING"
    });
});
client.on("guildMemberAdd", function (member) {
    var no_role = member.guild.roles.find(function (r) { return r.name === "Ca\u00E7ador sem licen\u00E7a"; });
    var rt_role = member.guild.roles.find(function (r) { return r.name === "Recrutador"; });
    var boasVindas = member.guild.channels.find(function (ch) { return ch.name === "boas-vindas"; });
    var salaComandos = member.guild.channels.find(function (ch) { return ch.name === "comandos"; });
    if (!boasVindas)
        return;
    boasVindas.send(new Discord.RichEmbed()
        .setTitle("Seja bem vindo ao servidor, " + member.user.username + "!")
        .setDescription("V\u00E1 para " + salaComandos + " e utilize o comando !r seguido de seu nickname no theHunter para adquirir o seu HUNTER ID CARD!\nQualquer duvida digite !r ?")
        .setThumbnail(member.user.avatarURL)
        .setColor("#FFFFFF"));
    member.addRole(no_role);
});
client.on("guildMemberRemove", function (member) {
    var boasVindas = member.guild.channels.find(function (ch) { return ch.name === "boas-vindas"; });
    if (!boasVindas)
        return;
    boasVindas.send(new Discord.RichEmbed()
        .setTitle("Ei " + member.user.username + ", est\u00E1 na escuta...?!")
        .setDescription("Parece que perdemos o contato com este ca\u00E7ador, seu HUNTER ID foi abandonado no server... Sentiremos sua falta!")
        .setThumbnail(member.user.avatarURL)
        .setColor("#E84C3D"));
});
/* client.on(`presenceUpdate`, (oldMember, newMember) => {
    var tChannel = newMember.guild.channels.find(ch => ch.name === `comandos`)
    if (oldMember != newMember) {
        var p = newMember.user.id
        if (fs.existsSync(`./perfis/registrados/${p}.json`)) {
            var presenceUpdate = new jSelfReloadJSON(`./perfis/registrados/${p}.json`)
            presenceUpdate.resume()
            presenceUpdate.forceUpdate()
            presenceUpdate.stop()
            var pView = presenceUpdate
            var hHora= new Date()
            var Horas = hHora.getHours()
            var Hour = pView.LASTUP

            if (Horas != Hour) {
                var pUpdate = 1
                var pMember = p
                presenceUpdate.stop()
                updatePlayerInfo()
            }
        }
    }

}) */
// Método de ativar o bot ao receber uma mensagem
client.on("message", function (message) {
    // Verifica se é bot
    var BOT = message.author.bot;
    if (BOT)
        return;
    // Fica por dentro do horário
    var Hoje = new Date();
    var Data = Hoje.getFullYear() + "/" + (Hoje.getMonth() + 1) + "/" + Hoje.getDate();
    var Tempo = Hoje.getHours() + ":" + Hoje.getMinutes() + ":" + Hoje.getSeconds();
    var DataTempo = Data + " " + Tempo;
    // Verifica se o membro não tem licença, se 1, então retira caso esteja alinhado com o registro
    var no_role = message.guild.roles.find(function (r) { return r.name === "Ca\u00E7ador sem licen\u00E7a"; });
    if (!fs.existsSync("./perfis/registrados/" + message.author.id + ".json")) {
        message.member.setRoles([no_role])["catch"](console.error);
    }
    // Atualiza o perfil do usuário 1 vez por dia
    if (fs.existsSync("./perfis/registrados/" + message.author.id + ".json")) {
        var JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + message.author.id + ".json");
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;
        var hHora = new Date();
        var Horas = hHora.getHours();
        var Hour = pView.LASTUP;
        if (Horas != Hour) {
            //console.log(`Hora de atualizar o perfil de ${message.author.username}(${message.author.id})`)
            JSONCheck.stop();
            updatePlayerInfo(message.author.id);
        }
    }
    if (commands.hasOwnProperty(message.content.toLowerCase().slice(tokens.prefix.length).split(" ")[0]))
        commands[message.content.toLowerCase().slice(tokens.prefix.length).split(" ")[0]](message);
    // Aceitar mensagens apenas enviadas nos seguintes chats e verifica a sala de comandos
    var cChannel = message.guild.channels.find(function (ch) { return ch.name === "comandos"; });
    var chChannel = message.guild.channels.find(function (ch) { return ch.name === "chat"; });
    var logChannel = message.guild.channels.find(function (ch) { return ch.name === "changelog"; });
    var fChannel = message.guild.channels.find(function (ch) { return ch.name === "fotos"; });
    var testeChannel = message.guild.channels.find(function (ch) { return ch.name === "testebot"; });
    if (message.author.username === "RCPOLSKI") {
        cChannel = message.channel;
        chChannel = message.channel;
        fChannel = message.channel;
        testeChannel = message.channel;
    }
    /*
                if (message.channel === testeChannel && message.attachments.size <= 0) {
                    testeChannel.send('Nao tem attachment')
                } else if (message.channel === testeChannel && message.attachments.size >= 1) {
                    testeChannel.send('Tem attachment')
                } */
    var isOK = 0;
    var isRegistered = 0;
    if (message.channel === chChannel && message.attachments.size >= 1 && message.author.username !== "RCPOLSKI") {
        var JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + message.author.id + ".json");
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;
        message["delete"](100);
        chChannel.send(new Discord.RichEmbed()
            .setColor("#E84C3D")
            .setTitle("Ei " + pView.NICKNAME + ", este chat \u00E9 destinado apenas \u00E0 conversas...")
            .setDescription("Para postar fotos, v\u00E1 para " + fChannel + " e para me dar comandos, v\u00E1 para " + cChannel));
        return;
    }
    else if (message.channel === fChannel && message.attachments.size <= 0 && message.author.username !== "RCPOLSKI") {
        var JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + message.author.id + ".json");
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;
        message["delete"](100);
        fChannel.send(new Discord.RichEmbed()
            .setColor("#E84C3D")
            .setTitle("Ei " + pView.NICKNAME + ", este chat \u00E9 destinado apenas \u00E0 postagem de fotos...")
            .setDescription("Para conversar, v\u00E1 para " + chChannel + " e para me dar comandos, v\u00E1 para " + cChannel));
        return;
    }
    if (message.channel !== cChannel && message.author.username === "RCPOLSKI") {
        isOK = 1;
    }
    if (message.channel === cChannel && message.content.startsWith(prefix)) {
        isOK = 1;
    }
    if (message.channel === cChannel && !message.content.startsWith(prefix) && message.author.username === "RCPOLSKI") {
        isOK = 1;
    }
    else if (message.channel === cChannel && !message.content.startsWith(prefix) && message.author.username !== "RCPOLSKI") {
        message["delete"](100);
        console.log(message.author.username + "(" + message.author.id + ") tentou falar na sala #comandos...");
        cChannel.send(new Discord.RichEmbed()
            .setTitle("Ei, este chat \u00E9 destinado apenas aos comandos...")
            .setDescription("Para conversas, utilize o " + chChannel)
            .setColor("#E84C3D"));
    }
    if (message.content.startsWith(prefix) && isOK === 0) {
        message.channel.send(new Discord.RichEmbed()
            .setColor("#E84C3D")
            .setTitle("Ei, para interagir comigo preciso que seja no canal correto!")
            .setDescription("Para me dar comandos, utilize o " + cChannel));
        return;
    }
    var laArgs = message.content.slice(prefix.length).split(" ");
    var elCommand = laArgs.shift().toLowerCase();
    var matchCommand = elCommand.match(/\bcomandos|\breservas|\bsobre|\bid|\bme|\bp|\br|\bm/g);
    if (message.content.startsWith(prefix) && !matchCommand && message.author.username !== "RCPOLSKI") {
        message["delete"](100);
        cChannel.send(new Discord.RichEmbed()
            .setTitle("Ei, este chat \u00E9 destinado apenas aos comandos...")
            .setDescription("Para conversas, utilize o " + chChannel)
            .setColor("#E84C3D"));
        showCommands();
        return;
    }
    if (message.content.startsWith(prefix) && isOK === 1) {
        // Assets
        var sh_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "shoe"; });
        var gr_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "grave"; });
        var ds_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "distance"; });
        var bn_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "binoculars"; });
        var hs_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "hs"; });
        var rk_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "rank"; });
        var cs_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "cssmedio"; });
        var ps_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "precision"; });
        var tm_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "timer"; });
        var an_emoji = client.emojis.find(function (emoji) { return emoji.name === "animals"; });
        var dt_emoji = client.emojis.find(function (emoji) { return emoji.name === "death"; });
        var ex_emoji = client.emojis.find(function (emoji) { return emoji.name === "exclusive"; });
        var lc_emoji = client.emojis.find(function (emoji) { return emoji.name === "local"; });
        var se_emoji = client.emojis.find(function (emoji) { return emoji.name === "season"; });
        var si_emoji = client.emojis.find(function (emoji) { return emoji.name === "size"; });
        var ms_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "mushroom"; });
        var mg_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "magglass"; });
        var tr_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "trophy"; });
        var fr_emoji_1 = client.emojis.find(function (emoji) { return emoji.name === "friend"; });
        var wh_emoji = client.emojis.find(function (emoji) { return emoji.name === "WH_Icon"; });
        var lp_emoji = client.emojis.find(function (emoji) { return emoji.name === "LP_Icon"; });
        var sc_emoji = client.emojis.find(function (emoji) { return emoji.name === "SC_Icon"; });
        var rf_emoji = client.emojis.find(function (emoji) { return emoji.name === "RF_Icon"; });
        var hf_emoji = client.emojis.find(function (emoji) { return emoji.name === "HF_Icon"; });
        var hm_emoji = client.emojis.find(function (emoji) { return emoji.name === "HM_Icon"; });
        var rb_emoji = client.emojis.find(function (emoji) { return emoji.name === "RB_Icon"; });
        var vb_emoji = client.emojis.find(function (emoji) { return emoji.name === "VB_Icon"; });
        var br_emoji = client.emojis.find(function (emoji) { return emoji.name === "BR_Icon"; });
        var wr_emoji = client.emojis.find(function (emoji) { return emoji.name === "WR_Icon"; });
        var tt_emoji = client.emojis.find(function (emoji) { return emoji.name === "TT_Icon"; });
        var pb_emoji = client.emojis.find(function (emoji) { return emoji.name === "PB_Icon"; });
        // Definindo variáveis e argumentos
        var autorUsername = message.author.username; // Username do usuário
        var p = autorUsername.toLowerCase();
        var BOT = message.author.bot; // Checa se é bot
        var autorTag = message.author.tag; // TAG do usuário
        var autorID = message.author.id; // ID do usuário
        var autorAvatarURL = message.author.avatarURL; // Link do avatar do Usuário
        var autorNickname = message.member.nickname; // Apelido do usuário 
        var args = message.content.slice(prefix.length).split(" ");
        var comando = args.shift().toLowerCase();
        var mRead = message.content.split(" ");
        var mReadCont = mRead[1];
        var cardRequested = 0;
        var isAdmR = 0;
        var isBulkUpdate = 0;
        function delMsg() {
            try {
                function DeleteMyMessage() {
                    return __awaiter(this, void 0, void 0, function () {
                        var fetchedMsg, fetched;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    fetchedMsg = message.author.lastMessageID;
                                    message["delete"](10);
                                    return [4 /*yield*/, message.channel.fetchMessages({
                                            limit: 1
                                        })];
                                case 1:
                                    fetched = _a.sent();
                                    message.channel.bulkDelete(fetched);
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                DeleteMyMessage();
            }
            catch (err) {
            }
        }
        var isIdle = 0;
        var aDescription = "";
        if (comando === "idle" && message.author.username === "RCPOLSKI") {
            if (!args.length) {
                args[0] = 1;
            }
            message["delete"](100);
            fs.writeFileSync("./status/idling.txt", 'Since the beggining of everything...');
            console.log("O bot est\u00E1 em modo idle agora...");
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Estou entrando em modo de atualiza\u00E7\u00E3o. N\u00E3o estarei apto a responder seus comandos por at\u00E9 **" + args[0] + "** hora(s)")
                .setColor("#E84C3D"));
            client.user.setStatus("idle");
            client.user.setActivity("novas instru\u00E7\u00F5es", { type: "LISTENING" });
        }
        else if (comando === "awake" && message.author.username === "RCPOLSKI") {
            if (!args.length) {
                aDescription = "Apenas algumas corre\u00E7\u00F5es...";
            }
            if (args[0] === "patch") {
                aDescription = "Patch sob demanda! Parece que me deram super poderes... Confira em " + logChannel;
            }
            if (args[0] === "update") {
                aDescription = "Conte\u00FAdo novo \u00E1rea! Confira os detalhes em " + logChannel;
            }
            message["delete"](100);
            if (!fs.existsSync("./status/idling.txt")) {
                return;
            }
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Estou operante novamente!")
                .setDescription(aDescription)
                .setColor("#2DCC70"));
            fs.unlinkSync("./status/idling.txt");
            console.log("O bot saiu do modo idle...");
            client.user.setStatus("online");
            client.user.setActivity("os ca\u00E7adores", { type: "LISTENING" });
        }
        if (fs.existsSync("./status/idling.txt") && message.author.username !== "RCPOLSKI") {
            message["delete"](100);
            /* cChannel.send(new Discord.RichEmbed()
            .setTitle(`Estou meditando e cultivando alguns jaules de força... Portanto não estou atendendo à pedido de comandos`)
            .setColor(`#E84C3D`)) */
            return;
        }
        if (comando === "!" && autorUsername === "RCPOLSKI") {
            var no_role = message.guild.roles.find(function (a) { return a.name === "Ca\u00E7ador sem licen\u00E7a"; });
            var in_role = message.guild.roles.find(function (b) { return b.name === "Nivel Iniciante 0 - 300"; });
            var az_role = message.guild.roles.find(function (c) { return c.name === "Nivel Aprendiz  300+"; });
            var am_role = message.guild.roles.find(function (d) { return d.name === "Nivel Amador 900+"; });
            var cd_role = message.guild.roles.find(function (e) { return e.name === "Nivel Ca\u00E7ador 1800+"; });
            var it_role = message.guild.roles.find(function (f) { return f.name === "Nivel Instrutor 3000+"; });
            var gu_role = message.guild.roles.find(function (g) { return g.name === "Nivel Guia 5000+"; });
            var ep_role = message.guild.roles.find(function (h) { return h.name === "Nivel \u00C9pico 7500+"; });
            var ld_role = message.guild.roles.find(function (i) { return i.name === "N\u00EDvel Lend\u00E1rio 10.000+"; });
            var mt_role = message.guild.roles.find(function (j) { return j.name === "N\u00EDvel M\u00EDtico 25.000+"; });
            var ex_role = message.guild.roles.find(function (k) { return k.name === "Nivel Extraordin\u00E1rio 50.000+"; });
            var ec_role = message.guild.roles.find(function (l) { return l.name === "Nivel Embaixador de Ca\u00E7a 100.000+"; });
            /*  message.channel.send(new Discord.RichEmbed()
                 .setTitle(cd_role)
                 .setDescription(cd_role)
                 .setFooter(cd_role)
                 .addField(cd_role, cd_role)) */
            //message.channel.send(`Iniciando teste de cargos a pedido do administrador...\n\nChave de acesso: **40dc917a839feb2fa0fc0085233**\nAdmin Instance: **RCPOLSKI**\n\n**CARGOS**\n\n${no_role}\n${in_role}\n${az_role}\n${am_role}\n${cd_role}\n${it_role}\n${gu_role}\n${ep_role}\n${ld_role}\n${mt_role}\n${ex_role}\n${ec_role}`)
            //message.member.addRole(ADM_ROLE)
            try {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var PlayerLink, response, $, THPrecision, CalcPrecision, Precision;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                PlayerLink = "https://www.uhcapps.co.uk/stats_lifetime.php?username=" + args[0] // Source do Scrapper
                                ;
                                return [4 /*yield*/, rp(PlayerLink)];
                            case 1:
                                response = _a.sent();
                                $ = jCheerio.load(response);
                                THPrecision = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.small").text();
                                CalcPrecision = THPrecision.match(/[0-9.]+(?:\.[0-9.]+|)/g);
                                Precision = 100 - CalcPrecision;
                                if ((Precision % 1) > 0.5) {
                                    Precision + 1;
                                    console.log("remainder is greater than 0.5");
                                }
                                else {
                                    console.log("remainder is lower than 0.5");
                                }
                                message.channel.send("Valor Bruto: " + THPrecision + "\nValor Filtrado: " + CalcPrecision + "\nValor Decimal: " + Precision + "\nValor Final: " + Precision.toPrecision(2));
                                return [2 /*return*/];
                        }
                    });
                }); })();
            }
            catch (err) {
            }
            message["delete"](10);
            return;
        }
        if (comando === "admr" && autorUsername !== "RCPOLSKI") {
            return;
        }
        else if (comando === "admr" && !args.length && autorUsername === "RCPOLSKI") {
            console.log("Cad\u00EA o username RC????");
        }
        else if (comando === "admr" && args.length && autorUsername === "RCPOLSKI") {
            isAdmR = 1;
            var rMember = message.mentions.members.first();
            registerUser();
            message["delete"](100);
        }
        if (comando === "upr" && autorUsername !== "RCPOLSKI") {
            return;
        }
        else if (comando === "upr" && !args.length && autorUsername === "RCPOLSKI") {
            console.log("Cad\u00EA o username RC????");
        }
        else if (comando === "upr" && args.length && autorUsername === "RCPOLSKI") {
            isAdmR = 1;
            var uMember = message.mentions.members.first();
            updatePlayerInfo(uMember);
            message["delete"](100);
        }
        if (comando === "uprall" && autorUsername !== "RCPOLSKI") {
            return;
        }
        else if (comando === "uprall" && autorUsername === "RCPOLSKI") {
            var memberList = client.guilds.get("565537368224825344");
            var tMembers = memberList.members;
            message["delete"](100);
            //isBulkUpdate = 1
            memberList.members.forEach(function (member) { return message.channel.send(member.user.username + " (" + member.user.id + ")"); });
        }
        if (comando === "delr" && autorUsername !== "RCPOLSKI") {
            return;
        }
        else if (comando === "delr" && !args.length && autorUsername === "RCPOLSKI") {
            console.log("Cad\u00EA o username RC????");
        }
        else if (comando === "delr" && args.length && autorUsername === "RCPOLSKI") {
            var dMember = message.mentions.members.first();
            delPlayerInfo();
            message["delete"](100);
        }
        /*  if (!args[1].length) {} else {args.match(/[,.-]+|[.,-]+(?:\.[,.-]+|)/g)} */
        var minUser = message.author.username;
        minUser.toLowerCase();
        // Registro de usuário
        if (comando === "r" && fs.existsSync("./perfis/registrados/" + message.author.id + ".json")) {
            cChannel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("Ei " + pView.NICKNAME + ", voc\u00EA j\u00E1 est\u00E1 registrado!")
                .setDescription("Esse comando \u00E9 apenas para novos membros, portanto, mostrarei seu perfil!"))
                .then(function (msg) {
                setTimeout(function () {
                    msg["delete"]();
                }, 5000);
            });
            var alRegisteredRequest = 1;
            profileSearch();
        }
        else if (comando === "r" && args.length >= 2) {
            cChannel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("Campe\u00E3o, voc\u00EA tem certeza que esse \u00E9 o seu nick no jogo?")
                .setDescription("Seu nickname cont\u00E9m car\u00E1cteres n\u00E3o permitidos!"));
            return;
        }
        else if (comando === "r" && args[0] === minUser) {
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Ei " + message.author.username + ", o cadastro \u00E9 com o seu nickname no JOGO e n\u00E3o o do discord")
                .setDescription("Exemplo\n!r RCPOLSKI ou !r HooCairs")
                .setColor("#E84C3D"));
            console.log("[" + DataTempo + "] " + autorUsername + " tentou se registrar e usou o username do discord...");
            return;
        }
        else if (comando === "r" && args[0] === "?") {
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Para se registrar, basta inserir o seu nickname ap\u00F3s o comando !r")
                .setDescription("Exemplo\n!r RCPOLSKI")
                .setColor("#2DCC70"));
            console.log("[" + DataTempo + "] " + autorUsername + " requisitou informa\u00E7\u00F5es sobre o comando !r...");
            return;
        }
        else if (comando === "r" && args.length) {
            registerUser();
        }
        if (comando !== "r" && !fs.existsSync("./perfis/registrados/" + message.author.id + ".json")) {
            isRegistered = 0;
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Ei, " + autorUsername + "!\nPara que eu possa atender aos seus pedidos, voc\u00EA precisa se registrar utilizando o comando !r seguido de seu nickname no TheHunter")
                .setDescription("Exemplo\n!r RCPOLSKI")
                .setColor("#F1C40F"));
            console.log("[" + DataTempo + "] " + autorUsername + " tentou falar sem permiss\u00F5es...");
            return;
        }
        if (comando === "id" && !args.length) {
            pView = require("./perfis/registrados/" + message.author.id + ".json");
            cardRequested = 1;
            cChannel.send(new Discord.RichEmbed()
                .setColor("#F1C40F")
                .setTitle("Estou indo buscar sua identifica\u00E7\u00E3o " + pView.NICKNAME + ", aguarde s\u00F3 um pouquinho!"));
            updatePlayerInfo(message.author.id);
        }
        else if (comando === "id" && args.length) {
            return; //DESATIVAR PARA VALER COMANDO
        }
        if (fs.existsSync("./perfis/registrados/" + autorID + ".json")) {
            isRegistered = 1;
        }
        if (isRegistered === 0) {
            return;
        }
        var JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + message.author.id + ".json");
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;
        // Comando para procurar e ver o perfil do nickname provido
        if (comando === "p" && args.length) {
            profileSearch();
        }
        else if (comando === "p" && !args.length) {
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " iniciou uma requisi\u00E7\u00E3o de perfil, por\u00E9m esqueceu de indicar o nickname");
            cChannel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("Perfil de quem, " + pView.NICKNAME + "?")
                .setDescription("Por favor, inclua o nickname do jogador ap\u00F3s o comando..."));
            cChannel.send(new Discord.RichEmbed()
                .setTitle("!p RCPOLSKI")
                .setDescription("O bot n\u00E3o \u00E9 case sensitive, ou seja, n\u00E3o \u00E9 preciso diferenciar as mai\u00FAsculas das min\u00FAsculas")
                .setColor("#F1C40F"));
        }
        if (comando === "me") {
            args[0] = pView.NICKNAME;
            mReadCont = pView.NICKNAME;
            var isMeRequest = 1;
            profileSearch();
            updatePlayerInfo(message.author.id);
        }
        if (comando === "m" && args[0] === "?") {
            message["delete"](100);
            showReserves();
        }
        else if (comando === "m" && args.length) {
            try {
                var argslow = args[0].toLowerCase();
                var rNow = JSON.parse(fs.readFileSync('./gameContent/reservas.json', 'utf8'));
                var rData = rNow[argslow];
                if (!rData) {
                    cChannel.send(new Discord.RichEmbed()
                        .setTitle("Ops, parece que estamos com problemas aqui... Veja se o nome do mapa que procura est\u00E1 correto!")
                        .setDescription("Digite !reservas para saber mais")
                        .setColor("#E84C3D"));
                    console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es de " + args[0] + ", mas n\u00E3o obteve sucesso...");
                    return;
                }
                cChannel.send(new Discord.RichEmbed()
                    .setTitle(rData.Nome)
                    .setColor(rData.Cor)
                    .setDescription(rData.Descricao)
                    .setThumbnail(rData.MapaIcone)
                    .setImage(rData.MapaAnimais)
                    .addBlankField()
                    .addField(lc_emoji + "  Local", rData.Local, true)
                    .addField(se_emoji + "  Esta\u00E7\u00E3o", rData.Estacao, true)
                    .addField(ex_emoji + "  Animais exclusivos", rData.Exclusivo, true)
                    .addField(si_emoji + "  Tamanho (km\u00B2)", rData.KMQ, true)
                    .addField(si_emoji + "  Tamanho (Acres)", rData.Acres, true)
                    .addBlankField()
                    .addField(an_emoji + "  Animais", rData.AnimaisNaReserva, true)
                    .addField(dt_emoji + "  Eventuais mortes", rData.Mortes, true)
                    .setFooter("Requisitado por " + pView.NICKNAME + ". Para ver o nome das reservas, digite !reservas"));
                message["delete"](100);
                console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es de " + rData.Nome);
            }
            catch (err) {
                console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es de " + args[0] + ", mas n\u00E3o obteve sucesso...");
                console.log(err);
                cChannel.send(new Discord.RichEmbed()
                    .setColor("#E84C3D")
                    .setTitle("N\u00E3o consegui encontrar nada sobre essa reserva!")
                    .setDescription("Ficou sabendo de alguma atualiza\u00E7\u00E3o ou s\u00F3 errou a tecla ao digitar o nome? De uma verificada!"));
            }
        }
        else if (comando === "m" && !args.length) {
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " iniciou a requisi\u00E7\u00E3o de informa\u00E7\u00F5es de reserva, mas esqueceu de indicar qual...");
            cChannel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("Por favor, digite o primeiro nome da reserva o qual est\u00E1 tentando ver"));
            showReserves();
            return;
        }
        /* if (comando === `s` && args[0] === `?`) {
            message.cChannel.send(new Discord.RichEmbed()
                .setTitle(`!s reserva senha`)
                .setDescription(`A senha é opicional, deixe em branco se não for utilizar...`)
            )
        } else if (comando === `s` && !args.length) {
            message.cChannel.send(`Beep boop? Boop beep!`)
        } else if (comando === `s` && args.length) {
            try {
                var argslow = args[0].toLowerCase()
                var rNow = JSON.parse(fs.readFileSync(`./gameContent/reservas.json`, `utf8`))
                var rData = rNow[argslow]
                var passW = ``

                if (!args[1]) {
                    passW = `Sala aberta`
                } else {
                    passW = args[1]
                }
                delMsg()
                message.cChannel.send(new Discord.RichEmbed()
                    .setAuthor(autorNickname, autorAvatarURL)
                    .setTitle(`iniciou uma partida em ${rData.Nome}`)
                    .setColor(rData.Cor)
                    .addField(`Host`, autorNickname, true)
                    .addField(`Senha`, passW, true)
                    .setThumbnail(rData.MapaIcone))
            } catch (err) {
                message.cChannel.send(`Ops, algo deu errado, você escreveu na ordem correta? Consulte em !s ?`)
            }
        } */
        if (comando === "reservas") {
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es das reservas");
            message["delete"](100);
            showReserves();
        }
        if (comando === "sobre") {
            message["delete"](100);
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es do BOT");
            cChannel.send("Ol\u00E1, meu nome \u00E9 Guia!\nSou um bot assistente criado pelo RCPOLSKI para ajudar-los em d\u00FAvidas e curiosidades sobre o TheHunter Classic!\n\nNote que ainda estou em fase de testes e posso apresentar desmaios, tonturas e DC expot\u00E2neo.\nFeedback e duvidas, contatar @RCPOLSKI");
        }
        if (comando === "comandos") {
            message["delete"](100);
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou as informa\u00E7\u00F5es de comandos");
            showCommands();
        }
        // Desliga o bot pelo chat
        if (comando === "shutdown" && autorUsername === "RCPOLSKI") {
            console.log("[" + DataTempo + "] Bot Desligado");
            message["delete"](10);
            message.channel.send(BotSentences.adminEvents.onShutdown);
            client.destroy();
        }
        else if (comando === "shutdown" && autorUsername !== "RCPOLSKI") {
            message["delete"](100);
            message.channel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("" + BotSentences.adminEvents.onLackOfPermissions)
                .setDescription("Para ver os comandos dispon\u00EDveis, utilize **!comandos** em " + cChannel));
            return;
        }
        // Limpa a quantidade de mensagens indicadas
        if (comando === "cls" && autorUsername === "RCPOLSKI") {
            if (!args[0]) {
                args[0] = 2;
            }
            try {
                function clear() {
                    return __awaiter(this, void 0, void 0, function () {
                        var fetched;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    message["delete"](10);
                                    return [4 /*yield*/, message.channel.fetchMessages({
                                            limit: args[0]
                                        })];
                                case 1:
                                    fetched = _a.sent();
                                    message.channel.bulkDelete(fetched);
                                    return [2 /*return*/];
                            }
                        });
                    });
                }
                clear();
            }
            catch (err) {
                console.log(err);
                return;
            }
        }
        else if (comando === "cls" && autorUsername !== "RCPOLSKI") {
            console.log("[" + DataTempo + "] " + autorUsername + " tentou apagar as mensagens com o comandos !cls");
            message["delete"](100);
            message.channel.send(new Discord.RichEmbed()
                .setColor("#E84C3D")
                .setTitle("" + BotSentences.adminEvents.onLackOfPermissions)
                .setDescription("Para ver os comandos dispon\u00EDveis, utilize **!comandos** em " + cChannel));
            return;
        }
        if (comando === "rm" && autorUsername === "RCPOLSKI") {
            message["delete"](10);
            message.channel.send(message.content.replace("!rm", ""));
        }
        if (comando === "rb" && autorUsername === "RCPOLSKI") {
            message["delete"](10);
            message.channel.send(new Discord.RichEmbed()
                .setColor(RandomColor())
                .setDescription(message.content.replace("!rb", "")));
        }
        if (comando === "update" && autorUsername === "RCPOLSKI") {
            message["delete"](100);
            message.channel.send(new Discord.RichEmbed()
                .setTitle("Hotfix 1.2f")
                .setThumbnail(client.user.avatarURL)
                .setColor("#F1C40F")
                .setDescription("Esta atualiza\u00E7\u00E3o marca a volta do Hunter Helper e corre\u00E7\u00F5es de bugs")
                .addBlankField()
                .addField("A volta do HunterHelper", "O HH nasceu h\u00E1 alguns meses, se tornando o primeiro e \u00FAnico bot para o theHunter: Classic do mundo!\nSua recep\u00E7\u00E3o fora \u00FAnica e surpreendente, atraiu pessoas que se interessaram por suas fun\u00E7\u00F5es e at\u00E9 mesmo recebeu proposta de uso comercial.\nPor\u00E9m, devido a falta de tempo para manter novas updates e corre\u00E7\u00F5es, tamb\u00E9m dada a baixa movimenta\u00E7\u00E3o do server, o HH teve seu n\u00FAcleo desligado... No mesmo, n\u00E3o h\u00E1 porque se preocupar, a database passou por um backup antes disto e portanto, volta a ser funcional sem a necessidade de recadastramento!")
                .addBlankField()
                .addField("Corre\u00E7\u00F5es", "- Ajustado o arredondamento de precis\u00E3o, que agora agrega +1 ao valor caso esteja acima de *.5\n- Melhorado o reconhecimento de singularidade e pluraridade\n- Corrigido crash ao requisitar perfil pelo !me e n\u00E3o receber feedback do comando\n- Corrigido a distin\u00E7\u00E3o de requisi\u00E7\u00E3o para nomina\u00E7\u00E3o de pacotes\n- Removido BanCheck (Agora perfis tem backup total, mesmo ap\u00F3s ter sua conta apagada)\n- Corrigido o dailyTimer na atualiza\u00E7\u00E3o de perf\u00EDs\n- Corrigido erros de digita\u00E7\u00E3o")
                .addBlankField()
                .setFooter("Fique ligado para novas atualiza\u00E7\u00F5es, qualquer d\u00FAvida, contatar " + message.author.username)
                .setTimestamp());
        }
        function profileSearch() {
            var _this = this;
            var lookoutMember = tm_emoji_1 + "  Um momento " + pView.NICKNAME + "! Estou dando uma verificada no perfil de " + args[0] + "!";
            if (alRegisteredRequest === 1) {
                args[0] = pView.NICKNAME;
                mReadCont = pView.NICKNAME;
                lookoutMember = tm_emoji_1 + "  Um momento " + pView.NICKNAME + "! Estou dando uma verificada no seu perfil!";
            }
            if (isMeRequest === 1) {
                var pOrMe = "!me de " + pView.NICKNAME;
                lookoutMember = tm_emoji_1 + "  Um momento " + pView.NICKNAME + "! Estou dando uma verificada no seu perfil!";
            }
            var checkMinUser = pView.NICKNAME;
            checkMinUser.toLowerCase();
            if (args[0] === checkMinUser) {
                lookoutMember = tm_emoji_1 + "  Um momento " + pView.NICKNAME + "! Estou dando uma verificada no seu perfil!";
            }
            console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou a verifica\u00E7\u00E3o de perfil de " + args[0]);
            cChannel.send(new Discord.RichEmbed()
                .setColor("#F1C40F")
                .setTitle("" + lookoutMember)
                .setDescription("Por favor, aguarde... Isso pode levar at\u00E9 10 segundos!"))
                .then(function (msg) {
                if (args[0] === checkMinUser) {
                    setTimeout(function () {
                        msg.edit(new Discord.RichEmbed()
                            .setColor("#2DCC70")
                            .setTitle("Voc\u00EA sabia que \u00E9 poss\u00EDvel pesquisar seu pr\u00F3prio perfil usando o comando **!me**")
                            .setDescription("Por favor, aguarde... Isso pode levar at\u00E9 10 segundos!"));
                    }, 1000);
                }
            });
            try {
                (function () { return __awaiter(_this, void 0, void 0, function () {
                    var PlayerLink, response, $, URLPerfil, pOrMe, THPrecision, THLongShot, THRank, THCss, THAvatar, THHunterScoreString, THMinShot, THHarvested, THSpotted, THShots, THTracked, THTime, THWalk, THMushroom, THFriend, THTrophy, THNickname, THHunterScore, PlayTime, Shots, CalcPrecision, Walked, Mushroom, LongShot, MinShot, Friend, Trophy, ign, Precision, pColor, PTDays, PTHours, PTMinutes, snData, sData, pSearch;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                PlayerLink = "https://www.uhcapps.co.uk/stats_lifetime.php?username=" + args[0] // Source do Scrapper
                                ;
                                return [4 /*yield*/, rp(PlayerLink)];
                            case 1:
                                response = _a.sent();
                                $ = jCheerio.load(response);
                                URLPerfil = "https://www.thehunter.com/#profile/" + mReadCont;
                                pOrMe = "Perfil requisitado por " + pView.NICKNAME;
                                THPrecision = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.small").text();
                                THLongShot = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(25) > tbody > tr:nth-child(1) > td:nth-child(2) > span.main > strong").text();
                                THRank = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(5) > span.heading").text();
                                THCss = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(7) > span.heading").text();
                                THAvatar = $("#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img").attr("src");
                                THHunterScoreString = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading").text();
                                THMinShot = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(25) > tbody > tr:nth-child(1) > td:nth-child(4) > strong").text();
                                THHarvested = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(2) > span.main > strong").text();
                                THSpotted = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(6) > span.main > strong").text();
                                THShots = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.main > strong").text();
                                THTracked = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(4) > span.main > strong").text();
                                THTime = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(10) > tbody > tr > td:nth-child(2) > span.main > strong").text();
                                THWalk = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(10) > tbody > tr > td:nth-child(4) > span.main > strong").text();
                                THMushroom = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(4) > span.main > strong").text();
                                THFriend = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(16) > tbody > tr > td:nth-child(4) > span.main > strong").text();
                                THTrophy = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(16) > tbody > tr > td:nth-child(2) > span.main > strong").text();
                                THNickname = $("#user-profile-url").text();
                                THHunterScore = parseInt(THHunterScoreString);
                                if (THHunterScoreString === "") {
                                    console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou a verifica\u00E7\u00E3o de perfil de " + args[0] + ", mas n\u00E3o obteve sucesso...");
                                    cChannel.send(new Discord.RichEmbed()
                                        .setColor("#E84C3D")
                                        .setTitle("Eita, parece que o nickname fornecido n\u00E3o existe na database do jogo... Tenha certeza que voc\u00EA o escreveu corretamente"));
                                    return [2 /*return*/];
                                }
                                else {
                                    PlayTime = THTime.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                                    Shots = THShots.match(/[a-z]+|[0-9,]+(?:\.[0-9,]+|)/g);
                                    CalcPrecision = THPrecision.match(/[0-9.]+(?:\.[0-9.]+|)/g);
                                    Walked = THWalk.match(/[a-z]+|[0-9,]+(?:\.[0-9,]+|)/g);
                                    Mushroom = THMushroom.match(/[a-z]+|[0-9.,]+(?:\.[0-9.,]+|)/g);
                                    LongShot = THLongShot.match(/[a-z]+|[0-9.]+(?:\.[0-9.]+|)/g);
                                    MinShot = THMinShot.match(/[a-z]+|[0-9.]+(?:\.[0-9.]+|)/g);
                                    Friend = THFriend.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                                    Trophy = THTrophy.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                                    ign = THNickname.match(/[a-zA-Z,.-_]+|[0-9.,-_]+(?:\.[0-9.,-_]+|)/g);
                                    Precision = 100 - CalcPrecision;
                                    if ((Precision % 1) > 0.5) {
                                        Precision + 1;
                                    }
                                    if (LongShot === null) {
                                        delMsg();
                                        cChannel.send(new Discord.RichEmbed()
                                            .setColor("#E84C3D")
                                            .setTitle("Ei " + pView.NICKNAME + ", o usu\u00E1rio **" + args + "** n\u00E3o existe ou voc\u00EA escreveu o nick errado...")
                                            .setDescription("Portanto n\u00E3o h\u00E1 o que se ver por aqui!"));
                                        return [2 /*return*/];
                                    }
                                    // Define o título do jogador
                                    if (ign[1] === "membership_type_hunter") {
                                        ign[1] = "Ca\u00E7ador Licenciado";
                                    }
                                    else if (ign[1] === "Duck") {
                                        ign[1] = "Ca\u00E7ador de Patos";
                                    }
                                    else if (ign[1] === "Contributor") {
                                        ign[1] = "Contribu\u00EDnte";
                                    }
                                    else if (ign[1] === "Staff") {
                                        ign[1] = "Funcion\u00E1rio da EW";
                                    }
                                    else if (ign[1] === "Journeyman") {
                                        ign[1] = "Viajante";
                                    }
                                    pColor = "#FFFFFF";
                                    if (THHunterScore <= 299) {
                                        pColor = "#E6E6E6";
                                    }
                                    else if (THHunterScore >= 300 && THHunterScore <= 899) {
                                        pColor = "#2DCC70";
                                    }
                                    else if (THHunterScore >= 900 && THHunterScore <= 1799) {
                                        pColor = "#8C44CC";
                                    }
                                    else if (THHunterScore >= 1800 && THHunterScore <= 2999) {
                                        pColor = "#E84C3D";
                                    }
                                    else if (THHunterScore >= 3000 && THHunterScore <= 4999) {
                                        pColor = "#C5F181";
                                    }
                                    else if (THHunterScore >= 5000 && THHunterScore <= 7499) {
                                        pColor = "#3598DB";
                                    }
                                    else if (THHunterScore >= 7500 && THHunterScore <= 9999) {
                                        pColor = "#F35CAC";
                                    }
                                    else if (THHunterScore >= 10000 && THHunterScore <= 24999) {
                                        pColor = "#E67F22";
                                    }
                                    else if (THHunterScore >= 25000 && THHunterScore <= 49999) {
                                        pColor = "#65CCCC";
                                    }
                                    else if (THHunterScore >= 50000 && THHunterScore <= 99999) {
                                        pColor = "#FD1BF7";
                                    }
                                    else if (THHunterScore >= 100000) {
                                        pColor = "#F1C40F";
                                    }
                                    delMsg();
                                    PTDays = "dia";
                                    PTHours = "hora";
                                    PTMinutes = "minuto";
                                    if (PlayTime[0] > 1) {
                                        PTDays = "dias";
                                    }
                                    if (PlayTime[2] > 1) {
                                        PTHours = "horas";
                                    }
                                    if (PlayTime[4] > 1) {
                                        PTMinutes = "minutos";
                                    }
                                    cChannel.send(new Discord.RichEmbed()
                                        .setColor(pColor)
                                        .setAuthor("Clique aqui para ir ao perfil deste jogador", "", URLPerfil)
                                        .setTitle("Voc\u00EA est\u00E1 vendo o perfil de " + ign[0])
                                        .setDescription("Este jogador \u00E9 um " + ign[1])
                                        .addBlankField()
                                        .setThumbnail(THAvatar)
                                        .addField(hs_emoji_1 + "  **" + THHunterScore + "**", "Pontua\u00E7\u00E3o de ca\u00E7ador", true)
                                        .addField(rk_emoji_1 + "  **" + THRank + "**", "Rank Global", true)
                                        .addBlankField()
                                        .addField(ds_emoji_1 + "  **" + LongShot[0] + "**m", "Abate mais longo", true)
                                        .addField(ds_emoji_1 + "  **" + MinShot[0] + "**m", "Abate mais perto", true)
                                        .addBlankField()
                                        .addField(gr_emoji_1 + "  **" + THHarvested + "**", "Animais recolhidos", true)
                                        .addField(mg_emoji_1 + "  **" + THTracked + "**", "Animais rastreados", true)
                                        .addField(bn_emoji_1 + "  **" + THSpotted + "**", "Animais focalizados", true)
                                        .addField(cs_emoji_1 + "  **" + THCss + "**", "M\u00E9dia de CSS por abate", true)
                                        .addBlankField()
                                        .addField(sh_emoji_1 + "  **" + Walked[0] + "**km", "Dist\u00E2ncia percorrida", true)
                                        .addField(ms_emoji_1 + "  **" + Mushroom[3] + "**kg", "Cogumelos coletados", true)
                                        .addField(tr_emoji_1 + "  **" + Trophy[0] + "** trof\u00E9us", "Competi\u00E7\u00F5es ganhas", true)
                                        .addField(fr_emoji_1 + "  **" + Friend[0] + "** ca\u00E7adores", "Amigos", true)
                                        .addBlankField()
                                        .addField(ps_emoji_1 + "  Sua precis\u00E3o \u00E9 de **" + Precision.toPrecision(2) + "%**", Shots[0] + " disparos\n" + Shots[3] + " acertos\n" + Shots[6] + " erros", true) //0, 3, 6
                                        .addField(tm_emoji_1 + "  Tempo total ca\u00E7ando", PlayTime[0] + " " + PTDays + ", " + PlayTime[2] + " " + PTHours + " e " + PlayTime[4] + " " + PTMinutes, true)
                                        .setFooter(pOrMe)
                                        .setTimestamp());
                                    snData = {
                                        NICKNAME: "" + ign[0],
                                        TITLE: "" + ign[1],
                                        HUNTERSCORE: "" + THHunterScore,
                                        RANK: "" + THRank,
                                        LONGO: "" + LongShot[0],
                                        PERTO: "" + MinShot[0],
                                        RECOLHIDOS: "" + THHarvested,
                                        RASTREADOS: "" + THTracked,
                                        FOCALIZADOS: "" + THSpotted,
                                        CSS: "" + THCss,
                                        ANDOU: "" + Walked[0],
                                        COGUMELOS: "" + Mushroom[3],
                                        TROFEUS: "" + Trophy[0],
                                        AMIGOS: "" + Friend[0],
                                        PRECISAO: "" + Precision,
                                        TEMPO: PlayTime[0] + "d" + PlayTime[2] + "h" + PlayTime[4] + "m",
                                        LASTUPDATE: "" + DataTempo,
                                        LASTREQUEST: autorNickname + " (" + autorUsername + ")"
                                    };
                                    sData = JSON.stringify(snData, null, "\t");
                                    fs.writeFileSync("./perfis/pesquisados/" + ign[0] + ".json", sData);
                                    pSearch = "./perfis/pesquisados/" + ign[0] + "json";
                                }
                                return [2 /*return*/];
                        }
                    });
                }); })();
            }
            catch (err) {
                console.log("[" + DataTempo + "] " + pView.NICKNAME + " requisitou a verifica\u00E7\u00E3o de perfil de " + args[0] + ", mas n\u00E3o obteve sucesso...");
                cChannel.send(new Discord.RichEmbed()
                    .setColor("#E84C3D")
                    .setTitle("Ei " + pView.NICKNAME + ", o usu\u00E1rio " + args + " n\u00E3o existe ou voc\u00EA escreveu o nick errado...")
                    .setDescription("Portanto n\u00E3o h\u00E1 o que se ver por aqui!"));
            }
        }
        return;
    }
    // Funções
    // Exibe a janela de !commandos
    function showCommands() {
        var cChannel = message.guild.channels.find(function (ch) { return ch.name === "comandos"; });
        cChannel.send(new Discord.RichEmbed()
            .setThumbnail(client.user.avatarURL)
            .setColor("#E67F22")
            .setTitle("H\u00E1 mais comandos sendo desenvolvidos, por agora, estou apto \u00E0 lhe atender aos seguintes comandos")
            .setFooter("v1.2_d")
            .addBlankField()
            .addField("!comandos", "Exibe essa janela!")
            .addField("!me", "Mostra o seu perfil")
            .addField("!id", "Mostra o seu HUNTER ID")
            .addField("!p nickname", "Monstra o perfil do nickname provido")
            .addField("!sobre", "Saiba mais sobre mim!")
            .addField("!m reserva", "Exibe a tabela da reserva indicada...\nPesquise as reservas pelo primeiro nome")
            .addField("!reservas", "Exibe a janela de lista das reservas"));
    }
    // Exibe a janela de !reservas
    function showReserves() {
        var cChannel = message.guild.channels.find(function (ch) { return ch.name === "comandos"; });
        var wh_emoji = client.emojis.find(function (emoji) { return emoji.name === "WH_Icon"; });
        var lp_emoji = client.emojis.find(function (emoji) { return emoji.name === "LP_Icon"; });
        var sc_emoji = client.emojis.find(function (emoji) { return emoji.name === "SC_Icon"; });
        var rf_emoji = client.emojis.find(function (emoji) { return emoji.name === "RF_Icon"; });
        var hf_emoji = client.emojis.find(function (emoji) { return emoji.name === "HF_Icon"; });
        var hm_emoji = client.emojis.find(function (emoji) { return emoji.name === "HM_Icon"; });
        var rb_emoji = client.emojis.find(function (emoji) { return emoji.name === "RB_Icon"; });
        var vb_emoji = client.emojis.find(function (emoji) { return emoji.name === "VB_Icon"; });
        var br_emoji = client.emojis.find(function (emoji) { return emoji.name === "BR_Icon"; });
        var wr_emoji = client.emojis.find(function (emoji) { return emoji.name === "WR_Icon"; });
        var tt_emoji = client.emojis.find(function (emoji) { return emoji.name === "TT_Icon"; });
        var pb_emoji = client.emojis.find(function (emoji) { return emoji.name === "PB_Icon"; });
        cChannel.send(new Discord.RichEmbed()
            .setColor("#F1C40F")
            .setTitle("Para fazer uma pesquisa, utilize o c\u00F3digo fornecido abaixo do nome do mapa")
            .setDescription("Algo assim **!m loggers**")
            .addBlankField()
            .addField(wh_emoji + "  Whitehart Island", "**!m whitehart**", true)
            .addField(lp_emoji + "  Logger's Point", "**!m loggers**", true)
            .addField(sc_emoji + "  Settler Creeks", "**!m settler**", true)
            .addBlankField()
            .addField(rf_emoji + "  Redfeather Falls", "**!m redfeather**", true)
            .addField(hf_emoji + "  Hirschfelden", "**!m hirschfelden**", true)
            .addField(hm_emoji + "  Hemmeldal", "**!m hemmedal**", true)
            .addBlankField()
            .addField(rb_emoji + "  Rougarou Bayou", "**!m rougarou**", true)
            .addField(vb_emoji + "  Val-des-Bois", "**!m valdesbois**", true)
            .addField(br_emoji + "  Bushrangers Run", "**!m bushrangers**", true)
            .addBlankField()
            .addField(wr_emoji + "  Whiterime Ridge", "**!m whiterim**e", true)
            .addField(tt_emoji + "  Timbergold Trails", "**!m timbergold**", true)
            .addField(pb_emoji + "  Piccabeen Bay", "**!m piccabeen**", true));
    }
    // Registra o usuário caso ele não tenha registro ainda
    function registerUser() {
        var _this = this;
        // Assets
        var hs_emoji = client.emojis.find(function (emoji) { return emoji.name === "hs"; });
        var rk_emoji = client.emojis.find(function (emoji) { return emoji.name === "rank"; });
        var tm_emoji = client.emojis.find(function (emoji) { return emoji.name === "timer"; });
        var ex_emoji = client.emojis.find(function (emoji) { return emoji.name === "exclusive"; });
        // Cargos/Titulos
        var no_role = message.guild.roles.find(function (a) { return a.name === "Ca\u00E7ador sem licen\u00E7a"; });
        var in_role = message.guild.roles.find(function (b) { return b.name === "Nivel Iniciante 0 - 300"; });
        var az_role = message.guild.roles.find(function (c) { return c.name === "Nivel Aprendiz  300+"; });
        var am_role = message.guild.roles.find(function (d) { return d.name === "Nivel Amador 900+"; });
        var cd_role = message.guild.roles.find(function (e) { return e.name === "Nivel Ca\u00E7ador 1800+"; });
        var it_role = message.guild.roles.find(function (f) { return f.name === "Nivel Instrutor 3000+"; });
        var gu_role = message.guild.roles.find(function (g) { return g.name === "Nivel Guia 5000+"; });
        var ep_role = message.guild.roles.find(function (h) { return h.name === "Nivel \u00C9pico 7500+"; });
        var ld_role = message.guild.roles.find(function (i) { return i.name === "N\u00EDvel Lend\u00E1rio 10.000+"; });
        var mt_role = message.guild.roles.find(function (j) { return j.name === "Nivel M\u00EDtico 25.000+"; });
        var ex_role = message.guild.roles.find(function (k) { return k.name === "Nivel Extraordin\u00E1rio 50.000+"; });
        var ec_role = message.guild.roles.find(function (l) { return l.name === "Nivel Embaixador de Ca\u00E7a 100.000+"; });
        var autorID = message.author.id; // ID do usuário
        var args = message.content.slice(prefix.length).split(" ");
        var p = autorID;
        var alreadyReg = 0;
        var member = message.member;
        var aNickname = args[1];
        var mkReg = "Um momento " + member.user.username + "... Estou criando sua **HUNTER ID**";
        var lNickname = aNickname.toLowerCase();
        // !admr @xGamerBRx xgamebrx
        if (isAdmR === 1) {
            var member = rMember;
            p = member.user.id;
            aNickname = args[2];
            mkReg = "Estou cadastrando o usu\u00E1rio " + member.user.username + ", a pedido do administrador!";
        }
        if (fs.existsSync("./perfis/registrados/" + p + ".json")) {
            alreadyReg = 1;
        }
        if (fs.existsSync("./perfis/nicknames/" + lNickname + ".json") && alreadyReg === 0) {
            var pView = require("./perfis/nicknames/" + lNickname + ".json");
            cChannel.send(new Discord.RichEmbed()
                .setTitle("O nickname que voc\u00EA escolheu j\u00E1 foi cadastrado no usu\u00E1rio " + pView.USER + "...")
                .setDescription("O seu perfil e o de " + pView.USER + " foram marcados para futura analise!\nN\u00E3o posso lhe ajudar agora, por favor, compreenda...")
                .setColor("#E84C3D"));
            return;
        }
        if (fs.existsSync("./perfis/registrados/" + p + ".json") && alreadyReg === 1) {
            var pView = require("./perfis/registrados/" + p + ".json");
            cChannel.send(new Discord.RichEmbed()
                .setTitle("Parece que voc\u00EA j\u00E1 est\u00E1 registrado em minha database com o nickname de " + pView.NICKNAME + "...")
                .setDescription("N\u00E3o \u00E9 o seu nickname, ou est\u00E1 escrito incorretamente? Contate o RCPOLSKI para resolver!")
                .setColor("#E84C3D"));
            return;
        }
        else if (!fs.existsSync("./perfis/registrados/" + p + ".json")) {
            (function () { return __awaiter(_this, void 0, void 0, function () {
                var Hoje, Data, Tempo, DataTempo, PlayerLink, response, $, THHunterScore, THNickname, THAvatar, ign, memberRole, numberRole, XPRoof, myRole, myPoints, pColor, dHora, Hora, iData, isData, nData, nsData, intHunterScore, XPNeeded, err_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            Hoje = new Date();
                            Data = Hoje.getDate() + "/" + (Hoje.getMonth() + 1) + "/" + Hoje.getFullYear();
                            Tempo = Hoje.getHours() + ":" + Hoje.getMinutes() + ":" + Hoje.getSeconds();
                            DataTempo = Data + "  " + Tempo;
                            // Envia uma mensagem avisando sobre o cadastro
                            cChannel.send(new Discord.RichEmbed()
                                .setColor("#F1C40F")
                                .setTitle(tm_emoji + "  " + mkReg))
                                .then(function (msg) {
                                setTimeout(function () {
                                    msg["delete"]();
                                }, 10000);
                            });
                            PlayerLink = "https://www.uhcapps.co.uk/stats_lifetime.php?username=" + aNickname // Source do Scrapper
                            ;
                            return [4 /*yield*/, rp(PlayerLink)];
                        case 1:
                            response = _a.sent();
                            $ = jCheerio.load(response);
                            THHunterScore = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading").text();
                            THNickname = $("#user-profile-url").text();
                            THAvatar = $("#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img").attr("src");
                            ign = THNickname.match(/[a-zA-Z,.-_]+|[0-9.,-_]+(?:\.[0-9.,-_]+|)/g);
                            if (!THHunterScore) {
                                console.log("ERROR");
                                message["delete"](100);
                                cChannel.send(new Discord.RichEmbed()
                                    .setColor("#E84C3D")
                                    .setTitle("Ops, parece que temos um erro aqui...")
                                    .setDescription("Voc\u00EA tem certeza de que escreveu o nickname correto?"));
                                return [2 /*return*/];
                            }
                            memberRole = az_role;
                            numberRole = 0;
                            XPRoof = 0;
                            myRole = "";
                            myPoints = "";
                            pColor = "";
                            // Define o título do jogador baseado em seu Hunter Score
                            if (THHunterScore <= 299) {
                                member.setRoles([in_role]);
                                pColor = "#E6E6E6";
                                memberRole = in_role;
                                numberRole = 1;
                                myRole = "Iniciante";
                                myPoints = "De 0 \u00E0 300 pontos";
                                XPRoof = 300;
                            }
                            else if (THHunterScore >= 300 && THHunterScore <= 899) {
                                member.setRoles([az_role]);
                                pColor = "#2DCC70";
                                memberRole = az_role;
                                numberRole = 2;
                                myRole = "Aprendiz";
                                myPoints = "Mais de 300 pontos";
                                XPRoof = 900;
                            }
                            else if (THHunterScore >= 900 && THHunterScore <= 1799) {
                                member.setRoles([am_role]);
                                pColor = "#8C44CC";
                                memberRole = am_role;
                                numberRole = 3;
                                myRole = "Amador";
                                myPoints = "Mais de 900 pontos";
                                XPRoof = 1800;
                            }
                            else if (THHunterScore >= 1800 && THHunterScore <= 2999) {
                                member.setRoles([cd_role]);
                                pColor = "#E84C3D";
                                memberRole = cd_role;
                                numberRole = 4;
                                myRole = "Ca\u00E7ador";
                                myPoints = "Mais de 1.800 pontos";
                                XPRoof = 3000;
                            }
                            else if (THHunterScore >= 3000 && THHunterScore <= 4999) {
                                member.setRoles([it_role]);
                                pColor = "#C5F181";
                                memberRole = it_role;
                                numberRole = 5;
                                myRole = "Instrutor";
                                myPoints = "Mais de 3.000 pontos";
                                XPRoof = 5000;
                            }
                            else if (THHunterScore >= 5000 && THHunterScore <= 7499) {
                                member.setRoles([gu_role]);
                                pColor = "#3598DB";
                                memberRole = gu_role;
                                numberRole = 6;
                                myRole = "Guia";
                                myPoints = "Mais de 5.000 pontos";
                                XPRoof = 7500;
                            }
                            else if (THHunterScore >= 7500 && THHunterScore <= 9999) {
                                member.setRoles([ep_role]);
                                pColor = "#F35CAC";
                                memberRole = ep_role;
                                numberRole = 7;
                                myRole = "\u00C9pico";
                                myPoints = "Mais de 7.500 pontos";
                                XPRoof = 10000;
                            }
                            else if (THHunterScore >= 10000 && THHunterScore <= 24999) {
                                member.setRoles([ld_role]);
                                pColor = "#E67F22";
                                memberRole = ld_role;
                                numberRole = 8;
                                myRole = "Lend\u00E1rio";
                                myPoints = "Mais de 10.000 pontos";
                                XPRoof = 25000;
                            }
                            else if (THHunterScore >= 25000 && THHunterScore <= 49999) {
                                member.setRoles([mt_role]);
                                pColor = "#65CCCC";
                                memberRole = mt_role;
                                numberRole = 9;
                                myRole = "M\u00EDtico";
                                myPoints = "Mais de 25.000 pontos";
                                XPRoof = 50000;
                            }
                            else if (THHunterScore >= 50000 && THHunterScore <= 99999) {
                                member.setRoles([ex_role]);
                                pColor = "#FD1BF7";
                                memberRole = ex_role;
                                numberRole = 10;
                                myRole = "Extraordin\u00E1rio";
                                myPoints = "Mais de 50.000 pontos";
                                XPRoof = 100000;
                            }
                            else if (THHunterScore >= 100000) {
                                member.setRoles([ec_role]);
                                pColor = "#F1C40F";
                                memberRole = ec_role;
                                numberRole = 11;
                                myRole = "Embaixador de Ca\u00E7a";
                                myPoints = "Mais de 100.000 pontos";
                                XPRoof = 109000;
                            }
                            dHora = new Date();
                            Hora = dHora.getHours();
                            iData = {
                                ID: "" + member.user.id,
                                TAG: "" + member.user.tag,
                                DISCORDUSERNAME: "" + member.user.username,
                                HUNTERSCORE: "" + THHunterScore,
                                THCAVATAR: "" + THAvatar,
                                ROLE: "" + memberRole,
                                COR: "" + pColor,
                                NROLE: "" + numberRole,
                                NICKNAME: "" + ign[0],
                                LASTUP: "" + Hora
                            };
                            isData = JSON.stringify(iData, null, "\t");
                            fs.writeFileSync("./perfis/registrados/" + p + ".json", isData);
                            nData = {
                                USER: "" + member.user.username,
                                ID: "" + member.user.id,
                                NICKNAME: "" + ign[0],
                                TIME: "" + DataTempo
                            };
                            nsData = JSON.stringify(nData, null, "\t");
                            fs.writeFileSync("./perfis/nicknames/" + ign[0].toLowerCase() + ".json", nsData);
                            if (member.user.id === message.guild.ownerID) {
                                //console.log(`O senhor é o meu pastor e seu nickname não alterarei!`)
                                return [2 /*return*/];
                            }
                            else {
                                member.setNickname(ign[0] + " \u2605 " + THHunterScore);
                            }
                            intHunterScore = parseInt(THHunterScore);
                            XPNeeded = XPRoof - intHunterScore;
                            cChannel.send(new Discord.RichEmbed()
                                .setTitle(ign[0] + "  |  HUNTER ID")
                                .setDescription(p)
                                .addBlankField()
                                .addField(hs_emoji + "  **" + THHunterScore + "**", "Sua pontua\u00E7\u00E3o de ca\u00E7ador", true)
                                .addField(rk_emoji + " ** " + myPoints + "**", memberRole, true)
                                .addField(ex_emoji + "  **" + THHunterScore + "/" + XPRoof + "** Pts", "Falta apenas **" + XPNeeded + "** pontos de ca\u00E7ador para voc\u00EA alcan\u00E7ar o pr\u00F3ximo n\u00EDvel!")
                                .addBlankField()
                                .setColor(pColor)
                                .setThumbnail(THAvatar)
                                .setFooter("Use !me para mostrar o seu pr\u00F3prio perfil")
                                .setTimestamp());
                            console.log("[" + DataTempo + "] " + member.user.username + "(" + p + ") se registrou com sucesso!");
                            return [3 /*break*/, 3];
                        case 2:
                            err_1 = _a.sent();
                            cChannel.send(new Discord.RichEmbed()
                                .setTitle("Ops, parece que n\u00E3o fui capaz de encontrar o seu nickname...")
                                .setDescription("Voc\u00EA tem certeza que esse \u00E9 o seu nickname? > " + aNickname)
                                .setColor("#E84C3D"));
                            console.log(err_1);
                            return [2 /*return*/];
                        case 3: return [2 /*return*/];
                    }
                });
            }); })();
        }
    }
    function updatePlayerInfo(id) {
        var _this = this;
        // Assets
        var hs_emoji = client.emojis.find(function (emoji) { return emoji.name === "hs"; });
        var rk_emoji = client.emojis.find(function (emoji) { return emoji.name === "rank"; });
        var ex_emoji = client.emojis.find(function (emoji) { return emoji.name === "exclusive"; });
        var no_role = message.guild.roles.find(function (a) { return a.name === "Ca\u00E7ador sem licen\u00E7a"; });
        var in_role = message.guild.roles.find(function (b) { return b.name === "Nivel Iniciante 0 - 300"; });
        var az_role = message.guild.roles.find(function (c) { return c.name === "Nivel Aprendiz  300+"; });
        var am_role = message.guild.roles.find(function (d) { return d.name === "Nivel Amador 900+"; });
        var cd_role = message.guild.roles.find(function (e) { return e.name === "Nivel Ca\u00E7ador 1800+"; });
        var it_role = message.guild.roles.find(function (f) { return f.name === "Nivel Instrutor 3000+"; });
        var gu_role = message.guild.roles.find(function (g) { return g.name === "Nivel Guia 5000+"; });
        var ep_role = message.guild.roles.find(function (h) { return h.name === "Nivel \u00C9pico 7500+"; });
        var ld_role = message.guild.roles.find(function (i) { return i.name === "N\u00EDvel Lend\u00E1rio 10.000+"; });
        var mt_role = message.guild.roles.find(function (j) { return j.name === "N\u00EDvel M\u00EDtico 25.000+"; });
        var ex_role = message.guild.roles.find(function (k) { return k.name === "Nivel Extraordin\u00E1rio 50.000+"; });
        var ec_role = message.guild.roles.find(function (l) { return l.name === "Nivel Embaixador de Ca\u00E7a 100.000+"; });
        var autorID = message.author.id; // ID do usuário
        var autorNickname = message.member.nickname; // Apelido do usuário 
        var p = autorID;
        var member = message.member;
        var Hoje = new Date();
        var Data = Hoje.getDate() + "/" + (Hoje.getMonth() + 1) + "/" + Hoje.getFullYear();
        var Tempo = Hoje.getHours() + ":" + Hoje.getMinutes() + ":" + Hoje.getSeconds();
        var DataTempo = Data + " " + Tempo;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            function levelUp() {
                cChannel.send(new Discord.RichEmbed()
                    .setTitle("Parab\u00E9ns " + pView.NICKNAME + "!")
                    .setDescription("Voc\u00EA acaba de alcan\u00E7ar um novo n\u00EDvel!")
                    .addBlankField()
                    .addField(hs_emoji + "  " + THHunterScore, "Sua pontua\u00E7\u00E3o de ca\u00E7ador", true)
                    .addField(rk_emoji + "  " + myPoints, memberRole, true)
                    .addField(ex_emoji + "  " + THHunterScore + "/" + XPRoof + " Pts", "Falta apenas " + XPNeeded + " pontos de ca\u00E7ador para voc\u00EA alcan\u00E7ar o pr\u00F3ximo n\u00EDvel!")
                    .addBlankField()
                    .setColor(pColor)
                    .setThumbnail(pView.THCAVATAR)
                    .setFooter("Use !me para mostrar o seu pr\u00F3prio perfil")
                    .setTimestamp());
            }
            function cardShow() {
                cChannel.send(new Discord.RichEmbed()
                    .setTitle(pView.NICKNAME + "  |  HUNTER ID")
                    .setDescription(pView.ID)
                    .addBlankField()
                    .addField(hs_emoji + "  **" + THHunterScore + "**", "Sua pontua\u00E7\u00E3o de ca\u00E7ador", true)
                    .addField(rk_emoji + "  **" + myPoints + "**", memberRole, true)
                    .addField(ex_emoji + "  **" + THHunterScore + "/" + XPRoof + "** Pts", "Falta apenas **" + XPNeeded + "** pontos de ca\u00E7ador para voc\u00EA alcan\u00E7ar o pr\u00F3ximo n\u00EDvel!")
                    .addBlankField()
                    .setColor(pColor)
                    .setThumbnail(pView.THCAVATAR)
                    .setFooter("Use !me para mostrar o seu pr\u00F3prio perfil")
                    .setTimestamp());
            }
            var dHora, Hora, JSONCheck, pView, PlayerLinkpView, response, $, THHunterScore, THAvatar, memberRole, fetchedRole, numberRole, pColor, myRole, myPoints, XPRoof, intHunterScore, XPNeeded, iData, pData, Error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        dHora = new Date();
                        Hora = dHora.getHours();
                        // !admr @xGamerBRx xgamebrx
                        if (isAdmR === 1) {
                            member = uMember;
                            p = member.user.id;
                        }
                        if (isBulkUpdate === 1) {
                        }
                        JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + p + ".json");
                        JSONCheck.resume();
                        JSONCheck.forceUpdate();
                        JSONCheck.stop();
                        pView = JSONCheck;
                        PlayerLinkpView = "https://www.uhcapps.co.uk/stats_lifetime.php?username=" + pView.NICKNAME // Source do Scrapper
                        ;
                        return [4 /*yield*/, rp(PlayerLinkpView)];
                    case 1:
                        response = _a.sent();
                        $ = jCheerio.load(response);
                        THHunterScore = $("body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading").text();
                        THAvatar = $("#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img").attr("src");
                        memberRole = az_role;
                        fetchedRole = parseInt(pView.NROLE);
                        numberRole = 100;
                        pColor = pView.COR;
                        myRole = "";
                        myPoints = "";
                        XPRoof = 0;
                        intHunterScore = parseInt(THHunterScore);
                        // Define o título do jogador por meio de seu Hunter Score
                        try {
                            if (THHunterScore <= 299) {
                                member.addRole(in_role);
                                pColor = "#E6E6E6";
                                memberRole = in_role;
                                numberRole = 1;
                                myRole = "Iniciante";
                                myPoints = "De 0 \u00E0 300 pontos";
                                XPRoof = 300;
                            }
                            else if (THHunterScore >= 300 && THHunterScore <= 899) {
                                member.addRole(az_role);
                                pColor = "#2DCC70";
                                memberRole = az_role;
                                numberRole = 2;
                                myRole = "Aprendiz";
                                myPoints = "Mais de 300 pontos";
                                XPRoof = 900;
                            }
                            else if (THHunterScore >= 900 && THHunterScore <= 1799) {
                                member.addRole(am_role);
                                pColor = "#8C44CC";
                                memberRole = am_role;
                                numberRole = 3;
                                myRole = "Amador";
                                myPoints = "Mais de 900 pontos";
                                XPRoof = 1800;
                            }
                            else if (THHunterScore >= 1800 && THHunterScore <= 2999) {
                                member.addRole(cd_role);
                                pColor = "#E84C3D";
                                memberRole = cd_role;
                                numberRole = 4;
                                myRole = "Ca\u00E7ador";
                                myPoints = "Mais de 1.800 pontos";
                                XPRoof = 3000;
                            }
                            else if (THHunterScore >= 3000 && THHunterScore <= 4999) {
                                member.addRole(it_role);
                                pColor = "#C5F181";
                                memberRole = it_role;
                                numberRole = 5;
                                myRole = "Instrutor";
                                myPoints = "Mais de 3.000 pontos";
                                XPRoof = 5000;
                            }
                            else if (THHunterScore >= 5000 && THHunterScore <= 7499) {
                                member.addRole(gu_role);
                                pColor = "#3598DB";
                                memberRole = gu_role;
                                numberRole = 6;
                                myRole = "Guia";
                                myPoints = "Mais de 5.000 pontos";
                                XPRoof = 7500;
                            }
                            else if (THHunterScore >= 7500 && THHunterScore <= 9999) {
                                member.addRole(ep_role);
                                pColor = "#f35cac";
                                memberRole = ep_role;
                                numberRole = 7;
                                myRole = "\u00C9pico";
                                myPoints = "Mais de 7.500 pontos";
                                XPRoof = 10000;
                            }
                            else if (THHunterScore >= 10000 && THHunterScore <= 24999) {
                                member.addRole(ld_role);
                                pColor = "#E67F22";
                                memberRole = ld_role;
                                numberRole = 8;
                                myRole = "Lend\u00E1rio";
                                myPoints = "Mais de 10.000 pontos";
                                XPRoof = 25000;
                            }
                            else if (THHunterScore >= 25000 && THHunterScore <= 49999) {
                                member.addRole(mt_role);
                                pColor = "#65CCCC";
                                memberRole = mt_role;
                                numberRole = 9;
                                myRole = "M\u00EDtico";
                                myPoints = "Mais de 25.000 pontos";
                                XPRoof = 50000;
                            }
                            else if (THHunterScore >= 50000 && THHunterScore <= 99999) {
                                member.addRole(ex_role);
                                pColor = "#FD1BF7";
                                memberRole = ex_role;
                                numberRole = 10;
                                myRole = "Extraordin\u00E1rio";
                                myPoints = "Mais de 50.000 pontos";
                                XPRoof = 100000;
                            }
                            else if (THHunterScore >= 100000) {
                                member.addRole(ec_role);
                                pColor = "#F1C40F";
                                memberRole = ec_role;
                                numberRole = 11;
                                myRole = "Embaixador de Ca\u00E7a";
                                myPoints = "Mais de 100.000 pontos";
                                XPRoof = 109000;
                            }
                        }
                        catch (err) {
                            console.log(err);
                        }
                        try {
                            switch (numberRole) {
                                case 1:
                                    break;
                                case 2:
                                    member.removeRole(in_role);
                                    break;
                                case 3:
                                    member.removeRole(az_role);
                                    break;
                                case 4:
                                    member.removeRole(am_role);
                                    break;
                                case 5:
                                    member.removeRole(cd_role);
                                    break;
                                case 6:
                                    member.removeRole(it_role);
                                    break;
                                case 7:
                                    member.removeRole(gu_role);
                                    break;
                                case 8:
                                    member.removeRole(ep_role);
                                    break;
                                case 9:
                                    member.removeRole(ld_role);
                                    break;
                                case 10:
                                    member.removeRole(mt_role);
                                    break;
                                case 11:
                                    member.removeRole(ex_role);
                                    break;
                                default:
                                    console.log("N\u00E3o foi poss\u00EDvel encontrar o cargo deste usu\u00E1rio");
                            }
                        }
                        catch (error) {
                            console.error(error);
                        }
                        XPNeeded = XPRoof - intHunterScore;
                        if (numberRole > fetchedRole) {
                            levelUp();
                        }
                        if (cardRequested === 1) {
                            cardShow();
                        }
                        iData = {
                            ID: "" + member.user.id,
                            TAG: "" + member.user.tag,
                            DISCORDUSERNAME: "" + member.user.username,
                            DISCORDAVATARURL: "" + member.user.avatarURL,
                            HUNTERSCORE: "" + THHunterScore,
                            THCAVATAR: "" + THAvatar,
                            ROLE: "" + memberRole,
                            COR: "" + pColor,
                            NROLE: "" + numberRole,
                            NICKNAME: "" + pView.NICKNAME,
                            LASTUP: "" + Hora
                        };
                        pData = JSON.stringify(iData, null, "\t");
                        fs.writeFileSync("./perfis/registrados/" + p + ".json", pData);
                        if (member.user.id === message.guild.ownerID) {
                            //console.log(`O senhor é o meu pastor e seu nickname não alterarei!`)
                            return [2 /*return*/];
                        }
                        else {
                            member.setNickname(pView.NICKNAME + " \u2605 " + THHunterScore);
                        }
                        console.log("[" + DataTempo + "] " + pView.NICKNAME + " forteve seu perfil atualizado!");
                        return [3 /*break*/, 3];
                    case 2:
                        Error_1 = _a.sent();
                        console.log("Ops, n\u00E3o consegui atualizar o registro de " + autorNickname);
                        console.log(Error_1);
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); })();
    }
    function delPlayerInfo() {
        try {
            var JSONCheck = new jSelfReloadJSON("./perfis/registrados/" + dMember.user.id + ".json");
            JSONCheck.resume();
            JSONCheck.forceUpdate();
            JSONCheck.stop();
            var delViewRequestID = JSONCheck;
            var tm_emoji = client.emojis.find(function (emoji) { return emoji.name === "timer"; });
            var no_role = message.guild.roles.find(function (a) { return a.name === "Ca\u00E7ador sem licen\u00E7a"; });
            var nick = delViewRequestID.NICKNAME;
            var nickToLow = nick.toLowerCase();
            fs.unlinkSync("./perfis/nicknames/" + nickToLow + ".json");
            fs.unlinkSync("./perfis/registrados/" + dMember.user.id + ".json");
            message["delete"](100);
            console.log("Os dados de " + dMember.user.username + "(" + dMember.user.id + ") foram apagados pelo administrador");
            cChannel.send(new Discord.RichEmbed()
                .setColor("#F1C40F")
                .setTitle(tm_emoji + " Estou apagando os dados de **" + nick + "** a pedido do administrador"))
                .then(function (msg) {
                setTimeout(function () {
                    msg.edit(new Discord.RichEmbed()
                        .setColor("#F1C40F")
                        .setTitle("**" + dMember.user.username + "** teve seus dados apagados a pedido do administrador!"));
                }, 3000);
            });
            dMember.setNickname(dMember.user.username);
            dMember.setRoles([no_role]);
            /* cChannel.send(new Discord.RichEmbed()
            .setColor(`#2DCC70`)
            .setTitle(`**${dMember.user.username}** teve seus dados apagados a pedido do administrador`)) */
            return;
        }
        catch (err) {
            cChannel.send(new Discord.RichEmbed()
                .setColor("#F1C40F")
                .setTitle("Ops, parece que houve algum erro ao tentar apagar os dados de **" + dMember.user.username + "**!"));
            console.log(err);
        }
    }
    // Gerador de código HEX para cor
    function RandomColor() {
        function c() {
            var hex = Math.floor(Math.random() * 256).toString(16);
            return (String(hex)).substr(-2);
        }
        return "#" + c() + c() + c();
    }
});
// Login
client.login(process.env.TOKEN);
// FIM DO SCRIPT
