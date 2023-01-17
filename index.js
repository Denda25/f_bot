const TelegramApi = require('node-telegram-bot-api');
const token = '5393921454:AAHwmVCmz6xlv60tepN8Kj39Wz8YwKZZp2o';
const{gameOptions,againOptions} = require('./options.js')
const bot = new TelegramApi(token,{polling:true});
const chats = {};

const startGame = async (chatId) =>{
    await bot.sendMessage(chatId,'Сейчас загадаю число от 0 до 9 а ты угадай')
    const randomNumber = Math.floor(Math.random()*10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId,'Отгадывай',gameOptions);
};



bot.setMyCommands([
    {command:'/start',description:'запустить бота'},
    {command:'/info',description:'информация про аккаунт'},
    {command:'/game',description:'Игра'},
    
])

bot.on('message', async msg=>{
    const text = msg.text ;
    const chatId= msg.chat.id ;
    if(text==='/info'){
        return bot.sendMessage(chatId,'your id is -' + msg.chat.id)
    }
    if(text === '/start'){
        return bot.sendMessage( chatId ,'hello' );
    }
    if(text === '/game'){
        return startGame(chatId);
    }
    
    return bot.sendMessage( chatId ,'you write '+text );
});
bot.on('callback_query',async msg=>{
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === '/again' ){
        return startGame(chatId);
    };
    if (data == chats[chatId]){
        return await bot.sendMessage(chatId,'Поздаравляю ты отгадал загаданную мною цифру ' + chats[chatId], againOptions)
    } else {
        return await bot.sendMessage(chatId,'К сожалению указанная тобою цифра ' + data + ' не та что я загадал\r\n я загадал '+ chats[chatId] , againOptions)
    }
});