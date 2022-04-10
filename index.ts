import DiscordJS, { Guild, Intents, Message, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import mongoose from 'mongoose'
import path from 'path'
import 'dotenv/config'
import serverValues from './schemas/serverValues'
import userschema from './schemas/userschema'

dotenv.config()

export const client = new DiscordJS.Client({
  intents : [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})

client.on('guildCreate', async (guild) =>{  
  guild.members.fetch().then( async members =>
    {

      members.forEach( async member =>
        {
          
          if (!member.user.bot) {
              const user = await userschema.findOne({'user_id': member.id}).select('user_id').lean()

              if(!user)
              {
                new userschema({
                    user_id: member.id,
                    is_officer: false,
                    wanted_lvl: 0,
                    wanted_reason: ' ',
                    release_time: 0,
                    xd_counter: 0
                  }).save()
              }
          }
        });
    });

})

client.on('guildMemberAdd', async (member) =>{

  const user = await userschema.findOne({'user_id': member.id}).select('user_id').lean()

  if (!user && !member.user.bot) {
      new userschema({
          user_id: member.id,
          is_officer: false,
          wanted_lvl: 0,
          wanted_reason: ' ',
          release_time: 0
        }).save()
  }

})

client.on('ready', async () =>{

  const Guilds = client.guilds.cache.map(guild => guild.id);

  for (var i = 0; i < Guilds.length; i++) {
    const guild = client.guilds.cache.get(Guilds[i])

    guild?.members.fetch().then( async members =>
    {
      members.forEach( async member =>
      {
        if (!member.user.bot) {

          const user = await userschema.findOne({'user_id': member.id}).select('user_id').lean()

          if(user)
          {
            const guild_db = await serverValues.findOne({'server_id': guild.id})

            if (guild_db)
            {
              if (member?.roles.cache.some(role => role.id === guild_db?.jail_role))
              {
  
                await userschema.findOneAndUpdate(
                  {user_id: member.id},
                  {release_time: 0},
                )
  
                member?.roles.remove(guild_db.jail_role)
                member?.roles.add(guild_db.default_role)
              }
            }
          }
      }
      })

    })
  }

  client.user?.setActivity("with myself", {
    type: "PLAYING",
  });

  new WOKCommands(client, {
    commandsDir: path.join(__dirname, 'commands'),
    typeScript: true,
    mongoUri: process.env.MONGO_URI,
    botOwners: ['415241379866869771']
  })
    .setDefaultPrefix('-')
})

client.on('messageCreate', async function(message) {

  const user = await userschema.findOne({'user_id': message.author.id})

  if (user)
  {
    if (message.content.toLowerCase().includes('xd'))
    {
      var newXD = user.xd_counter + 1
  
      await userschema.findOneAndUpdate(
        {user_id: message.author.id},
        {xd_counter: newXD},
      )
    }
  }

  if (user)
  {
    if (!message.author.bot)
    {
      const user = await userschema.findOne({'user_id': message.author.id})
  
      if (user.wanted_lvl > 0)
      {
        const guild_db = await serverValues.findOne({'server_id': message.guild?.id})
  
        const user = await userschema.findOne({'user_id': message.author.id})
  
        message.member?.roles.remove(message.member?.roles.cache) // Aici
        message.member?.roles.add(guild_db.jail_role)
  
        var time = (user.wanted_lvl * 60000) - 5000
  
        await userschema.findOneAndUpdate(
          {user_id: message.author.id},
          {wanted_lvl: 0},
        )
  
        await userschema.findOneAndUpdate(
          {user_id: message.author.id},
          {wanted_reason:'None'},
        )
  
        await userschema.findOneAndUpdate(
          {user_id: message.author.id},
          {release_time: time},
        )
        
        message.channel.send(
          "**Apprehended suspect**" + " " + "**" + message.author.username + "**" + "\n" +
          "**Sentece:**" + " " + ((time + 5000) / 1000) + " " + "seconds of jail."
        )
  
        wait(message, time, user, guild_db)
  
      }
  
    }
  }
})


async function wait(message:Message, time:any, user:any, guild_db:any) 
{
  setTimeout(async function(){

    const user = await userschema.findOne({'user_id': message.author.id})
    const guild_db = await serverValues.findOne({'server_id': message.guild?.id})

    if (!message.member?.roles.cache.some(role => role.id === guild_db.jail_role))
    {
      await userschema.findOneAndUpdate(
        {user_id: message.author.id},
        {release_time: 0},
      )

      return
    }

    if (user.release_time <= 0)
    {
      message.member?.roles.remove(guild_db.jail_role)
      message.member?.roles.add(guild_db.default_role)
      await userschema.findOneAndUpdate(
        {user_id: message.author.id},
        {release_time: 0},
      )
    }
    else 
    {
        const newTime = user.release_time - 5000

        await userschema.findOneAndUpdate(
          {user_id: message.author.id},
          {release_time: newTime},
        )

        wait(message, time, user, guild_db)
    }

  }, 5000)
}

client.on('roleDelete', async (role) =>{

  const guild_db = await serverValues.findOne({'server_id': role.guild.id})

  if (guild_db)
  {
    if (role.id == guild_db.jail_role)
    {
      await serverValues.findOneAndUpdate(
        {server_id: role.guild.id},
        {jail_role: "None"},
    )
    }
  
    if (role.id == guild_db.default_role)
    {
      await serverValues.findOneAndUpdate(
        {server_id: role.guild.id},
        {default_role: "None"},
    )
    }
  }


})


client.login(process.env.TOKEN)