// Ping Glitch.com
const http = require("http");
const express = require("express");
const app = express();
app.get("/", (request, response) =>
{
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() =>
{
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

// BaseNode
var fs = require(`fs`);
var jSelfReloadJSON = require(`self-reload-json`);

// Web Scrapping
var rp = require(`request-promise`);
var jCheerio = require(`cheerio`);

// DiscordJS
var Discord = require(`discord.js`);
var client = new Discord.Client();
var prefix = `!`;

// Arquivos Gerais
var BotSentences = require(`./data/botsentences.json`);
var tokens = require(`./data/tokens.json`);

// Método de inicialização, ponto vital do bot
client.on(`ready`, () =>
{
    console.log(`HunterHelper está no ar!`);
    client.user.setActivity(`os caçadores`,
    {
        type: `LISTENING`
    });
});

client.on(`guildMemberAdd`, member =>
{
    var no_role = member.guild.roles.find(r => r.name === `Caçador sem licença`);
    var boasVindas = member.guild.channels.find(ch => ch.name === `boas-vindas`);
    var salaComandos = member.guild.channels.find(ch => ch.name === `comandos`);
    if (!boasVindas) return;
    boasVindas.send(
        new Discord.RichEmbed()
        .setTitle(`Seja bem vindo ao servidor, ${member.user.username}!`)
        .setDescription(
            `Vá para ${salaComandos} e utilize o comando !r seguido de seu nickname no theHunter para adquirir o seu HUNTER ID CARD!\nQualquer duvida digite !r ?`
        )
        .setThumbnail(member.user.avatarURL)
        .setColor(`#FFFFFF`)
    );
    member.addRole(no_role);
});

client.on(`guildMemberRemove`, member =>
{
    var boasVindas = member.guild.channels.find(ch => ch.name === `boas-vindas`);
    if (!boasVindas) return;
    boasVindas.send(
        new Discord.RichEmbed()
        .setTitle(`Ei ${member.user.username}, está na escuta...?!`)
        .setDescription(
            `Parece que perdemos o contato com este caçador, seu HUNTER ID foi abandonado no server... Sentiremos sua falta!`
        )
        .setThumbnail(member.user.avatarURL)
        .setColor(`#E84C3D`)
    );
});

// Método de ativar o bot ao receber uma mensagem
client.on(`message`, message =>
{

    // Verifica se é bot
    var BOT = message.author.bot
    if (BOT) return;

    // Fica por dentro do horário
    var Hoje = new Date();
    var Data = `${Hoje.getFullYear()}/${Hoje.getMonth() + 1}/${Hoje.getDate()}`;
    var Tempo = `${Hoje.getHours()}:${Hoje.getMinutes()}:${Hoje.getSeconds()}`;
    var DataTempo = `${Data} ${Tempo}`;

    // Verifica se o membro não tem licença, se 1, então retira caso esteja alinhado com o registro
    var no_role = message.guild.roles.find(r => r.name === `Caçador sem licença`);
    if (!fs.existsSync(`./perfis/registrados/${message.author.id}.json`))
    {
        message.member.setRoles([no_role]).catch(console.error);
    }

    // Atualiza o perfil do usuário 1 vez por dia
    if (fs.existsSync(`./perfis/registrados/${message.author.id}.json`))
    {
        var JSONCheck = new jSelfReloadJSON(
            `./perfis/registrados/${message.author.id}.json`
        );
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;
        var hHora = new Date();
        var Horas = hHora.getHours();
        var Hour = pView.LASTUP;

        if (Horas != Hour)
        {
            //console.log(`Hora de atualizar o perfil de ${message.author.username}(${message.author.id})`)
            JSONCheck.stop();
            updatePlayerInfo(message.author.id);
        }
    }

    if (
        commands.hasOwnProperty(
            message.content
            .toLowerCase()
            .slice(tokens.prefix.length)
            .split(` `)[0]
        )
    )
        commands[
            message.content
            .toLowerCase()
            .slice(tokens.prefix.length)
            .split(` `)[0]
        ](message);

    // Aceitar mensagens apenas enviadas nos seguintes chats e verifica a sala de comandos
    var cChannel = message.guild.channels.find(ch => ch.name === `comandos`);
    var chChannel = message.guild.channels.find(ch => ch.name === `chat`);
    var logChannel = message.guild.channels.find(ch => ch.name === `changelog`);
    var fChannel = message.guild.channels.find(ch => ch.name === `fotos`);

    if (message.author.username === "RCPOLSKI")
    {
        cChannel = message.channel;
        chChannel = message.channel;
        fChannel = message.channel;
        testeChannel = message.channel;
    }

    var isOK = 0;
    var isRegistered = 0;

    if (
        message.channel === chChannel &&
        message.attachments.size >= 1 &&
        message.author.username !== `RCPOLSKI`
    )
    {
        var JSONCheck = new jSelfReloadJSON(
            `./perfis/registrados/${message.author.id}.json`
        );
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;

        message.delete(100);
        chChannel.send(
            new Discord.RichEmbed()
            .setColor(`#E84C3D`)
            .setTitle(
                `Ei ${pView.NICKNAME}, este chat é destinado apenas à conversas...`
            )
            .setDescription(
                `Para postar fotos, vá para ${fChannel} e para me dar comandos, vá para ${cChannel}`
            )
        );
        return;
    }
    else if (
        message.channel === fChannel &&
        message.attachments.size <= 0 &&
        message.author.username !== `RCPOLSKI`
    )
    {
        var JSONCheck = new jSelfReloadJSON(
            `./perfis/registrados/${message.author.id}.json`
        );
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;

        message.delete(100);
        fChannel.send(
            new Discord.RichEmbed()
            .setColor(`#E84C3D`)
            .setTitle(
                `Ei ${pView.NICKNAME}, este chat é destinado apenas à postagem de fotos...`
            )
            .setDescription(
                `Para conversar, vá para ${chChannel} e para me dar comandos, vá para ${cChannel}`
            )
        );
        return;
    }

    if (message.channel !== cChannel && message.author.username === `RCPOLSKI`)
    {
        isOK = 1;
    }

    if (message.channel === cChannel && message.content.startsWith(prefix))
    {
        isOK = 1;
    }

    if (
        message.channel === cChannel &&
        !message.content.startsWith(prefix) &&
        message.author.username === `RCPOLSKI`
    )
    {
        isOK = 1;
    }
    else if (
        message.channel === cChannel &&
        !message.content.startsWith(prefix) &&
        message.author.username !== `RCPOLSKI`
    )
    {
        message.delete(100);
        console.log(
            `${message.author.username}(${message.author.id}) tentou falar na sala #comandos...`
        );
        cChannel.send(
            new Discord.RichEmbed()
            .setTitle(`Ei, este chat é destinado apenas aos comandos...`)
            .setDescription(`Para conversas, utilize o ${chChannel}`)
            .setColor(`#E84C3D`)
        );
    }

    if (message.content.startsWith(prefix) && isOK === 0)
    {
        message.channel.send(
            new Discord.RichEmbed()
            .setColor(`#E84C3D`)
            .setTitle(
                `Ei, para interagir comigo preciso que seja no canal correto!`
            )
            .setDescription(`Para me dar comandos, utilize o ${cChannel}`)
        );
        return;
    }

    var laArgs = message.content.slice(prefix.length).split(` `);
    var elCommand = laArgs.shift().toLowerCase();
    var matchCommand = elCommand.match(/\bcomandos|\breservas|\bsobre|\bid|\bme|\bp|\br|\bm/g);

    if (
        message.content.startsWith(prefix) &&
        !matchCommand &&
        message.author.username !== `RCPOLSKI`
    )
    {
        message.delete(100);
        cChannel.send(
            new Discord.RichEmbed()
            .setTitle(`Ei, este chat é destinado apenas aos comandos...`)
            .setDescription(`Para conversas, utilize o ${chChannel}`)
            .setColor(`#E84C3D`)
        );
        showCommands();
        return;
    }

    if (message.content.startsWith(prefix) && isOK === 1)
    {
        // Assets
        const sh_emoji = client.emojis.find(emoji => emoji.name === `shoe`);
        const gr_emoji = client.emojis.find(emoji => emoji.name === `grave`);
        const ds_emoji = client.emojis.find(emoji => emoji.name === `distance`);
        const bn_emoji = client.emojis.find(emoji => emoji.name === `binoculars`);
        const hs_emoji = client.emojis.find(emoji => emoji.name === `hs`);
        const rk_emoji = client.emojis.find(emoji => emoji.name === `rank`);
        const cs_emoji = client.emojis.find(emoji => emoji.name === `cssmedio`);
        const ps_emoji = client.emojis.find(emoji => emoji.name === `precision`);
        const tm_emoji = client.emojis.find(emoji => emoji.name === `timer`);
        const an_emoji = client.emojis.find(emoji => emoji.name === `animals`);
        const dt_emoji = client.emojis.find(emoji => emoji.name === `death`);
        const ex_emoji = client.emojis.find(emoji => emoji.name === `exclusive`);
        const lc_emoji = client.emojis.find(emoji => emoji.name === `local`);
        const se_emoji = client.emojis.find(emoji => emoji.name === `season`);
        const si_emoji = client.emojis.find(emoji => emoji.name === `size`);
        const ms_emoji = client.emojis.find(emoji => emoji.name === `mushroom`);
        const mg_emoji = client.emojis.find(emoji => emoji.name === `magglass`);
        const tr_emoji = client.emojis.find(emoji => emoji.name === `trophy`);
        const fr_emoji = client.emojis.find(emoji => emoji.name === `friend`);

        // Definindo variáveis e argumentos
        var autorUsername = message.author.username; // Username do usuário
        var p = autorUsername.toLowerCase();
        var BOT = message.author.bot; // Checa se é bot
        var autorTag = message.author.tag; // TAG do usuário
        var autorID = message.author.id; // ID do usuário
        var autorAvatarURL = message.author.avatarURL; // Link do avatar do Usuário
        var autorNickname = message.member.nickname; // Apelido do usuário
        var args = message.content.slice(prefix.length).split(` `);
        var comando = args.shift().toLowerCase();
        var mRead = message.content.split(` `);
        var mReadCont = mRead[1];
        var cardRequested = 0;
        var isAdmR = 0;
        var isBulkUpdate = 0;

        function delMsg()
        {
            try
            {
                async function DeleteMyMessage()
                {
                    var fetchedMsg = message.author.lastMessageID;
                    fetchedMsg.delete(10);
                    const fetched = await message.channel.fetchMessages(
                    {
                        limit: 1
                    });
                    message.channel.bulkDelete(fetched);
                }
                DeleteMyMessage();
            }
            catch (err) {}
        }

        var isIdle = 0;
        var aDescription = ``;
        if (comando === `idle` && message.author.username === `RCPOLSKI`)
        {
            if (!args.length)
            {
                args[0] = 1;
            }
            message.delete(100);
            fs.writeFileSync(
                `./status/idling.txt`,
                "Since the beggining of everything..."
            );
            console.log(`O bot está em modo idle agora...`);
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `Estou entrando em modo de atualização. Não estarei apto a responder seus comandos por até **${
              args[0]
            }** hora(s)`
                )
                .setColor(`#E84C3D`)
            );
            client.user.setStatus(`idle`);
            client.user.setActivity(`novas instruções`,
            {
                type: `LISTENING`
            });
        }
        else if (comando === `awake` && message.author.username === `RCPOLSKI`)
        {
            if (!args.length)
            {
                aDescription = `Apenas algumas correções...`;
            }
            if (args[0] === `patch`)
            {
                aDescription = `Patch sob demanda! Parece que me deram super poderes... Confira em ${logChannel}`;
            }
            if (args[0] === `update`)
            {
                aDescription = `Conteúdo novo área! Confira os detalhes em ${logChannel}`;
            }
            message.delete(100);
            if (!fs.existsSync(`./status/idling.txt`))
            {
                return;
            }
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(`Estou operante novamente!`)
                .setDescription(aDescription)
                .setColor(`#2DCC70`)
            );
            fs.unlinkSync(`./status/idling.txt`);
            console.log(`O bot saiu do modo idle...`);
            client.user.setStatus(`online`);
            client.user.setActivity(`os caçadores`,
            {
                type: `LISTENING`
            });
        }

        if (
            fs.existsSync(`./status/idling.txt`) &&
            message.author.username !== `RCPOLSKI`
        )
        {
            message.delete(100);
            return;
        }

        if (comando === `!` && autorUsername === `RCPOLSKI`)
        {
            var no_role = message.guild.roles.find(
                a => a.name === `Caçador sem licença`
            );
            var in_role = message.guild.roles.find(
                b => b.name === `Nivel Iniciante 0 - 300`
            );
            var az_role = message.guild.roles.find(
                c => c.name === `Nivel Aprendiz  300+`
            );
            var am_role = message.guild.roles.find(
                d => d.name === `Nivel Amador 900+`
            );
            var cd_role = message.guild.roles.find(
                e => e.name === `Nivel Caçador 1800+`
            );
            var it_role = message.guild.roles.find(
                f => f.name === `Nivel Instrutor 3000+`
            );
            var gu_role = message.guild.roles.find(
                g => g.name === `Nivel Guia 5000+`
            );
            var ep_role = message.guild.roles.find(
                h => h.name === `Nivel Épico 7500+`
            );
            var ld_role = message.guild.roles.find(
                i => i.name === `Nível Lendário 10.000+`
            );
            var mt_role = message.guild.roles.find(
                j => j.name === `Nível Mítico 25.000+`
            );
            var ex_role = message.guild.roles.find(
                k => k.name === `Nivel Extraordinário 50.000+`
            );
            var ec_role = message.guild.roles.find(
                l => l.name === `Nivel Embaixador de Caça 100.000+`
            );

            /*  message.channel.send(new Discord.RichEmbed()    
                              .setTitle(cd_role)
                              .setDescription(cd_role)
                              .setFooter(cd_role)
                              .addField(cd_role, cd_role)) */

            //message.channel.send(`Iniciando teste de cargos a pedido do administrador...\n\nChave de acesso: **40dc917a839feb2fa0fc0085233**\nAdmin Instance: **RCPOLSKI**\n\n**CARGOS**\n\n${no_role}\n${in_role}\n${az_role}\n${am_role}\n${cd_role}\n${it_role}\n${gu_role}\n${ep_role}\n${ld_role}\n${mt_role}\n${ex_role}\n${ec_role}`)
            //message.member.addRole(ADM_ROLE)

            try
            {
                (async () =>
                {
                    var PlayerLink = `https://www.uhcapps.co.uk/stats_lifetime.php?username=${
            args[0]
          }`; // Source do Scrapper
                    const response = await rp(PlayerLink);
                    const $ = jCheerio.load(response);
                    var THPrecision = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.small`
                    ).text();
                    var CalcPrecision = THPrecision.match(/[0-9.]+(?:\.[0-9.]+|)/g);
                    var Precision = 100 - CalcPrecision;
                    if (Precision % 1 > 0.5)
                    {
                        Precision + 1;
                        console.log("remainder is greater than 0.5");
                    }
                    else
                    {
                        console.log("remainder is lower than 0.5");
                    }
                    message.channel.send(
                        `Valor Bruto: ${THPrecision}\nValor Filtrado: ${CalcPrecision}\nValor Decimal: ${Precision}\nValor Final: ${Precision.toPrecision(
              2
            )}`
                    );
                })();
            }
            catch (err) {}
            message.delete(10);
            return;
        }

        if (comando === `admr` && autorUsername !== `RCPOLSKI`)
        {
            return;
        }
        else if (
            comando === `admr` &&
            !args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            console.log(`Cadê o username RC????`);
        }
        else if (
            comando === `admr` &&
            args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            isAdmR = 1;
            var rMember = message.mentions.members.first();
            registerUser();
            message.delete(100);
        }

        if (comando === `upr` && autorUsername !== `RCPOLSKI`)
        {
            return;
        }
        else if (
            comando === `upr` &&
            !args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            console.log(`Cadê o username RC????`);
        }
        else if (
            comando === `upr` &&
            args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            isAdmR = 1;
            var uMember = message.mentions.members.first();
            updatePlayerInfo(uMember);
            message.delete(100);
        }

        if (comando === `uprall` && autorUsername !== `RCPOLSKI`)
        {
            return;
        }
        else if (comando === `uprall` && autorUsername === `RCPOLSKI`)
        {
            const memberList = client.guilds.get("565537368224825344");
            var tMembers = memberList.members;
            message.delete(100);
            memberList.members.forEach(member =>
                message.channel.send(`${member.user.username} (${member.user.id})`)
            );
        }

        if (comando === `delr` && autorUsername !== `RCPOLSKI`)
        {
            return;
        }
        else if (
            comando === `delr` &&
            !args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            console.log(`Cadê o username RC????`);
        }
        else if (
            comando === `delr` &&
            args.length &&
            autorUsername === `RCPOLSKI`
        )
        {
            var dMember = message.mentions.members.first();
            delPlayerInfo();
            message.delete(100);
        }

        var minUser = message.author.username;
        minUser.toLowerCase();

        // Registro de usuário
        if (
            comando === `r` &&
            fs.existsSync(`./perfis/registrados/${message.author.id}.json`)
        )
        {
            cChannel
                .send(
                    new Discord.RichEmbed()
                    .setColor(`#E84C3D`)
                    .setTitle(`Ei ${pView.NICKNAME}, você já está registrado!`)
                    .setDescription(
                        `Esse comando é apenas para novos membros, portanto, mostrarei seu perfil!`
                    )
                )
                .then(msg =>
                {
                    setTimeout(function()
                    {
                        msg.delete();
                    }, 5000);
                });
            var alRegisteredRequest = 1;
            profileSearch();
        }
        else if (comando === `r` && args.length >= 2)
        {
            cChannel.send(
                new Discord.RichEmbed()
                .setColor(`#E84C3D`)
                .setTitle(`Campeão, você tem certeza que esse é o seu nick no jogo?`)
                .setDescription(`Seu nickname contém carácteres não permitidos!`)
            );
            return;
        }
        else if (comando === `r` && args[0] === minUser)
        {
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `Ei ${message.author.username}, o cadastro é com o seu nickname no JOGO e não o do discord`
                )
                .setDescription(`Exemplo\n!r RCPOLSKI ou !r HooCairs`)
                .setColor(`#E84C3D`)
            );
            console.log(
                `[${DataTempo}] ${autorUsername} tentou se registrar e usou o username do discord...`
            );
            return;
        }
        else if (comando === `r` && args[0] === `?`)
        {
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `Para se registrar, basta inserir o seu nickname após o comando !r`
                )
                .setDescription(`Exemplo\n!r RCPOLSKI`)
                .setColor(`#2DCC70`)
            );
            console.log(
                `[${DataTempo}] ${autorUsername} requisitou informações sobre o comando !r...`
            );
            return;
        }
        else if (comando === `r` && args.length)
        {
            registerUser();
        }

        if (
            comando !== `r` &&
            !fs.existsSync(`./perfis/registrados/${message.author.id}.json`)
        )
        {
            isRegistered = 0;
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `Ei, ${autorUsername}!\nPara que eu possa atender aos seus pedidos, você precisa se registrar utilizando o comando !r seguido de seu nickname no TheHunter`
                )
                .setDescription(`Exemplo\n!r RCPOLSKI`)
                .setColor(`#F1C40F`)
            );
            console.log(
                `[${DataTempo}] ${autorUsername} tentou falar sem permissões...`
            );
            return;
        }

        if (comando === `id` && !args.length)
        {
            pView = require(`./perfis/registrados/${message.author.id}.json`);
            cardRequested = 1;
            cChannel.send(
                new Discord.RichEmbed()
                .setColor(`#F1C40F`)
                .setTitle(
                    `Estou indo buscar sua identificação ${pView.NICKNAME}, aguarde só um pouquinho!`
                )
            );
            updatePlayerInfo(message.author.id);
        }
        else if (comando === `id` && args.length)
        {
            return; //DESATIVAR PARA VALER COMANDO
        }

        if (fs.existsSync(`./perfis/registrados/${autorID}.json`))
        {
            isRegistered = 1;
        }
        if (isRegistered === 0)
        {
            return;
        }

        var JSONCheck = new jSelfReloadJSON(
            `./perfis/registrados/${message.author.id}.json`
        );
        JSONCheck.resume();
        JSONCheck.forceUpdate();
        JSONCheck.stop();
        var pView = JSONCheck;

        // Comando para procurar e ver o perfil do nickname provido
        if (comando === `p` && args.length)
        {
            profileSearch();
        }
        else if (comando === `p` && !args.length)
        {
            console.log(
                `[${DataTempo}] ${pView.NICKNAME} iniciou uma requisição de perfil, porém esqueceu de indicar o nickname`
            );
            cChannel.send(
                new Discord.RichEmbed()
                .setColor(`#E84C3D`)
                .setTitle(`Perfil de quem, ${pView.NICKNAME}?`)
                .setDescription(
                    `Por favor, inclua o nickname do jogador após o comando...`
                )
            );
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(`!p RCPOLSKI`)
                .setDescription(
                    `O bot não é case sensitive, ou seja, não é preciso diferenciar as maiúsculas das minúsculas`
                )
                .setColor(`#F1C40F`)
            );
        }

        // Comando para pesquisar o próprio perfil
        if (comando === `me`)
        {
            args[0] = pView.NICKNAME;
            mReadCont = pView.NICKNAME;
            var isMeRequest = 1;
            profileSearch();
            updatePlayerInfo(message.author.id);
        }

        // Comando para pesquisar mapas
        if (comando === `m` && args[0] === `?`)
        {
            message.delete(100);
            showReserves();
        }
        else if (comando === `m` && args.length)
        {
            try
            {
                var argslow = args[0].toLowerCase();
                var rNow = JSON.parse(
                    fs.readFileSync("./gameContent/reservas.json", "utf8")
                );
                var rData = rNow[argslow];

                if (!rData)
                {
                    cChannel.send(
                        new Discord.RichEmbed()
                        .setTitle(
                            `Ops, parece que estamos com problemas aqui... Veja se o nome do mapa que procura está correto!`
                        )
                        .setDescription(`Digite !reservas para saber mais`)
                        .setColor(`#E84C3D`)
                    );
                    console.log(
                        `[${DataTempo}] ${pView.NICKNAME} requisitou as informações de ${
              args[0]
            }, mas não obteve sucesso...`
                    );
                    return;
                }

                cChannel.send(
                    new Discord.RichEmbed()
                    .setTitle(rData.Nome)
                    .setColor(rData.Cor)
                    .setDescription(rData.Descricao)
                    .setThumbnail(rData.MapaIcone)
                    .setImage(rData.MapaAnimais)
                    .addBlankField()
                    .addField(`${lc_emoji}  Local`, rData.Local, true)
                    .addField(`${se_emoji}  Estação`, rData.Estacao, true)
                    .addField(`${ex_emoji}  Animais exclusivos`, rData.Exclusivo, true)
                    .addField(`${si_emoji}  Tamanho (km²)`, rData.KMQ, true)
                    .addField(`${si_emoji}  Tamanho (Acres)`, rData.Acres, true)
                    .addBlankField()
                    .addField(`${an_emoji}  Animais`, rData.AnimaisNaReserva, true)
                    .addField(`${dt_emoji}  Eventuais mortes`, rData.Mortes, true)
                    .setFooter(
                        `Requisitado por ${pView.NICKNAME}. Para ver o nome das reservas, digite !reservas`
                    )
                );
                message.delete(100);
                console.log(
                    `[${DataTempo}] ${pView.NICKNAME} requisitou as informações de ${rData.Nome}`
                );
            }
            catch (err)
            {
                console.log(
                    `[${DataTempo}] ${pView.NICKNAME} requisitou as informações de ${
            args[0]
          }, mas não obteve sucesso...`
                );
                console.log(err);
                cChannel.send(
                    new Discord.RichEmbed()
                    .setColor(`#E84C3D`)
                    .setTitle(`Não consegui encontrar nada sobre essa reserva!`)
                    .setDescription(
                        `Ficou sabendo de alguma atualização ou só errou a tecla ao digitar o nome? De uma verificada!`
                    )
                );
            }
        }
        else if (comando === `m` && !args.length)
        {
            console.log(
                `[${DataTempo}] ${pView.NICKNAME} iniciou a requisição de informações de reserva, mas esqueceu de indicar qual...`
            );
            cChannel.send(
                new Discord.RichEmbed()
                .setColor(`#E84C3D`)
                .setTitle(
                    `Por favor, digite o primeiro nome da reserva o qual está tentando ver`
                )
            );
            showReserves();
            return;
        }

        if (comando === `reservas`)
        {
            console.log(
                `[${DataTempo}] ${pView.NICKNAME} requisitou as informações das reservas`
            );
            message.delete(100);
            showReserves();
        }

        if (comando === `sobre`)
        {
            message.delete(100);
            console.log(
                `[${DataTempo}] ${pView.NICKNAME} requisitou as informações do BOT`
            );
            cChannel.send(
                `Olá, meu nome é Guia!\nSou um bot assistente criado pelo RCPOLSKI para ajudar-los em dúvidas e curiosidades sobre o TheHunter Classic!\n\nNote que ainda estou em fase de testes e posso apresentar desmaios, tonturas e DC expotâneo.\nFeedback e duvidas, contatar @RCPOLSKI`
            );
        }

        if (comando === `comandos`)
        {
            message.delete(100);
            console.log(
                `[${DataTempo}] ${pView.NICKNAME} requisitou as informações de comandos`
            );
            showCommands();
        }

        // Desliga o bot pelo chat
        if (comando === `shutdown` && autorUsername === `RCPOLSKI`)
        {
            console.log(`[${DataTempo}] Bot Desligado`);
            message.delete(10);
            message.channel.send(BotSentences.adminEvents.onShutdown);
            client.destroy();
        }
        else if (comando === `shutdown` && autorUsername !== `RCPOLSKI`)
        {
            message.delete(100);
            message.channel.send(
                new Discord.RichEmbed()
                .setColor(`#E84C3D`)
                .setTitle(`${BotSentences.adminEvents.onLackOfPermissions}`)
                .setDescription(
                    `Para ver os comandos disponíveis, utilize **!comandos** em ${cChannel}`
                )
            );
            return;
        }

        // Limpa a quantidade de mensagens indicadas
        if (comando === `cls` && autorUsername === `RCPOLSKI`)
        {
            if (!args[0])
            {
                args[0] = 2;
            }
            try
            {
                async function clear()
                {
                    message.delete(10);
                    const fetched = await message.channel.fetchMessages(
                    {
                        limit: args[0]
                    });
                    message.channel.bulkDelete(fetched);
                }
                clear();
            }
            catch (err)
            {
                console.log(err);
                return;
            }
        }
        else if (comando === `cls` && autorUsername !== `RCPOLSKI`)
        {
            console.log(
                `[${DataTempo}] ${autorUsername} tentou apagar as mensagens com o comandos !cls`
            );
            message.delete(100);
            message.channel.send(
                new Discord.RichEmbed()
                .setColor(`#E84C3D`)
                .setTitle(`${BotSentences.adminEvents.onLackOfPermissions}`)
                .setDescription(
                    `Para ver os comandos disponíveis, utilize **!comandos** em ${cChannel}`
                )
            );
            return;
        }

        if (comando === `rm` && autorUsername === `RCPOLSKI`)
        {
            message.delete(10);
            message.channel.send(message.content.replace(`!rm`, ``));
        }

        if (comando === `rb` && autorUsername === `RCPOLSKI`)
        {
            message.delete(10);
            message.channel.send(
                new Discord.RichEmbed()
                .setColor(RandomColor())
                .setDescription(message.content.replace(`!rb`, ``))
            );
        }

        if (comando === `update` && autorUsername === `RCPOLSKI`)
        {
            message.delete(100);
            message.channel.send(
                new Discord.RichEmbed()
                .setTitle(`Hotfix 1.2f`)
                .setThumbnail(client.user.avatarURL)
                .setColor(`#F1C40F`)
                .setDescription(
                    `Esta atualização marca a volta do Hunter Helper e correções de bugs`
                )
                .addBlankField()
                .addField(
                    `A volta do HunterHelper`,
                    `O HH nasceu há alguns meses, se tornando o primeiro e único bot para o theHunter: Classic do mundo!\nSua recepção fora única e surpreendente, atraiu pessoas que se interessaram por suas funções e até mesmo recebeu proposta de uso comercial.\nPorém, devido a falta de tempo para manter novas updates e correções, também dada a baixa movimentação do server, o HH teve seu núcleo desligado... No mesmo, não há porque se preocupar, a database passou por um backup antes disto e portanto, volta a ser funcional sem a necessidade de recadastramento!`
                )
                .addBlankField()
                .addField(
                    `Correções`,
                    `- Ajustado o arredondamento de precisão, que agora agrega +1 ao valor caso esteja acima de *.5\n- Melhorado o reconhecimento de singularidade e pluraridade\n- Corrigido crash ao requisitar perfil pelo !me e não receber feedback do comando\n- Corrigido a distinção de requisição para nominação de pacotes\n- Removido BanCheck (Agora perfis tem backup total, mesmo após ter sua conta apagada)\n- Corrigido o dailyTimer na atualização de perfís\n- Corrigido erros de digitação`
                )
                .addBlankField()
                .setFooter(
                    `Fique ligado para novas atualizações, qualquer dúvida, contatar ${message.author.username}`
                )
                .setTimestamp()
            );
        }

        function profileSearch()
        {
            var lookoutMember = `${tm_emoji}  Um momento ${
        pView.NICKNAME
      }! Estou dando uma verificada no perfil de ${args[0]}!`;

            if (alRegisteredRequest === 1)
            {
                args[0] = pView.NICKNAME;
                mReadCont = pView.NICKNAME;
                lookoutMember = `${tm_emoji}  Um momento ${pView.NICKNAME}! Estou dando uma verificada no seu perfil!`;
            }

            if (isMeRequest === 1)
            {
                var pOrMe = `!me de ${pView.NICKNAME}`;
                lookoutMember = `${tm_emoji}  Um momento ${pView.NICKNAME}! Estou dando uma verificada no seu perfil!`;
            }

            var checkMinUser = pView.NICKNAME;
            checkMinUser.toLowerCase();

            if (args[0] === checkMinUser)
            {
                lookoutMember = `${tm_emoji}  Um momento ${pView.NICKNAME}! Estou dando uma verificada no seu perfil!`;
            }

            console.log(
                `[${DataTempo}] ${
          pView.NICKNAME
        } requisitou a verificação de perfil de ${args[0]}`
            );
            cChannel
                .send(
                    new Discord.RichEmbed()
                    .setColor(`#F1C40F`)
                    .setTitle(`${lookoutMember}`)
                    .setDescription(
                        `Por favor, aguarde... Isso pode levar até 10 segundos!`
                    )
                )
                .then(msg =>
                {
                    if (args[0] === checkMinUser)
                    {
                        setTimeout(function()
                        {
                            msg.edit(
                                new Discord.RichEmbed()
                                .setColor(`#2DCC70`)
                                .setTitle(
                                    `Você sabia que é possível pesquisar seu próprio perfil usando o comando **!me**`
                                )
                                .setDescription(
                                    `Por favor, aguarde... Isso pode levar até 10 segundos!`
                                )
                            );
                        }, 1000);
                    }
                });

            try
            {
                (async () =>
                {
                    var PlayerLink = `https://www.uhcapps.co.uk/stats_lifetime.php?username=${
            args[0]
          }`; // Source do Scrapper
                    const response = await rp(PlayerLink);
                    const $ = jCheerio.load(response);
                    var URLPerfil = `https://www.thehunter.com/#profile/${mReadCont}`;
                    var pOrMe = `Perfil requisitado por ${pView.NICKNAME}`;

                    var THPrecision = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.small`
                    ).text();
                    var THLongShot = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(25) > tbody > tr:nth-child(1) > td:nth-child(2) > span.main > strong`
                    ).text();
                    var THRank = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(5) > span.heading`
                    ).text();
                    var THCss = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(7) > span.heading`
                    ).text();
                    var THAvatar = $(
                        `#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img`
                    ).attr(`src`);
                    var THHunterScoreString = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading`
                    ).text();
                    var THMinShot = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(25) > tbody > tr:nth-child(1) > td:nth-child(4) > strong`
                    ).text();
                    var THHarvested = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(2) > span.main > strong`
                    ).text();
                    var THSpotted = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(6) > span.main > strong`
                    ).text();
                    var THShots = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(2) > span.main > strong`
                    ).text();
                    var THTracked = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(37) > tbody > tr > td:nth-child(4) > span.main > strong`
                    ).text();
                    var THTime = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(10) > tbody > tr > td:nth-child(2) > span.main > strong`
                    ).text();
                    var THWalk = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(10) > tbody > tr > td:nth-child(4) > span.main > strong`
                    ).text();
                    var THMushroom = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(13) > tbody > tr > td:nth-child(4) > span.main > strong`
                    ).text();
                    var THFriend = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(16) > tbody > tr > td:nth-child(4) > span.main > strong`
                    ).text();
                    var THTrophy = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(4) > td > table:nth-child(16) > tbody > tr > td:nth-child(2) > span.main > strong`
                    ).text();
                    var THNickname = $(`#user-profile-url`).text();

                    var THHunterScore = parseInt(THHunterScoreString);
                    if (THHunterScoreString === ``)
                    {
                        console.log(
                            `[${DataTempo}] ${
                pView.NICKNAME
              } requisitou a verificação de perfil de ${
                args[0]
              }, mas não obteve sucesso...`
                        );
                        cChannel.send(
                            new Discord.RichEmbed()
                            .setColor(`#E84C3D`)
                            .setTitle(
                                `Eita, parece que o nickname fornecido não existe na database do jogo... Tenha certeza que você o escreveu corretamente`
                            )
                        );
                        return;
                    }
                    else
                    {
                        var PlayTime = THTime.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                        var Shots = THShots.match(/[a-z]+|[0-9,]+(?:\.[0-9,]+|)/g);
                        var CalcPrecision = THPrecision.match(/[0-9.]+(?:\.[0-9.]+|)/g);
                        var Walked = THWalk.match(/[a-z]+|[0-9,]+(?:\.[0-9,]+|)/g);
                        var Mushroom = THMushroom.match(/[a-z]+|[0-9.,]+(?:\.[0-9.,]+|)/g);
                        var LongShot = THLongShot.match(/[a-z]+|[0-9.]+(?:\.[0-9.]+|)/g);
                        var MinShot = THMinShot.match(/[a-z]+|[0-9.]+(?:\.[0-9.]+|)/g);
                        var Friend = THFriend.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                        var Trophy = THTrophy.match(/[a-z]+|[0-9]+(?:\.[0-9]+|)/g);
                        var ign = THNickname.match(
                            /[a-zA-Z,.-_]+|[0-9.,-_]+(?:\.[0-9.,-_]+|)/g
                        );

                        var Precision = 100 - CalcPrecision;
                        if (Precision % 1 > 0.5)
                        {
                            Precision + 1;
                        }

                        if (LongShot === null)
                        {
                            delMsg();
                            cChannel.send(
                                new Discord.RichEmbed()
                                .setColor(`#E84C3D`)
                                .setTitle(
                                    `Ei ${pView.NICKNAME}, o usuário **${args}** não existe ou você escreveu o nick errado...`
                                )
                                .setDescription(`Portanto não há o que se ver por aqui!`)
                            );
                            return;
                        }

                        // Define o título do jogador
                        if (ign[1] === `membership_type_hunter`)
                        {
                            ign[1] = `Caçador Licenciado`;
                        }
                        else if (ign[1] === `Duck`)
                        {
                            ign[1] = `Caçador de Patos`;
                        }
                        else if (ign[1] === `Contributor`)
                        {
                            ign[1] = `Contribuínte`;
                        }
                        else if (ign[1] === `Staff`)
                        {
                            ign[1] = `Funcionário da EW`;
                        }
                        else if (ign[1] === `Journeyman`)
                        {
                            ign[1] = `Viajante`;
                        }

                        // Define a cor da caixa do usuário pela sua pontuação
                        var pColor = `#FFFFFF`;
                        if (THHunterScore <= 299)
                        {
                            pColor = `#E6E6E6`;
                        }
                        else if (THHunterScore >= 300 && THHunterScore <= 899)
                        {
                            pColor = `#2DCC70`;
                        }
                        else if (THHunterScore >= 900 && THHunterScore <= 1799)
                        {
                            pColor = `#8C44CC`;
                        }
                        else if (THHunterScore >= 1800 && THHunterScore <= 2999)
                        {
                            pColor = `#E84C3D`;
                        }
                        else if (THHunterScore >= 3000 && THHunterScore <= 4999)
                        {
                            pColor = `#C5F181`;
                        }
                        else if (THHunterScore >= 5000 && THHunterScore <= 7499)
                        {
                            pColor = `#3598DB`;
                        }
                        else if (THHunterScore >= 7500 && THHunterScore <= 9999)
                        {
                            pColor = `#F35CAC`;
                        }
                        else if (THHunterScore >= 10000 && THHunterScore <= 24999)
                        {
                            pColor = `#E67F22`;
                        }
                        else if (THHunterScore >= 25000 && THHunterScore <= 49999)
                        {
                            pColor = `#65CCCC`;
                        }
                        else if (THHunterScore >= 50000 && THHunterScore <= 99999)
                        {
                            pColor = `#FD1BF7`;
                        }
                        else if (THHunterScore >= 100000)
                        {
                            pColor = `#F1C40F`;
                        }

                        delMsg();
                        let PTDays = `dia`;
                        let PTHours = `hora`;
                        let PTMinutes = `minuto`;
                        if (PlayTime[0] > 1)
                        {
                            PTDays = `dias`;
                        }
                        if (PlayTime[2] > 1)
                        {
                            PTHours = `horas`;
                        }
                        if (PlayTime[4] > 1)
                        {
                            PTMinutes = `minutos`;
                        }

                        cChannel.send(
                            new Discord.RichEmbed()
                            .setColor(pColor)
                            .setAuthor(
                                `Clique aqui para ir ao perfil deste jogador`,
                                ``,
                                URLPerfil
                            )
                            .setTitle(`Você está vendo o perfil de ${ign[0]}`)
                            .setDescription(`Este jogador é um ${ign[1]}`)
                            .addBlankField()
                            .setThumbnail(THAvatar)
                            .addField(
                                `${hs_emoji}  **${THHunterScore}**`,
                                `Pontuação de caçador`,
                                true
                            )
                            .addField(`${rk_emoji}  **${THRank}**`, `Rank Global`, true)
                            .addBlankField()
                            .addField(
                                `${ds_emoji}  **${LongShot[0]}**m`,
                                `Abate mais longo`,
                                true
                            )
                            .addField(
                                `${ds_emoji}  **${MinShot[0]}**m`,
                                `Abate mais perto`,
                                true
                            )
                            .addBlankField()
                            .addField(
                                `${gr_emoji}  **${THHarvested}**`,
                                `Animais recolhidos`,
                                true
                            )
                            .addField(
                                `${mg_emoji}  **${THTracked}**`,
                                `Animais rastreados`,
                                true
                            )
                            .addField(
                                `${bn_emoji}  **${THSpotted}**`,
                                `Animais focalizados`,
                                true
                            )
                            .addField(
                                `${cs_emoji}  **${THCss}**`,
                                `Média de CSS por abate`,
                                true
                            )
                            .addBlankField()
                            .addField(
                                `${sh_emoji}  **${Walked[0]}**km`,
                                `Distância percorrida`,
                                true
                            )
                            .addField(
                                `${ms_emoji}  **${Mushroom[3]}**kg`,
                                `Cogumelos coletados`,
                                true
                            )
                            .addField(
                                `${tr_emoji}  **${Trophy[0]}** troféus`,
                                `Competições ganhas`,
                                true
                            )
                            .addField(
                                `${fr_emoji}  **${Friend[0]}** caçadores`,
                                `Amigos`,
                                true
                            )
                            .addBlankField()
                            .addField(
                                `${ps_emoji}  Sua precisão é de **${Precision.toPrecision(
                    2
                  )}%**`,
                                `${Shots[0]} disparos\n${Shots[3]} acertos\n${
                    Shots[6]
                  } erros`,
                                true
                            ) //0, 3, 6
                            .addField(
                                `${tm_emoji}  Tempo total caçando`,
                                `${PlayTime[0]} ${PTDays}, ${PlayTime[2]} ${PTHours} e ${
                    PlayTime[4]
                  } ${PTMinutes}`,
                                true
                            )
                            .setFooter(pOrMe)
                            .setTimestamp()
                        );

                        var snData = {
                            NICKNAME: `${ign[0]}`,
                            TITLE: `${ign[1]}`,
                            HUNTERSCORE: `${THHunterScore}`,
                            RANK: `${THRank}`,
                            LONGO: `${LongShot[0]}`,
                            PERTO: `${MinShot[0]}`,
                            RECOLHIDOS: `${THHarvested}`,
                            RASTREADOS: `${THTracked}`,
                            FOCALIZADOS: `${THSpotted}`,
                            CSS: `${THCss}`,
                            ANDOU: `${Walked[0]}`,
                            COGUMELOS: `${Mushroom[3]}`,
                            TROFEUS: `${Trophy[0]}`,
                            AMIGOS: `${Friend[0]}`,
                            PRECISAO: `${Precision}`,
                            TEMPO: `${PlayTime[0]}d${PlayTime[2]}h${PlayTime[4]}m`,
                            LASTUPDATE: `${DataTempo}`,
                            LASTREQUEST: `${autorNickname} (${autorUsername})`
                        };

                        var sData = JSON.stringify(snData, null, `\t`);
                        fs.writeFileSync(`./perfis/pesquisados/${ign[0]}.json`, sData);
                        var pSearch = `./perfis/pesquisados/${ign[0]}json`;
                    }
                })();
            }
            catch (err)
            {
                console.log(
                    `[${DataTempo}] ${
            pView.NICKNAME
          } requisitou a verificação de perfil de ${
            args[0]
          }, mas não obteve sucesso...`
                );
                cChannel.send(
                    new Discord.RichEmbed()
                    .setColor(`#E84C3D`)
                    .setTitle(
                        `Ei ${pView.NICKNAME}, o usuário ${args} não existe ou você escreveu o nick errado...`
                    )
                    .setDescription(`Portanto não há o que se ver por aqui!`)
                );
            }
        }

        return;
    }

    // Funções

    // Exibe a janela de !commandos
    function showCommands()
    {
        var cChannel = message.guild.channels.find(ch => ch.name === `comandos`);
        cChannel.send(
            new Discord.RichEmbed()
            .setThumbnail(client.user.avatarURL)
            .setColor(`#E67F22`)
            .setTitle(
                `Há mais comandos sendo desenvolvidos, por agora, estou apto à lhe atender aos seguintes comandos`
            )
            .setFooter(`v1.2_d`)
            .addBlankField()
            .addField(`!comandos`, `Exibe essa janela!`)
            .addField(`!me`, `Mostra o seu perfil`)
            .addField(`!id`, `Mostra o seu HUNTER ID`)
            .addField(`!p nickname`, `Monstra o perfil do nickname provido`)
            .addField(`!sobre`, `Saiba mais sobre mim!`)
            .addField(
                `!m reserva`,
                `Exibe a tabela da reserva indicada...\nPesquise as reservas pelo primeiro nome`
            )
            .addField(`!reservas`, `Exibe a janela de lista das reservas`)
        );
    }

    // Exibe a janela de !reservas
    function showReserves()
    {
        var cChannel = message.guild.channels.find(ch => ch.name === `comandos`);
        const wh_emoji = client.emojis.find(emoji => emoji.name === `WH_Icon`);
        const lp_emoji = client.emojis.find(emoji => emoji.name === `LP_Icon`);
        const sc_emoji = client.emojis.find(emoji => emoji.name === `SC_Icon`);
        const rf_emoji = client.emojis.find(emoji => emoji.name === `RF_Icon`);
        const hf_emoji = client.emojis.find(emoji => emoji.name === `HF_Icon`);
        const hm_emoji = client.emojis.find(emoji => emoji.name === `HM_Icon`);
        const rb_emoji = client.emojis.find(emoji => emoji.name === `RB_Icon`);
        const vb_emoji = client.emojis.find(emoji => emoji.name === `VB_Icon`);
        const br_emoji = client.emojis.find(emoji => emoji.name === `BR_Icon`);
        const wr_emoji = client.emojis.find(emoji => emoji.name === `WR_Icon`);
        const tt_emoji = client.emojis.find(emoji => emoji.name === `TT_Icon`);
        const pb_emoji = client.emojis.find(emoji => emoji.name === `PB_Icon`);

        cChannel.send(
            new Discord.RichEmbed()
            .setColor(`#F1C40F`)
            .setTitle(
                `Para fazer uma pesquisa, utilize o código fornecido abaixo do nome do mapa`
            )
            .setDescription(`Algo assim **!m loggers**`)
            .addBlankField()
            .addField(`${wh_emoji}  Whitehart Island`, `**!m whitehart**`, true)
            .addField(`${lp_emoji}  Logger's Point`, `**!m loggers**`, true)
            .addField(`${sc_emoji}  Settler Creeks`, `**!m settler**`, true)
            .addBlankField()
            .addField(`${rf_emoji}  Redfeather Falls`, `**!m redfeather**`, true)
            .addField(`${hf_emoji}  Hirschfelden`, `**!m hirschfelden**`, true)
            .addField(`${hm_emoji}  Hemmeldal`, `**!m hemmedal**`, true)
            .addBlankField()
            .addField(`${rb_emoji}  Rougarou Bayou`, `**!m rougarou**`, true)
            .addField(`${vb_emoji}  Val-des-Bois`, `**!m valdesbois**`, true)
            .addField(`${br_emoji}  Bushrangers Run`, `**!m bushrangers**`, true)
            .addBlankField()
            .addField(`${wr_emoji}  Whiterime Ridge`, `**!m whiterim**e`, true)
            .addField(`${tt_emoji}  Timbergold Trails`, `**!m timbergold**`, true)
            .addField(`${pb_emoji}  Piccabeen Bay`, `**!m piccabeen**`, true)
        );
    }

    // Registra o usuário caso ele não tenha registro ainda
    function registerUser()
    {
        // Assets
        const hs_emoji = client.emojis.find(emoji => emoji.name === `hs`);
        const rk_emoji = client.emojis.find(emoji => emoji.name === `rank`);
        const tm_emoji = client.emojis.find(emoji => emoji.name === `timer`);
        const ex_emoji = client.emojis.find(emoji => emoji.name === `exclusive`);

        // Cargos/Titulos
        var no_role = message.guild.roles.find(
            a => a.name === `Caçador sem licença`
        );
        var in_role = message.guild.roles.find(
            b => b.name === `Nivel Iniciante 0 - 300`
        );
        var az_role = message.guild.roles.find(
            c => c.name === `Nivel Aprendiz  300+`
        );
        var am_role = message.guild.roles.find(d => d.name === `Nivel Amador 900+`);
        var cd_role = message.guild.roles.find(
            e => e.name === `Nivel Caçador 1800+`
        );
        var it_role = message.guild.roles.find(
            f => f.name === `Nivel Instrutor 3000+`
        );
        var gu_role = message.guild.roles.find(g => g.name === `Nivel Guia 5000+`);
        var ep_role = message.guild.roles.find(h => h.name === `Nivel Épico 7500+`);
        var ld_role = message.guild.roles.find(
            i => i.name === `Nível Lendário 10.000+`
        );
        var mt_role = message.guild.roles.find(
            j => j.name === `Nivel Mítico 25.000+`
        );
        var ex_role = message.guild.roles.find(
            k => k.name === `Nivel Extraordinário 50.000+`
        );
        var ec_role = message.guild.roles.find(
            l => l.name === `Nivel Embaixador de Caça 100.000+`
        );

        var autorID = message.author.id; // ID do usuário
        var args = message.content.slice(prefix.length).split(` `);
        var p = autorID;
        var alreadyReg = 0;
        var member = message.member;
        var aNickname = args[1];
        var mkReg = `Um momento ${member.user.username}... Estou criando sua **HUNTER ID**`;

        var lNickname = aNickname.toLowerCase();

        // !admr @xGamerBRx xgamebrx
        if (isAdmR === 1)
        {
            var member = rMember;
            p = member.user.id;
            aNickname = args[2];
            mkReg = `Estou cadastrando o usuário ${member.user.username}, a pedido do administrador!`;
        }

        if (fs.existsSync(`./perfis/registrados/${p}.json`))
        {
            alreadyReg = 1;
        }

        if (
            fs.existsSync(`./perfis/nicknames/${lNickname}.json`) &&
            alreadyReg === 0
        )
        {
            var pView = require(`./perfis/nicknames/${lNickname}.json`);
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `O nickname que você escolheu já foi cadastrado no usuário ${pView.USER}...`
                )
                .setDescription(
                    `O seu perfil e o de ${pView.USER} foram marcados para futura analise!\nNão posso lhe ajudar agora, por favor, compreenda...`
                )
                .setColor(`#E84C3D`)
            );
            return;
        }

        if (fs.existsSync(`./perfis/registrados/${p}.json`) && alreadyReg === 1)
        {
            var pView = require(`./perfis/registrados/${p}.json`);
            cChannel.send(
                new Discord.RichEmbed()
                .setTitle(
                    `Parece que você já está registrado em minha database com o nickname de ${pView.NICKNAME}...`
                )
                .setDescription(
                    `Não é o seu nickname, ou está escrito incorretamente? Contate o RCPOLSKI para resolver!`
                )
                .setColor(`#E84C3D`)
            );
            return;
        }
        else if (!fs.existsSync(`./perfis/registrados/${p}.json`))
        {
            (async () =>
            {
                try
                {
                    // Pega o dia, mês, ano, horas, minutos e segundos
                    var Hoje = new Date();
                    var Data = `${Hoje.getDate()}/${Hoje.getMonth() +
            1}/${Hoje.getFullYear()}`;
                    var Tempo = `${Hoje.getHours()}:${Hoje.getMinutes()}:${Hoje.getSeconds()}`;
                    var DataTempo = `${Data}  ${Tempo}`;

                    // Envia uma mensagem avisando sobre o cadastro
                    cChannel
                        .send(
                            new Discord.RichEmbed()
                            .setColor(`#F1C40F`)
                            .setTitle(`${tm_emoji}  ${mkReg}`)
                        )
                        .then(msg =>
                        {
                            setTimeout(function()
                            {
                                msg.delete();
                            }, 10000);
                        });

                    var PlayerLink = `https://www.uhcapps.co.uk/stats_lifetime.php?username=${aNickname}`; // Source do Scrapper
                    const response = await rp(PlayerLink);
                    const $ = jCheerio.load(response);
                    var THHunterScore = $(
                        `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading`
                    ).text();
                    var THNickname = $(`#user-profile-url`).text();
                    var THAvatar = $(
                        `#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img`
                    ).attr(`src`);
                    var ign = THNickname.match(
                        /[a-zA-Z,.-_]+|[0-9.,-_]+(?:\.[0-9.,-_]+|)/g
                    );

                    if (!THHunterScore)
                    {
                        console.log(`ERROR`);
                        message.delete(100);
                        cChannel.send(
                            new Discord.RichEmbed()
                            .setColor(`#E84C3D`)
                            .setTitle(`Ops, parece que temos um erro aqui...`)
                            .setDescription(
                                `Você tem certeza de que escreveu o nickname correto?`
                            )
                        );
                        return;
                    }

                    var memberRole = az_role;
                    var numberRole = 0;
                    var XPRoof = 0;
                    var myRole = ``;
                    var myPoints = ``;
                    var pColor = ``;

                    // Define o título do jogador baseado em seu Hunter Score
                    if (THHunterScore <= 299)
                    {
                        member.setRoles([in_role]);
                        pColor = `#E6E6E6`;
                        memberRole = in_role;
                        numberRole = 1;
                        myRole = `Iniciante`;
                        myPoints = `De 0 à 300 pontos`;
                        XPRoof = 300;
                    }
                    else if (THHunterScore >= 300 && THHunterScore <= 899)
                    {
                        member.setRoles([az_role]);
                        pColor = `#2DCC70`;
                        memberRole = az_role;
                        numberRole = 2;
                        myRole = `Aprendiz`;
                        myPoints = `Mais de 300 pontos`;
                        XPRoof = 900;
                    }
                    else if (THHunterScore >= 900 && THHunterScore <= 1799)
                    {
                        member.setRoles([am_role]);
                        pColor = `#8C44CC`;
                        memberRole = am_role;
                        numberRole = 3;
                        myRole = `Amador`;
                        myPoints = `Mais de 900 pontos`;
                        XPRoof = 1800;
                    }
                    else if (THHunterScore >= 1800 && THHunterScore <= 2999)
                    {
                        member.setRoles([cd_role]);
                        pColor = `#E84C3D`;
                        memberRole = cd_role;
                        numberRole = 4;
                        myRole = `Caçador`;
                        myPoints = `Mais de 1.800 pontos`;
                        XPRoof = 3000;
                    }
                    else if (THHunterScore >= 3000 && THHunterScore <= 4999)
                    {
                        member.setRoles([it_role]);
                        pColor = `#C5F181`;
                        memberRole = it_role;
                        numberRole = 5;
                        myRole = `Instrutor`;
                        myPoints = `Mais de 3.000 pontos`;
                        XPRoof = 5000;
                    }
                    else if (THHunterScore >= 5000 && THHunterScore <= 7499)
                    {
                        member.setRoles([gu_role]);
                        pColor = `#3598DB`;
                        memberRole = gu_role;
                        numberRole = 6;
                        myRole = `Guia`;
                        myPoints = `Mais de 5.000 pontos`;
                        XPRoof = 7500;
                    }
                    else if (THHunterScore >= 7500 && THHunterScore <= 9999)
                    {
                        member.setRoles([ep_role]);
                        pColor = `#F35CAC`;
                        memberRole = ep_role;
                        numberRole = 7;
                        myRole = `Épico`;
                        myPoints = `Mais de 7.500 pontos`;
                        XPRoof = 10000;
                    }
                    else if (THHunterScore >= 10000 && THHunterScore <= 24999)
                    {
                        member.setRoles([ld_role]);
                        pColor = `#E67F22`;
                        memberRole = ld_role;
                        numberRole = 8;
                        myRole = `Lendário`;
                        myPoints = `Mais de 10.000 pontos`;
                        XPRoof = 25000;
                    }
                    else if (THHunterScore >= 25000 && THHunterScore <= 49999)
                    {
                        member.setRoles([mt_role]);
                        pColor = `#65CCCC`;
                        memberRole = mt_role;
                        numberRole = 9;
                        myRole = `Mítico`;
                        myPoints = `Mais de 25.000 pontos`;
                        XPRoof = 50000;
                    }
                    else if (THHunterScore >= 50000 && THHunterScore <= 99999)
                    {
                        member.setRoles([ex_role]);
                        pColor = `#FD1BF7`;
                        memberRole = ex_role;
                        numberRole = 10;
                        myRole = `Extraordinário`;
                        myPoints = `Mais de 50.000 pontos`;
                        XPRoof = 100000;
                    }
                    else if (THHunterScore >= 100000)
                    {
                        member.setRoles([ec_role]);
                        pColor = `#F1C40F`;
                        memberRole = ec_role;
                        numberRole = 11;
                        myRole = `Embaixador de Caça`;
                        myPoints = `Mais de 100.000 pontos`;
                        XPRoof = 109000;
                    }

                    // Pega somente a Hora
                    var dHora = new Date();
                    var Hora = dHora.getHours();

                    // Escreve os dados num arquivo com o ID do Discord
                    var iData = {
                        ID: `${member.user.id}`,
                        TAG: `${member.user.tag}`,
                        DISCORDUSERNAME: `${member.user.username}`,
                        HUNTERSCORE: `${THHunterScore}`,
                        THCAVATAR: `${THAvatar}`,
                        ROLE: `${memberRole}`,
                        COR: `${pColor}`,
                        NROLE: `${numberRole}`,
                        NICKNAME: `${ign[0]}`,
                        LASTUP: `${Hora}`
                    };

                    var isData = JSON.stringify(iData, null, `\t`);
                    fs.writeFileSync(`./perfis/registrados/${p}.json`, isData);

                    // Escreve os dados num arquivo com o nickname do jogador
                    var nData = {
                        USER: `${member.user.username}`,
                        ID: `${member.user.id}`,
                        NICKNAME: `${ign[0]}`,
                        TIME: `${DataTempo}`
                    };

                    var nsData = JSON.stringify(nData, null, `\t`);
                    fs.writeFileSync(
                        `./perfis/nicknames/${ign[0].toLowerCase()}.json`,
                        nsData
                    );

                    if (member.user.id === message.guild.ownerID)
                    {
                        //console.log(`O senhor é o meu pastor e seu nickname não alterarei!`)
                        return;
                    }
                    else
                    {
                        member.setNickname(`${ign[0]} ★ ${THHunterScore}`);
                    }

                    var intHunterScore = parseInt(THHunterScore);
                    var XPNeeded = XPRoof - intHunterScore;

                    cChannel.send(
                        new Discord.RichEmbed()
                        .setTitle(`${ign[0]}  |  HUNTER ID`)
                        .setDescription(p)
                        .addBlankField()
                        .addField(
                            `${hs_emoji}  **${THHunterScore}**`,
                            `Sua pontuação de caçador`,
                            true
                        )
                        .addField(`${rk_emoji} ** ${myPoints}**`, memberRole, true)
                        .addField(
                            `${ex_emoji}  **${THHunterScore}/${XPRoof}** Pts`,
                            `Falta apenas **${XPNeeded}** pontos de caçador para você alcançar o próximo nível!`
                        )
                        .addBlankField()
                        .setColor(pColor)
                        .setThumbnail(THAvatar)
                        .setFooter(`Use !me para mostrar o seu próprio perfil`)
                        .setTimestamp()
                    );

                    console.log(
                        `[${DataTempo}] ${member.user.username}(${p}) se registrou com sucesso!`
                    );
                }
                catch (err)
                {
                    cChannel.send(
                        new Discord.RichEmbed()
                        .setTitle(
                            `Ops, parece que não fui capaz de encontrar o seu nickname...`
                        )
                        .setDescription(
                            `Você tem certeza que esse é o seu nickname? > ${aNickname}`
                        )
                        .setColor(`#E84C3D`)
                    );
                    console.log(err);
                    return;
                }
            })();
        }
    }

    function updatePlayerInfo(id)
    {
        // Assets
        const hs_emoji = client.emojis.find(emoji => emoji.name === `hs`);
        const rk_emoji = client.emojis.find(emoji => emoji.name === `rank`);
        const ex_emoji = client.emojis.find(emoji => emoji.name === `exclusive`);

        var no_role = message.guild.roles.find(
            a => a.name === `Caçador sem licença`
        );
        var in_role = message.guild.roles.find(
            b => b.name === `Nivel Iniciante 0 - 300`
        );
        var az_role = message.guild.roles.find(
            c => c.name === `Nivel Aprendiz  300+`
        );
        var am_role = message.guild.roles.find(d => d.name === `Nivel Amador 900+`);
        var cd_role = message.guild.roles.find(
            e => e.name === `Nivel Caçador 1800+`
        );
        var it_role = message.guild.roles.find(
            f => f.name === `Nivel Instrutor 3000+`
        );
        var gu_role = message.guild.roles.find(g => g.name === `Nivel Guia 5000+`);
        var ep_role = message.guild.roles.find(h => h.name === `Nivel Épico 7500+`);
        var ld_role = message.guild.roles.find(
            i => i.name === `Nível Lendário 10.000+`
        );
        var mt_role = message.guild.roles.find(
            j => j.name === `Nível Mítico 25.000+`
        );
        var ex_role = message.guild.roles.find(
            k => k.name === `Nivel Extraordinário 50.000+`
        );
        var ec_role = message.guild.roles.find(
            l => l.name === `Nivel Embaixador de Caça 100.000+`
        );

        var autorID = message.author.id; // ID do usuário
        var autorNickname = message.member.nickname; // Apelido do usuário
        var p = autorID;
        var member = message.member;

        var Hoje = new Date();
        var Data = `${Hoje.getDate()}/${Hoje.getMonth() + 1}/${Hoje.getFullYear()}`;
        var Tempo = `${Hoje.getHours()}:${Hoje.getMinutes()}:${Hoje.getSeconds()}`;
        var DataTempo = `${Data} ${Tempo}`;

        (async () =>
        {
            try
            {
                // Pega apenas a hora
                var dHora = new Date();
                var Hora = dHora.getHours();

                // !admr @xGamerBRx xgamebrx
                if (isAdmR === 1)
                {
                    member = uMember;
                    p = member.user.id;
                }
                if (isBulkUpdate === 1) {}

                // Algumas variáveis
                var JSONCheck = new jSelfReloadJSON(`./perfis/registrados/${p}.json`);
                JSONCheck.resume();
                JSONCheck.forceUpdate();
                JSONCheck.stop();
                var pView = JSONCheck;
                var PlayerLinkpView = `https://www.uhcapps.co.uk/stats_lifetime.php?username=${pView.NICKNAME}`; // Source do Scrapper
                const response = await rp(PlayerLinkpView);
                const $ = jCheerio.load(response);
                var THHunterScore = $(
                    `body > table > tbody > tr > td > table:nth-child(2) > tbody > tr:nth-child(2) > td > table:nth-child(3) > tbody > tr > td:nth-child(3) > span.heading`
                ).text();
                var THAvatar = $(
                    `#polaroid_div > table > tbody > tr > td > table > tbody > tr:nth-child(1) > td:nth-child(2) > img`
                ).attr(`src`);

                var memberRole = az_role;
                var fetchedRole = parseInt(pView.NROLE);
                var numberRole = 100;
                var pColor = pView.COR;
                var myRole = ``;
                var myPoints = ``;
                var XPRoof = 0;
                var intHunterScore = parseInt(THHunterScore);

                // Define o título do jogador por meio de seu Hunter Score
                try
                {
                    if (THHunterScore <= 299)
                    {
                        member.addRole(in_role);
                        pColor = `#E6E6E6`;
                        memberRole = in_role;
                        numberRole = 1;
                        myRole = `Iniciante`;
                        myPoints = `De 0 à 300 pontos`;
                        XPRoof = 300;
                    }
                    else if (THHunterScore >= 300 && THHunterScore <= 899)
                    {
                        member.addRole(az_role);
                        pColor = `#2DCC70`;
                        memberRole = az_role;
                        numberRole = 2;
                        myRole = `Aprendiz`;
                        myPoints = `Mais de 300 pontos`;
                        XPRoof = 900;
                    }
                    else if (THHunterScore >= 900 && THHunterScore <= 1799)
                    {
                        member.addRole(am_role);
                        pColor = `#8C44CC`;
                        memberRole = am_role;
                        numberRole = 3;
                        myRole = `Amador`;
                        myPoints = `Mais de 900 pontos`;
                        XPRoof = 1800;
                    }
                    else if (THHunterScore >= 1800 && THHunterScore <= 2999)
                    {
                        member.addRole(cd_role);
                        pColor = `#E84C3D`;
                        memberRole = cd_role;
                        numberRole = 4;
                        myRole = `Caçador`;
                        myPoints = `Mais de 1.800 pontos`;
                        XPRoof = 3000;
                    }
                    else if (THHunterScore >= 3000 && THHunterScore <= 4999)
                    {
                        member.addRole(it_role);
                        pColor = `#C5F181`;
                        memberRole = it_role;
                        numberRole = 5;
                        myRole = `Instrutor`;
                        myPoints = `Mais de 3.000 pontos`;
                        XPRoof = 5000;
                    }
                    else if (THHunterScore >= 5000 && THHunterScore <= 7499)
                    {
                        member.addRole(gu_role);
                        pColor = `#3598DB`;
                        memberRole = gu_role;
                        numberRole = 6;
                        myRole = `Guia`;
                        myPoints = `Mais de 5.000 pontos`;
                        XPRoof = 7500;
                    }
                    else if (THHunterScore >= 7500 && THHunterScore <= 9999)
                    {
                        member.addRole(ep_role);
                        pColor = `#f35cac`;
                        memberRole = ep_role;
                        numberRole = 7;
                        myRole = `Épico`;
                        myPoints = `Mais de 7.500 pontos`;
                        XPRoof = 10000;
                    }
                    else if (THHunterScore >= 10000 && THHunterScore <= 24999)
                    {
                        member.addRole(ld_role);
                        pColor = `#E67F22`;
                        memberRole = ld_role;
                        numberRole = 8;
                        myRole = `Lendário`;
                        myPoints = `Mais de 10.000 pontos`;
                        XPRoof = 25000;
                    }
                    else if (THHunterScore >= 25000 && THHunterScore <= 49999)
                    {
                        member.addRole(mt_role);
                        pColor = `#65CCCC`;
                        memberRole = mt_role;
                        numberRole = 9;
                        myRole = `Mítico`;
                        myPoints = `Mais de 25.000 pontos`;
                        XPRoof = 50000;
                    }
                    else if (THHunterScore >= 50000 && THHunterScore <= 99999)
                    {
                        member.addRole(ex_role);
                        pColor = `#FD1BF7`;
                        memberRole = ex_role;
                        numberRole = 10;
                        myRole = `Extraordinário`;
                        myPoints = `Mais de 50.000 pontos`;
                        XPRoof = 100000;
                    }
                    else if (THHunterScore >= 100000)
                    {
                        member.addRole(ec_role);
                        pColor = `#F1C40F`;
                        memberRole = ec_role;
                        numberRole = 11;
                        myRole = `Embaixador de Caça`;
                        myPoints = `Mais de 100.000 pontos`;
                        XPRoof = 109000;
                    }
                }
                catch (err)
                {
                    console.log(err);
                }

                try
                {
                    switch (numberRole)
                    {
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
                            console.log(`Não foi possível encontrar o cargo deste usuário`);
                    }
                }
                catch (error)
                {
                    console.error(error);
                }

                var XPNeeded = XPRoof - intHunterScore;

                if (numberRole > fetchedRole)
                {
                    levelUp();
                }

                function levelUp()
                {
                    cChannel.send(
                        new Discord.RichEmbed()
                        .setTitle(`Parabéns ${pView.NICKNAME}!`)
                        .setDescription(`Você acaba de alcançar um novo nível!`)
                        .addBlankField()
                        .addField(
                            `${hs_emoji}  ${THHunterScore}`,
                            `Sua pontuação de caçador`,
                            true
                        )
                        .addField(`${rk_emoji}  ${myPoints}`, memberRole, true)
                        .addField(
                            `${ex_emoji}  ${THHunterScore}/${XPRoof} Pts`,
                            `Falta apenas ${XPNeeded} pontos de caçador para você alcançar o próximo nível!`
                        )
                        .addBlankField()
                        .setColor(pColor)
                        .setThumbnail(pView.THCAVATAR)
                        .setFooter(`Use !me para mostrar o seu próprio perfil`)
                        .setTimestamp()
                    );
                }

                if (cardRequested === 1)
                {
                    cardShow();
                }

                function cardShow()
                {
                    cChannel.send(
                        new Discord.RichEmbed()
                        .setTitle(`${pView.NICKNAME}  |  HUNTER ID`)
                        .setDescription(pView.ID)
                        .addBlankField()
                        .addField(
                            `${hs_emoji}  **${THHunterScore}**`,
                            `Sua pontuação de caçador`,
                            true
                        )
                        .addField(`${rk_emoji}  **${myPoints}**`, memberRole, true)
                        .addField(
                            `${ex_emoji}  **${THHunterScore}/${XPRoof}** Pts`,
                            `Falta apenas **${XPNeeded}** pontos de caçador para você alcançar o próximo nível!`
                        )
                        .addBlankField()
                        .setColor(pColor)
                        .setThumbnail(pView.THCAVATAR)
                        .setFooter(`Use !me para mostrar o seu próprio perfil`)
                        .setTimestamp()
                    );
                }

                var iData = {
                    ID: `${member.user.id}`,
                    TAG: `${member.user.tag}`,
                    DISCORDUSERNAME: `${member.user.username}`,
                    DISCORDAVATARURL: `${member.user.avatarURL}`,
                    HUNTERSCORE: `${THHunterScore}`,
                    THCAVATAR: `${THAvatar}`,
                    ROLE: `${memberRole}`,
                    COR: `${pColor}`,
                    NROLE: `${numberRole}`,
                    NICKNAME: `${pView.NICKNAME}`,
                    LASTUP: `${Hora}`
                };

                var pData = JSON.stringify(iData, null, `\t`);
                fs.writeFileSync(`./perfis/registrados/${p}.json`, pData);

                if (member.user.id === message.guild.ownerID)
                {
                    return;
                }
                else
                {
                    member.setNickname(`${pView.NICKNAME} ★ ${THHunterScore}`);
                }

                console.log(
                    `[${DataTempo}] ${pView.NICKNAME} teve seu perfil atualizado!`
                );
            }
            catch (Error)
            {
                console.log(
                    `Ops, não consegui atualizar o registro de ${autorUsername}`
                );
                console.log(Error);
                return;
            }
        })();
    }

    function delPlayerInfo()
    {
        try
        {
            var JSONCheck = new jSelfReloadJSON(
                `./perfis/registrados/${dMember.user.id}.json`
            );
            JSONCheck.resume();
            JSONCheck.forceUpdate();
            JSONCheck.stop();
            var delViewRequestID = JSONCheck;

            const tm_emoji = client.emojis.find(emoji => emoji.name === `timer`);
            var no_role = message.guild.roles.find(
                a => a.name === `Caçador sem licença`
            );
            var nick = delViewRequestID.NICKNAME;
            var nickToLow = nick.toLowerCase();

            fs.unlinkSync(`./perfis/nicknames/${nickToLow}.json`);
            fs.unlinkSync(`./perfis/registrados/${dMember.user.id}.json`);
            message.delete(100);
            console.log(
                `Os dados de ${dMember.user.username}(${dMember.user.id}) foram apagados pelo administrador`
            );
            cChannel
                .send(
                    new Discord.RichEmbed()
                    .setColor(`#F1C40F`)
                    .setTitle(
                        `${tm_emoji} Estou apagando os dados de **${nick}** a pedido do administrador`
                    )
                )
                .then(msg =>
                {
                    setTimeout(function()
                    {
                        msg.edit(
                            new Discord.RichEmbed()
                            .setColor(`#F1C40F`)
                            .setTitle(
                                `**${dMember.user.username}** teve seus dados apagados a pedido do administrador!`
                            )
                        );
                    }, 3000);
                });
            dMember.setNickname(dMember.user.username);
            dMember.setRoles([no_role]);
            return;
        }
        catch (err)
        {
            cChannel.send(
                new Discord.RichEmbed()
                .setColor(`#F1C40F`)
                .setTitle(
                    `Ops, parece que houve algum erro ao tentar apagar os dados de **${dMember.user.username}**!`
                )
            );
            console.log(err);
        }
    }

    // Gerador de código HEX para cor
    function RandomColor()
    {
        function c()
        {
            var hex = Math.floor(Math.random() * 256).toString(16);
            return String(hex).substr(-2);
        }
        return `#${c()}${c()}${c()}`;
    }
});

// Login
client.login(process.env.TOKEN);

// FIM DO SCRIPT