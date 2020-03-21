/*:
 * Copyright (c) 2018-2018 Sigureya(https://twitter.com/Sigureya/)
 * This plug-in is MIT license if the game is provided free of charge.
 * In the case of being offered for a fee, it is assumed to be 2000 yen in Japanese yen per title.
 * このプラグインはゲームが無償で提供される場合はMITライセンスです。
 * 有償で提供される場合、１タイトルあたり日本円で2000円とします
。*/
/*:
 * @plugindesc クエストシステムプラグインです。
 * @author しぐれん
 * 
 * @param commandName
 * @text メニュー画面でのコマンド名
 * @desc メニュー画面に表示されるコマンド名です。
 * @default クエスト
 * 
 * @param commandEnabledSwitch
 * @text コマンド有効化スイッチ
 * @desc 指定したスイッチがONの場合にのみ、クエスト画面を開けます。
 * 指定が無い場合、常に開くことができます。
 * @type switch
 * @default 0
 * @parent commandName
 * 
 * @param goldText
 * @desc クエスト報酬金の要素名です。
 * @type string
 * @default 報酬金
 * 
 * @param goldFormat
 * @desc クエストの報酬に「お金」が設定されている場合の表示形式です。
 * %1に数値、%2に単位が入ってきます。
 * @type string
 * @default %1%2
 * 
 * @param filterList
 * @text クエスト状態ウィンドウの項目
 * @desc 画面左上のクエスト分類で表示するデータを決めます。
 * @type struct<FilterItem>[]
 * @default ["{\"name\":\"全部\",\"filter\":\"0\"}","{\"name\":\"受注\",\"filter\":\"3\"}","{\"name\":\"完了\",\"filter\":\"4\"}","{\"name\":\"やめる\",\"filter\":\"-1\"}"]
 * 
 * @param listRows
 * @text クエスト一覧の行数
 * @desc クエスト一覧の行数です
 * @type number
 * @default 12
 * @parent commandName
 * 
 * @param rewardRows
 * @text 報酬の行数
 * @desc 報酬アイテムの行数です。
 * @type number
 * @default 2
 * @parent commandName
 * 
 * @param messageRows
 * @text メッセージの行数
 * @desc メッセージ部分の行数です。
 * @type number
 * @default 4
 * @parent commandName
 * 
 * @param questIdDigits
 * @text クエスト番号の桁数
 * @desc クエスト12の番号を"012"のようなテキストで設定する場合の桁数を指定します。
 * @type number
 * @max 8
 * @default 3
 * @parent commandName
 * 
 * @param unknowQuestName
 * @text 不明なクエストの表示名
 * @desc クエストが隠されている・受注条件を満たせない時に表示される文字です。
 * ※未実装です
 * @default ？？？？
 * 
 * @param rewardEvent
 * @text クリア時に呼び出されるコモンイベント
 * @desc 報酬を入手した場合に呼び出されるコモンイベントです。
 * このイベントは他の報酬処理が完了してから呼び出されます。
 * @type common_event
 * @default 0
 * 
 * @param eventParam
 * @text イベントパラメータ
 * @desc 報酬に「イベント」を設定した場合、指定した変数へ代入します。
 * @type variable
 * @default 0
 * @parent rewardEvent
 * 
 * @param questId
 * @desc rewardEventで指定したイベントが呼ばれる前に、
 * ここで指定した変数にクエスト番号を代入します。
 * @type variable
 * @default 0
 * 
 * @param debguMode
 * @text デバッグモード
 * @desc デバッグ用機能を有効化します。
 * デプロイした場合、強制的にOFFになります。
 * @type boolean
 * @default true
 * 
 * 
 * @help
 * プラグインパラメータを適当に設定してください。
 * 
 * その上で、専用のエディタでQuest.jsonを編集してください。
 * 専用エディタは一部動作が不安定なので、
 * Quest.jsonは必ずバックアップを取ってください。
 * 
 * 一度クリアしたクエストを再受注する機能はありません。
 * 要望あったら、後で実装します。
 * 
 * ■クエストの報酬について
 * クエストの報酬は以下の物が設定できます。
 * ・アイテム/武器/防具
 * 通常のアイテムと同様です。
 * ・お金
 * 通常のお金の入手と同様です。
 * ・変数
 * 指定した変数へ、数値が代入されます。
 * ・コモンイベント
 * 指定したコモンイベントが呼び出されます。
 * この時、パラメータとして指定した数値が代入されます。
 * 上から順に実行され、並び順の影響を受けます。
 * 
 * ■クリア時に呼び出されるコモンイベント（rewardEvent）について
 * どういった内容を設定してもOKです。
 * また、イベントパラメータに報酬の個数が書き込まれます。
 * シーンを切り替えるものについては動作保証ができません。
 * 修正は受け付けますが、テストしていません。
 * 
 * ■プラグインコマンド
 * Quest start 1
 * クエスト1番を開始します。
 * Quest finish 1
 * クエスト1番を完了させます。
 * 完了すると同時に、報酬アイテムの入手が行われます。
 * Quest fault 1
 * クエスト1番を失敗させ、受注前の状態に戻します。
 * Quest hide 1
 * クエスト1番を受注していない状態に戻します
 * 
 * Quest reward 1
 * クエスト1番の報酬を得ます。
 * クエストの状態チェックを忘れずに。
 * 
 * ■スクリプトについて
 * $gameQuestsという変数にGame_Questsクラスが入っています。
 * そこから使えそうな関数を探してください。
 * 以下にサンプルを示します。
 * 
 * クエストが表示されている（受注可能）ならtrueを返す。
 * ・$gameQuests.isDisplayed(クエスト番号)
 * 　クエストが表示されているが、開始していない状態でtrueを返す。
 * ・$gameQuests.isStarted(クエスト番号)
 * 　クエストが開始しているならtrueを返す。
 * 
 * ・$gameQuests.isFinished(クエスト番号)
 * 　クエストが完了しているなら、trueを返す。
 * 
 * ■セーブデータに保存される内容について
 * ・クエスト番号
 * ・クエストの名前(ハッシュ化して保存)
 * ・クエストの状態（受注中・クリア済みなど）
 * 
 * 上記の３つがセーブされます。
 * クエストの名前は、データに変更があった場合に正しく復元するために使われます。
 * 数値型３つなので軽めです。
 * 
 * ■利用規約について
 * このプラグインはゲームが有償で配布される場合に限り有料です。
 * 1タイトルあたり2000円とします。
 * その際は私のTwitterアカウントまでお問い合わせください。
 * Twitterアカウントがないのであれば、ツクマテさん経由でもOKです。
 * メールアドレスと振り込み用の口座番号を送ります。
 * 
 * ver 1.0.2 2018/07/02 状態選択ウィンドウを微改造・また、デバッグ用機能を追加
 * ver 1.0.1 2018/06/29 背景変更のために微修正
 * ver 1.0.0 2018/06/24 正式公開
 * ver 0.9.3 2018/03/31
 * */
