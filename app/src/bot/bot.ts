import { Markup, Scenes, session, Telegraf } from "telegraf";
import { getConfig } from '../config';



const posts: {[key: string]: string} = {
	48934: 'text 1',
	349: 'text 2',
	2030: 'text 3',
};

const post_keyboard = (post_id: string) => {
	return Markup.inlineKeyboard([
		Markup.button.callback('Post', `post:${post_id}`),
		Markup.button.callback('Remove', `remove:${post_id}`),
	]);
}
const confirm_removal_keyboard = (post_id: string) => {
	return Markup.inlineKeyboard([
		Markup.button.callback('Yes', `confirm_removal:${post_id}`),
		Markup.button.callback('Cancel', `cancel:${post_id}`),
	]);
}

const checkScene = new Scenes.BaseScene<Scenes.SceneContext>('checkScene')
checkScene.enter(ctx => Object.entries(posts).forEach(([id, text]) => ctx.reply(text, post_keyboard(id))));
checkScene.action(/^post:[0-9]*$/, ctx => { return ctx.answerCbQuery('The post has been published'); });

checkScene.action(/^remove:[0-9]*$/, ctx => {
	const id = (<any>ctx.callbackQuery).data.split(':')[1];
	return ctx.editMessageText('Sure?', confirm_removal_keyboard(id));
});

checkScene.action(/^cancel:[0-9]*$/, ctx => {
	const id: string = (<any>ctx.callbackQuery).data.split(':')[1];
	return ctx.editMessageText(posts[id], post_keyboard(id))
});

const config = getConfig('env_');

const stage = new Scenes.Stage<Scenes.SceneContext>([ checkScene ]);

export const bot = new Telegraf<Scenes.SceneContext>(config.bot.token);
bot.use(session(), stage.middleware());
bot.command('/start', ctx => ctx.scene.enter('checkScene'));
bot.launch();
