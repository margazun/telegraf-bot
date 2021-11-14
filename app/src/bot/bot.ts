import { Context, Markup, Telegraf } from "telegraf";
import { getConfig } from '../config';
import { Payload } from '../types';
import { commands, text } from './commands';
import {  } from "path";

const config = getConfig('env_');

export const bot = new Telegraf(config.bot.token);
bot.start((ctx: Context) => ctx.reply('Welcome'));
bot.help((ctx: Context) => ctx.reply(commands));

bot.command('course', async (ctx: Context) => {
	try {
		await ctx.replyWithHTML(
			'<b>Courses</b>',
			Markup.inlineKeyboard([
				[Markup.button.callback('Editors', 'btn_1'), Markup.button.callback('JS', 'btn_2'), Markup.button.callback('TS', 'btn_3')], 
				[Markup.button.callback('HTML', 'btn_4')],
			])
			);
	} catch (err) {
		console.error(err)	;
	}
});

// bot.action('btn_1', async (ctx:Context) => {
// 	try {
// 		await ctx.answerCbQuery();
// 		await ctx.replyWithHTML('Button 1', {
// 			disable_web_page_preview: true
// 		});
// 	} catch (err) {
		
// 	}
// });

bot.on('sticker', (ctx: Context) => ctx.reply('👍'));
bot.hears('hi', (ctx: Context) => ctx.reply('hey there!'));

addActionBot({
	name: 'btn_1',
	text: text,
	src: '/../../../assets/images/1.jpg'
});
addActionBot({
	name: 'btn_2',
	text: text,
	src: '/../../../assets/images/2.jpg'
});
addActionBot({
	name: 'btn_3',
	text: text
});


bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));

function addActionBot(payload: Payload) {
	bot.action(payload.name, async (ctx:Context) => {
		try {
			await ctx.answerCbQuery();
			if('src' in payload) {
				console.log(payload.src);
				await ctx.replyWithPhoto({
					source: __dirname + <string>payload.src,
					
				});
			}
			await ctx.replyWithHTML(payload.text, {
				disable_web_page_preview: true
			});
		} catch (err) {
			console.error(err);
		}
	});
}