/*~struct~FilterItem:
 *
 * @param name
 * @desc 表示する名前
 * @type string
 * 
 * @param filter
 * @type select
 * @option all(全て表示)
 * @value 0
 * @option displayed(現在受注できるクエスト)
 * @value 2
 * @option started(開始したクエスト)
 * @value 3
 * @option finished(終了したクエスト)
 * @value 4
 * @default 0
 * @option やめる
 * @value -1
 */

'use strict';
var $gameQuests =null;
const Mano_QuestSystem =(function() {

class InfoParameter{
    constructor(paramText){
        const obj =JSON.parse(paramText);
        this.x =Number(obj.x);
        this.y =Number(obj.x);
        this.variable =Number(obj.variable);

        /**
         * @type {String}
         */
        this.valueFormat= String( obj.valueFormat);
        /**
         * @type {String}
         */
        this.name=obj.name;
        /**
         * @type {String}
         */
        this.key=obj.key;
    }
}


const setting =(function(){
    const param = PluginManager.parameters("Mano_Quest");
    const questIdDigits = Number(param.questIdDigits);
    const questIdDigitsText = ("0").repeat(questIdDigits);
    
    /**
     * @type {[]}
     */
    const filterListObj= JSON.parse(param.filterList ||'[]');

    const result ={
        debugMode:Utils.isOptionValid('test') && (param.debugMode==="true") ,
        unknowQuestName:String(param.unknowQuestName),
        commandName:String(param.commandName),
        commandEnabledSwitch:Number(param.commandEnabledSwitch),
        goldText:String( param.goldText),
        goldFormat:String(param.goldFormat ||"%1%2"),
        listRows:Number(param.listRows||8),
        rewardRows:Number(param.rewardRows || 3),
        messageRows:Number(param.messageRows || 4),
        questIdDigits:questIdDigits,
        questIdDigitsText:questIdDigitsText,
        rewardEvent:Number(param.rewardEvent),
        eventParam:Number(param.eventParam),
        questId:Number(param.questId),
        filterList:filterListObj.map(function(text){
            const obj = JSON.parse(text);
            return {
            name:String(obj.name),
            //互換性のために名前が違う いつか変更したいけど
            stateId:Number(obj.filter)
        };}),
    };
    return Object.freeze( result);
})();


const VariantItemFunction={
    variable:function(variant){
        $gameVariables.setValue(variant.id,variant.value);
    },
    weapon:function(variant){
        const w = $dataWeapons[variant.id];
        if(w){
            $gameParty.gainItem(w,variant.value);
        }
    },
    item:function(variant){
        const w = $dataItems[variant.id];
        if(w){
            $gameParty.gainItem(w,variant.value);
        }
    },
    armor:function(variant){
        const a = $dataArmors[variant.id];
        if(a){
            $gameParty.gainItem(a,variant.value);
        }
    },
    gold:function(variant){
        $gameParty.gainGold(variant.value);
    }
};

class Mano_QuestData{
    constructor(){
        this.name ="";
        this.requester ="";
        this.id =0;
        this.reward=[];
        this.cond_s =0;
        this.cond_v ={id:0,value:0};
        this.params={
            G:0
        };
        this.message ={
            /**
             * @type {String[]}
             */
            displayed:[],
            /**
             * @type {String[]}
             */
            hidden:[],
            /**
             * @type {String[]}
             */
            started:[],
            /**
             * @type {String[]}
             */
            finished:[],
        };
    }
    /**
     * @param {String} name 
     */
    setName(name){
        this.name =name;
    }
    addParameter(key,value){
        const v = JSON.parse( value);
        this.params[key]= v;
    }

    rewardGold(){
        return this.params.G;
    }

    /**
     * 
     * @param {RPG.EventCode} eventCode 
     */
    addReward(eventCode){
        this.rewardList.push(eventCode);
    }
    /**
     * @param {String} key 
     * @param {String[]} message 
     */
    addMessaeg(key,message){
        if(!this.message.hasOwnProperty(key)){
            this.message[key]=[];
        }
        this.message[key].push(message);
    }

    /**
     * @param {String[]} texts 
     */
    setMainText(texts){
        this.addMessaeg("main",texts);
    }

    /**
     * @param {String[]} texts 
     */
    setClearedTexts(texts){
        this.addMessaeg("cleared",texts);
    }
    /**
     * @param {String[]} texts 
     */
    setAcceptedTexts(texts){
        this._acceptedTexts =texts;
    }
}
Mano_QuestData.GAINITEM_TYPE =Object.freeze(  {
    GOLD :125,
    ITEM:126,
    WEAPON:127,
    ARMOR:128
});
const STATE_TABLE={
    none:0,
    hidden:1,
    displayed:2,
    started:3,
    finished:4
};
/**
 * @param {String} text 
 */
function getHash(text) {
    var hash = 0;
    const length = text.length;
    if (length == 0) {
        return hash;
    }
    for (var i = 0; i < length; i++) {
        var char = text.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

class Mano_Quest{
    /**
     * @param {Number} id 
     */
    constructor(id){
        const quest = $dataQuests[id];
        this._questId = id;
        this._hash = getHash( quest.name);
        this._stateId=0;
    }
    /**
     * @return {String}
     */
    get stateText(){
        switch(this._stateId){
            case 0: 
            return "none";
            case 1:
            return "hidden";
            case 2:
            return "displayed";
            case 3:
            return "started";
            case 4:
            return "finished";
        }

        return "error";
        
    }
    /**
     * @return {Number}
     */
    get state(){
        return this._stateId;
    }
    /**
     * @param {Number} value
     */
    set state(value){
        if(0 <= value && value <=4){
            this._stateId =value;
        }else{
            throw new Error(value+"はstateIdに設定できない数値です。");
        }
    }
    numberText(){
        return (setting.questIdDigitsText+this.id()).slice(-setting.questIdDigits);
    }

    isVisible(){
        return this._stateId > STATE_TABLE.hidden;
    }

    isHidden(){
        return this._stateId === STATE_TABLE.hidden;
    }
    isDisplayed(){
        return this._stateId ===STATE_TABLE.displayed;
    }
    isStarted(){
        return this._stateId ===STATE_TABLE.started;
    }
    isFinished(){
        return this._stateId===STATE_TABLE.finished;
    }

    hide(){
        this.state = STATE_TABLE.hidden;
    }

    start(){
        this.state =STATE_TABLE.started;
    }
    finish(){
        this.state = STATE_TABLE.finished;
    }
    fault(){
        this.state = STATE_TABLE.displayed;
    }


    iconNumber(){
        return 1;
    }
    /**
     * @return {String}
     */
    name(){
        if(this.isVisible()){
            return this.quest().name;
        }
        return setting.unknowQuestName;
    }

    /**
     * @return {Number}
     */
    hashedCode(){
        return this._hash;
    }


    /**
     * @return {Number}
     */
    id(){
        return this._questId;
    }
    isDataChanged(){
        const quest = this.quest();
        if(quest){
            const hash = getHash( quest.name);
            if(this._hash ===hash){
                return false;
            }
        }
        return true;
    }

    /**
     * @return {String[]}
     */
    message(){
        const quest = this.quest();
        if(this.isVisible()){
            return quest.message.displayed;
        }
        // if(this.isFinished()){
        //     return quest.message.finished;
        // }
        // if(this.isStarted()){
        //     return quest.message.started;        
        // }
        // if(this.isDisplayed()){
        //     return quest.message.displayed;
        // }
        return [];
    }

    /**
     * @return {Mano_QuestData}
     */
    quest(){
        return $dataQuests[this._questId];
    }

    rewardList(){
        const quest= this.quest();
        if(quest){
            return quest.reward;
        }
        return [];
    }

    /**
     * @param {Game_Interpreter} interpreter
     */
    gainReward(interpreter){
        const inter = new Mano_QuestRewardInterpreter();
        inter.setupById(this.id());
        inter.update();
        if(inter.isRunning()){
            interpreter._childInterpreter = inter;
        }
    }

    /**
     * @param {{type:string,id:Number,value:Number}} variant
     */
    static evalReward( variant){
        const func =(VariantItemFunction[variant.type]);
        if(func){
            func(variant);
        }
    }
}
window[Mano_Quest.name] =Mano_Quest;

/**
 * @return {Mano_Quest[]}
 */
function createQuestList(){

    const result =[];
    const length = $dataQuests.length;;
    for(var i =0;i <length;++i ){
        result.push(new Mano_Quest(i));
    }
    return result;
}

class Game_Quests{
    constructor(){
        this._list = createQuestList();
        this._selectedCategory = 0;
        this.setLastQuest(null);
        this.initialize();
    }
    initialize(){}

    /**
     * @param {Mano_Quest} quest 
     */
    setLastQuest(quest){
        if(this.questIdValid(quest)){
            this._lastQuestId = quest.id();
        }else{
            this._lastQuestId =-1;
        }
    }
    /**
     * @return {Mano_Quest}
     */
    getLastQuest(){
        return this._list[this._lastQuestId];
    }
    
    /**
     * @param {Mano_Quest} quest 
     */
    questIdValid(quest){
        if(quest){
            const id = quest.id();
            return (this._list[id] ===quest);
        }
        return false;
    }

    /**
     * @return {Map<Number,Mano_Quest>}
     * @description クエスト名をハッシュ化した数値をキーにしたMapにして返す
     */
    toMap(){
        const map = new Map(this._list.map(function(quest){
            return [quest.hashedCode(),quest];
        }));
        return map;
    }
    /**
     * @returns {Boolean}
     * @description クエストの再構築が必要かを返す
     * クエストの配置データが間違っているとtrueを返す
     */
    needRebuild(){
        for (const quest of this._list) {
            if(quest.isDataChanged() ){
                return true;
            }
            if(!this.questIdValid(quest)){
                return true;
            }
        }
        return false;
    }

    /**
     * @description クエストデータを再構築する。
     */
    rebuild(){
        const map = this.toMap();
        const length = $dataQuests.length;
        const newList =[];
        for(var i=0; i< length;++i){
            const questData = $dataQuests[i];
            const hash = getHash(questData.name);
            const questObject = map.get(hash);
            if(questObject){
                questObject._questId = i;
                newList.push(questObject);
                map.delete(hash);
            }else{
                newList.push( new Mano_Quest(i));
            }
        }
        this._list = newList;
    }
    onLoad(){
        if(this.needRebuild()){
            this.rebuild();
        }
        if(this._lastQuestId >= this._list.length ){
            this._lastQuestId = -1;
        }
    }

    /**
     * @return {Mano_Quest}
     * @param {Number} index 
     */
    get(index){
        return this._list[index];
    }
    length(){
        return this._list.length;
    }

    isHidden(id){
        const quest = this._list[id];
        return (!!quest) && quest.isHidden();
    }
    isDisplayed(id){
        const quest = this._list[id];
        return (!!quest) && quest.isDisplayed();
    }    
    isStarted(id){
        const quest = this._list[id];
        return (!!quest) && quest.isStarted();
    }
    isFinished(id){
        const quest = this._list[id];
        return (!!quest) && quest.isFinished();
    }

    /**
     * @param {Number} [state=undefined]
     * @return {Mano_Quest[]}
     * @description 特定の状態のクエストを返す。
     * 引数無しで呼び出した場合、全てのクエストを返す。
     * 引数はquest.stateと比較される
     */
    list(state){
        if(!state){
            return this._list;
        }
        return this._list.filter(function(quest){ return quest.state ===state; });
    }

    /**
     * @return {Mano_Quest[]}
     */
    startedList(){
        return this._list.filter(function(quest){
            return quest.isStarted();
         }); 
    }

    /**
     * @return {Mano_Quest[]}
     */
    finishedList(){
       return this._list.filter(function(quest){
           return quest.isFinished();
        });
    }

}
window[Game_Quests.name] = Game_Quests;

const DataManager_createGameObjects=DataManager.createGameObjects;    
DataManager.createGameObjects =function(){
    DataManager_createGameObjects.call(this);
    $gameQuests = new Game_Quests();
};

const DataManager_makeSaveContents=DataManager.makeSaveContents;
DataManager.makeSaveContents =function(){
   const contents = DataManager_makeSaveContents.call(this);
   contents.quest = $gameQuests;
   return contents;
};

const DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents =function(contents){
    DataManager_extractSaveContents.call(this,contents)
    const quest = contents.quest;
    if(quest){
        $gameQuests = quest;
        quest.onLoad();
    }
    //無くていい気はするけど、createGameObjectが上書きされた場合の対策
    if(!$gameQuests){
        $gameQuests = new Game_Quests();
    }
};

class Mano_QuestRewardInterpreter{
    constructor(){
        this.clear();
    }
    clear(){
        this._questId = 0;
        this._list = null;
        this._index = 0;
        this._childInterpreter = null;        
    }
    /**
     * @param {[]} list 
     */
    setList(list){
        this._list = list.clone();
        this._list.push({
            type:"event",
            id:setting.rewardEvent,
            value:list.length        
        });
    }
    /**
     * @param {Number} id 
     */
    setupById(id){
        const quest = $dataQuests[id];
        if(!quest){return;}

        this.clear();
        this._questId =id;
        this._index =0;
        this.setList(quest.reward);
        this._childInterpreter =null;
    }

    executeRewardEvent(reward){
        const callOk = this.callCommonEvent(reward.id);
        if(callOk){
            if(!!setting.eventParam){
                $gameVariables.setValue(setting.eventParam,reward.value);
            }
        }
    }
    /**
     * @return {Boolean}
     * @param {Number} eventId 
     */
    callCommonEvent(eventId){
        const event = $dataCommonEvents[eventId];
        if(!event){
            return false;
        }
        const inter = new Game_Interpreter();
        inter.setup(event.list);
        this._childInterpreter = inter;
        return true;
    }

    executeReward(){
        const reward = this._list[this._index];

        if(reward.type ==="event"){
            this.executeRewardEvent(reward);
        }else{
            Mano_Quest.evalReward(reward);
        }
        this._index++;
        if(this._index >= this._list.length){
            this._list =null;
        }
        return true;
    }

    updateChild(){
        if(this._childInterpreter){
            this._childInterpreter.update();
            if(this._childInterpreter.isRunning()){
                return true;
            }else{
                this._childInterpreter = null;
            }
        }
        return false;
    }
    update(){
        while(this.isRunning()){
            if(this.updateChild()){
                break;
            }
            if(SceneManager.isSceneChanging() ){
                break;
            }
            if(!this.executeReward()){
                break;
            }
        }
    }
    isRunning(){
        return (!!this._list);
    }
}
window[Mano_QuestRewardInterpreter.name] = Mano_QuestRewardInterpreter;

/**
 * @param {String} mode 
 * @param {Mano_Quest} quest
 * @param {Game_Interpreter} interpreter
 */
function QuestPluginCommand(mode,quest,interpreter){
    if(quest){
        switch(mode){
            case "reward":
            quest.gainReward(interpreter);
            break;


            case "start":
            quest.start();
            break;
            case "finish":
            quest.finish();
            break;
            case "hide":
            quest.hide();
            break;
            case "fault":
            quest.fault();
            break;
        }
    }
}

const Game_Interpreter_pluginCommand =Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand =function(name,args){
    if(name ==='Quest'){

        const quest =$gameQuests.get(Number(args[1]))
        QuestPluginCommand(args[0],quest,this);
        return;
    }
    Game_Interpreter_pluginCommand.call(this,name,args);
};

class Widnow_QuestInfoBase  extends Window_Selectable{
    baseWidth(){
        return Graphics.boxWidth *7/10;
    }
    onQuestChange(){
        this.refresh();
    }

    update(){}
    updateBase(){
        super.update();
    }

    questNullable(){
        return false;
    }
    /** 
     * @param {Mano_Quest} quest
    */
    setQuest(quest){
        const needRefresh = this._quest !==quest;
        this._quest =quest;
        if(needRefresh){
            this.onQuestChange();
        }
    }
};

class Widnow_QuestList extends Window_Selectable{
    static width(){
        return Graphics.boxWidth*3/10;
    }
    constructor(x,y){
        super(x,y);
    }
    initialize(x,y){
        this._categoryId = NaN;
        /**
         * @type {Mano_Quest[]}
         */
        this._list=[];
        /**
         * @type {Widnow_QuestInfoBase[]}
         */
        this._questChangeListener=[];
        const width = Widnow_QuestList.width();
        const height = this.fittingHeight(setting.listRows);
        super.initialize(x,y,width,height);
    }
    maxItems(){
       return this._list.length;
    }

    /**
     * @return {Game_Quests}
     */
    get gameQuests(){
        return $gameQuests;
    }
    isCurrentItemEnabled(){
        return !!this.currentQuest();
    }
    
    /**
     * @param {Number} stateId 
     */
    setStateId(stateId){
        if(stateId !== this._categoryId){
            this._categoryId = stateId;
            this._list = this.gameQuests.list(stateId);
            this.refresh();
            this.resetScroll();
        }
    }
    drawItem(index){
        const quest = this.quest(index);
        this.changeTextColor(this.questColor(quest));
        const rect = this.itemRectForText(index);        
        this.drawText(quest.name(),rect.x,rect.y,rect.width);
    }
    /**
     * @return {Mano_Quest}
     */
    quest(index){
        return this._list[index];
    }
    currentQuest(){
        return this.quest(this._index);
    }
    /**
     * @param {Mano_Quest} quest
     */
    questColor(quest){
        return this.normalColor();
    }
    /**
     * @param {Widnow_QuestInfoBase} listener 
     */
    addQuestChangeListener(listener){
        if(listener.setQuest){
            this._questChangeListener.push(listener);
        }
    }
    /**
     * @param {Mano_Quest} quest 
     */
    indexOf(quest){
        return this._list.indexOf(quest);
    }

    selectLast(){
        const index = this.indexOf(this.gameQuests.getLastQuest());
        if(index ===-1){
            this.select(0 )
        }else{
            this.select(index);
        }
    }
    saveLastQuest(){
        this.gameQuests.setLastQuest(this.currentQuest());
    }
    deselect(){
        this.select(-1);
        this.updateHelp();
    }

    updateHelp(){
        const quest = this.currentQuest();
        for (const listener of this._questChangeListener) {
            listener.setQuest(quest);
        }
    }

    callUpdateHelp(){
        if(this.active){
            this.updateHelp();
        }
    }
    redrawCurrentItem(){
        super.redrawCurrentItem();
        for(const lisner of this._questChangeListener){
            lisner.onQuestChange();
        }
    }
}

class Widnow_QuestName extends Widnow_QuestInfoBase{

    initialize(x,y){
        super.initialize(x,y,this.baseWidth(),this.fittingHeight(2));
    }

    nameText(){
       return this._quest.numberText() + ":" +this._quest.name();
    }
    requesterText(){
        if(this._quest.isVisible()){
            return this._quest.quest().requester;
        }
        return "";
    }

    drawAllItems()
    {
        if(!this._quest){return;}

        const data = this._quest.quest();
        if(data){
            this.drawText( this.nameText(),this.textPadding(),0);
            this.drawText(this.requesterText(),this.textPadding(),this.lineHeight());   
        }
    }
}

class Widnow_QuestReward extends Widnow_QuestInfoBase{
    initialize(x,y){
        const height = this.fittingHeight(setting.rewardRows);
        const width = this.baseWidth();
        this._list =[];
        super.initialize(x,y,width,height);
    }
    update(){
        this.updateBase();
    }
    maxItems(){
        return this._list.length;
    }
    onQuestChange(){
        if(this._quest && this._quest.isVisible()){
            this._list = this._quest.rewardList();
        }else{
            this._list =[];
        }
        this.refresh();
    }
    /**
     * @param {String} text 
     * @param {Number} value 
     * @param {Rectangle} rect 
     */
    drawTextAndValue(text,value,rect){
        const numberWidth = this.textWidth("123456");
        this.drawText(text,rect.x,rect.y,rect.width - numberWidth);
        this.drawNumber(value,rect.x + rect.width -numberWidth ,rect.y,numberWidth);
    }

    /**
     * @param {RPG.Item} item 
     * @param {Number} value 
     * @param {Rectangle} rect 
     */
    drawGameItem(item,value,rect){
        const nuberWidth = this.textWidth('00');
        this.drawItemName(item,rect.x,rect.y,rect.width - nuberWidth);
        this.drawNumber(value, rect.x,rect.y,rect.width );
    }

    /**
     * @param {Number} value 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} width 
     */
    drawNumber(value ,x,y,width){
        this.drawText(value,x,y,width,"right");
    }
    /**
     * @param {Number} value 
     * @param {Rectangle} rect 
     */
    drawGold(value,rect){
        const text = setting.goldFormat.format(value,TextManager.currencyUnit);
        this.drawText(text,rect.x,rect.y,rect.width,"right");
        this.drawText(setting.goldText,rect.x,rect.y,rect.width);
    }


    drawItem(index){
        const item = this.item(index);
        const rect = this.itemRectForText(index);
        switch (item.type) {
            case "gold":
                this.drawGold(item.value,rect);
                break;
            case "item":
                this.drawGameItem($dataItems[item.id],item.value,rect);
                break;
            case "weapon":
                this.drawGameItem($dataWeapons[item.id],item.value,rect);
                break;
            case "armor":
                this.drawGameItem($dataArmors[item.id],item.value,rect);
                break;
            case "variable":
                this.drawTextAndValue( $dataSystem.variables[item.id],item.value,rect );
                break;
            case "event":
                this.drawTextAndValue( $dataCommonEvents[item.id].name,item.value,rect );                
                break;
        }
    }

    /**
     * @return {{type:string,id:Number,value:Number}}
     * @param {Number} index 
     */
    item(index){
        return this._list[index];
    }
    maxCols(){
        return 2;
    }
};
class Widnow_QuestMessage　extends Widnow_QuestInfoBase{

    initialize(x,y){
        this._message =[];
        const width = this.baseWidth(); 
        const height = this.fittingHeight(setting.messageRows);
        super.initialize(x,y,width,height);
    }

    /**
     * @param {String[]} message 
     */
    setMassage(message){
        this._message=message;
    }

    maxItems(){
        return this._message.length;
    }

    drawItem(index){
        const x = this.textPadding();
        const y = this.lineHeight() * index;
        const text = this._message[index];
        this.drawTextEx(text,x,y);
    }

    onQuestChange(){

        if(this._quest){
            this.setMassage(this._quest.message());
        }else{
            this.setMassage([]);
        }
        this.refresh();

    }
}
class Widnow_QuestParameter extends Widnow_QuestInfoBase{

    initialize(x,y){
        const width = this.baseWidth();
        const height = this.fittingHeight(setting.parameterRows);
        super.initialize(x,y,width,height);
    }
    style(index){
        return setting.infoList[index];
    }
    maxItems(){
        return setting.infoList.length;
    }

    drawItem(index){
    }
    maxCols(){
        return 2;
    }
}

class Window_QuestCommand extends Window_Command{
    
    initialize(){
        const x = Graphics.boxWidth /2;
        const y = Graphics.boxHeight *0.3;
        const width = 400;
        const height = this.fittingHeight(4);
        super.initialize(x,y,width,height);
        this.setQuest(null);
        this.openness=0;
    }
    makeCommandList(){
        //メモ　クエストの状態に応じて切り替える機能
        //受注したり取り消したり
        this.addCommand("受注する","accept");
        this.addCommand("リタイアする","retire");
        this.addCommand("やめる","cancel");
    }
    open(){
        this.select(0);
        this.refresh();
        super.open();
    }

    setRetierHandler(handler){
        this.setHandler("retire",handler);
    }
    setAcceptHandler(handler){
        this.setHandler("accept",handler);
    }
    setCancelHandler(handler){
        this.setHandler("cancel",handler);
    }
    /**
     * @param {Mano_Quest} quest 
     */
    setQuest(quest ){
        this._quest =quest;
    }
};

class Window_QuestFilter extends Window_Selectable{
    windowWidth(){
        return Widnow_QuestList.width();
    }
    windowHeight(){
        return this.lineHeight()*3;
    }
    initialize(x,y){
        const width = this.windowWidth();
        const height = this.windowHeight();
        this._list =[];
        super.initialize(x,y,width,height);
        this.makeItemList();
        this._index=0;
        this.refresh();
    }

    makeItemList(){
        this._list =[];
        for(const item of setting.filterList){
            this.addItem(item.name,item.stateId);
        }
    }
    /**
     * @param {String} text 
     * @param {Number} stateId 
     */
    addItem(text,stateId){
        this._list.push({
            text:text,
            stateId:stateId
        });
    }

    drawItem(index){
        const rect = this.itemRectForText(index);
        const text = this._list[index].text;
        this.drawText( text,rect.x,rect.y,rect.width );
    }
    maxItems(){
        return this._list.length;
    }
    maxCols(){
        return 2;
    }

    callUpdateHelp(){
        if(this.active &&this._selectWindow){
            this.resetState();
        }
    }
    resetState(){
        const item = this._list[this._index];
        if(item){
            this._selectWindow.setStateId(item.stateId);
        }
    }
    /**
     * 
     * @param {Widnow_QuestList} window 
     */
    setQuestListWindow(window){
        this._selectWindow = window;
    }

    processOk(){
        const item = this._list[this._index];
        if(item.stateId===-1){
            this.processCancel();
        }else{
            super.processOk();
        }
    }
};

class Scene_Quest extends Scene_Base{    
    create(){
        super.create();
        this.createWindowLayer();
        this.createAllWidnows();
    }
    createWindowLayer(){
        super.createWindowLayer();
        const info = new Sprite();
        this._infoWindowsLayer =info;
        this._windowLayer.addChild(info);
        this._lastInfoY=0;
    }
    updateInterpreter(){    }

    updateEventMessage(){
        if($gameMessage.hasText()){
            this._eventMessageWindow.activate();
        }
    }
    update(){

        super.update();
    }
    /**
     * @return {Number}
     */
    infoX(){
        return this._selectWindow.x + this._selectWindow._width;
    }
    /**
     * @return {Number}
     */
    infoY(){
        return this._lastInfoY;
    }
    /**
     * @param {Widnow_QuestInfoBase} window 
     */
    addInfoWindow(window){
        this.addWindow(window);
        this._selectWindow.addQuestChangeListener(window);
        this._lastInfoY = window.y + window.height;
    }

    createFilterWindow(){
        const window = new Window_QuestFilter(0,0);
        this._filterWindow =window;
        window.setHandler("ok",this.onFilterOk.bind(this));
        window.setHandler("cancel",this.onFilterCancel.bind(this));
        this.addWindow(window);
    }
    onFilterOk(){
        this._selectWindow.selectLast();
        this._selectWindow.activate();
    }
    onFilterCancel(){
        this.popScene();
    }

    createQuestSelectWindow(){
        const x = this._filterWindow ? this._filterWindow.x : 0;
        const y = this._filterWindow ? this._filterWindow.y + this._filterWindow.height : 0;

        const window =new Widnow_QuestList(x,y,100,800);
//        window.setHandler("ok",this.onSelectOk.bind(this));
        window.setHandler("cancel",this.onSelectCancel.bind(this));
        this._selectWindow =window;
        this.addWindow(window);
        this._filterWindow.setQuestListWindow(window);
    }
    onSelectOk(){
        this._commandWindow.activate();
        this._commandWindow.open();
    }

    onSelectCancel(){
        this._selectWindow.saveLastQuest();
        this._selectWindow.deselect();
        this._filterWindow.activate();
    }
    createRewardWindow(){
        const x = this.infoX();
        const y = this.infoY();
        const window = new Widnow_QuestReward(x,y);
        window.setHandler("cancel",this.onRewardCancel.bind(this));
        this._rewardWindow =window;
        this.addInfoWindow(window);
    }

    onRewardCancel(){
        this._rewardWindow.deselect();
        this._selectWindow.activate();
    }
    createParameterWindow(){
        const x = this.infoX();
        const y = this.infoY();
        const window = new Widnow_QuestParameter(x,y);
        this._parameterWindow=window;
        this.addInfoWindow(window);
    }

    createNameWindow(){
        const window = new Widnow_QuestName(this.infoX(),this.infoY());
        this._nameWindow =window;
        this.addInfoWindow(window);
    }

    createMessageWindow(){
        const x = this.infoX();
        const y = this.infoY();
        const window = new Widnow_QuestMessage(x,y);
        this._questMessageWindow= window;
        this.addInfoWindow(window);
    }

    createEventMessageWindow(){
        const window = new Window_Message();
        this._eventMessageWindow = window;
        this.addWindow(window);
    }

    createCommandWindow(){
        const _this=this;
        const window = new Window_QuestCommand();
        window.setCancelHandler(function(){
            window.close();
            _this._selectWindow.activate();
        });
        this._commandWindow =window;
        this.addWindow(window);
    }

    activateFirstWindow(){
        this._filterWindow.select(0);
        this._filterWindow.resetState();
        this._filterWindow.activate();
    }

    createAllWidnows(){

        this.createFilterWindow();
        this.createQuestSelectWindow();
        this.createNameWindow();
        this.createRewardWindow();
        this.createMessageWindow();
//        this.createEventMessageWindow();
//        this.createCommandWindow();

        this.activateFirstWindow();
    }
};

class Window_QuestStateEdit extends Window_Selectable{

    initialize(x,y){
        this.makeItemList();
        super.initialize(x,y,200,this.fittingHeight(this._list.length));
        this.refresh();
    }
    makeItemList(){
        this._list=[];
        this.addItem("start",STATE_TABLE.started);
        this.addItem("hide",STATE_TABLE.hidden);
        this.addItem("finish",STATE_TABLE.finished);
        this.addItem("none",STATE_TABLE.none);
    }
    maxItems(){
        return this._list.length;
    }
    /**
     * @returns {Number}
     */
    value(){
        return this._list[this._index].value;
    }
    /**
     * @param {Mano_Quest} quest 
     */
    selectOf(quest){
        const len =this._list.length;
        for(var i=0; i<len;++i){
            if(quest.state === this._list[i].value){
                this.select(i);
                return;
            }
        }
        this.select(0);
    }

    /**
     * 
     * @param {String} text 
     * @param {Number} value 
     */
    addItem(text,value){
        this._list.push({
            text:text,
            value:value
        });
    }

    drawItem(index){
        const item = this._list[index];
        if(item){
            const rect = this.itemRectForText(index);
            this.drawText(item.text,rect.x,rect.y,rect.width);
        }
    }
}

//　デバッグ用　クエストの状態を書き換える機能がついている
class Scene_QuestDebug extends Scene_Quest{

    createAllWidnows(){
        super.createAllWidnows();
        this.createStateEditWindow();
    }

    createStateEditWindow(){
        const window = new Window_QuestStateEdit(Graphics.boxWidth/2,Graphics.boxHeight/2);
        window.setHandler("ok",this.onStateEditOk.bind(this));
        window.setHandler("cancel",this.onStateEditCancel.bind(this));
        window.hide();
        this._stateEditWindow =window;
        this.addWindow(window);
    }
    onStateEditOk(){
        const quest = this._selectWindow.currentQuest();
        quest.state= this._stateEditWindow.value();
        this._selectWindow.redrawCurrentItem();
        this._stateEditWindow.hide();
        this._selectWindow.activate();
    }
    onStateEditCancel(){
        this._stateEditWindow.hide();
        this._stateEditWindow.deselect();
        this._selectWindow.activate();
    }

    createQuestSelectWindow(){
        super.createQuestSelectWindow();
        this._selectWindow.setHandler("ok",this.onSelectDebug.bind(this));
    }
    onSelectDebug(){
        const quest = this._selectWindow.currentQuest();
        if(!!quest){
            this._stateEditWindow.activate();
            this._stateEditWindow.show();        
            this._stateEditWindow.selectOf(quest);
        }
    }
}

const DataManager_loadDatabase=DataManager.loadDatabase;
DataManager.loadDatabase = function(){
    this.loadDataFile("$dataQuests","Quest.json");
    DataManager_loadDatabase.call(this);
};

function pushMyScene(){
    if(setting.debugMode){
        SceneManager.push(Scene_QuestDebug);
    }else{
        SceneManager.push(Scene_Quest);
    }
}

const Scene_Menu_createCommandWindow= Scene_Menu.prototype.createCommandWindow;
Scene_Menu.prototype.createCommandWindow=function(){
    Scene_Menu_createCommandWindow.call(this);
    this._commandWindow.setHandler('QuestMA',pushMyScene);
};

const Window_MenuCommand_addOriginalCommands=  Window_MenuCommand.prototype.addOriginalCommands;
Window_MenuCommand.prototype.addOriginalCommands =function(){
   Window_MenuCommand_addOriginalCommands.call(this);
   const enabled = setting.commandEnabledSwitch ==0 || $gameSwitches.value(setting.commandEnabledSwitch);
   this.addCommand(setting.commandName,'QuestMA',enabled);
};

SceneManager.pushQuestScene =function(){
    pushMyScene();
};

return {
    Scene : Scene_Quest,
    Window_QuestName : Widnow_QuestName,
    Widnow_QuestList : Widnow_QuestList,
    Window_QuestParameter : Widnow_QuestParameter,
    Window_QuestFilter:Window_QuestFilter,
    Widnow_QuestMessage : Widnow_QuestMessage,
    Widnow_QuestInfoBase : Widnow_QuestInfoBase,
    Widnow_QuestReward : Widnow_QuestReward
};

})();
