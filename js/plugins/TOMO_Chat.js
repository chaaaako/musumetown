//=============================================================================
// TOMO_Chat.js
// このプラグインはOnlineAvatar.jsを参考にさせて頂きました。
// ありがとうございます。
/* 必要なプラグイン
今のところなし
// ----------------------------------------------------------------------------
// （これ以前の更新履歴は記録していません）
// 2016/10/25 スイッチ・変数同期時、ツクール上とサーバー上でデータが食い違う不具合を修正しました
// 2016/11/09 同じマップへの場所移動時、アバターが分身するのを修正しました
// 2016/11/14 イベント動的生成プラグイン(EventReSpawn.js)との競合対策
//=============================================================================

/*:
 * @plugindesc Firebaseを使ってオンラインでの戦闘やバザーを行うために必要なプラグインです
 * @author よしだとものり
 *
 * @param apiKey
 * @desc FirebaseのapiKey。各自コピペしてきてね
 * @default xxxxxx
 *
 * @param authDomain
 * @desc FirebaseのauthDomain。各自コピペしてきてね
 * @default xxxxxx
 *
 * @param databaseURL
 * @desc FirebaseのdatabaseURL。各自コピペしてきてね
 * @default xxxxxx

 * @param projectId
 * @desc FirebaseのapiKey。各自コピペしてきてね
 * @default xxxxxx
 *
 * @param storageBucket
 * @desc FirebaseのauthDomain。各自コピペしてきてね
 * @default xxxxxx
 *
 * @param messagingSenderId
 * @desc FirebaseのdatabaseURL。各自コピペしてきてね
 * @default xxxxxx
 *
 * @help
 * 外部のBaaSであるFirebaseと連携して、オンラインゲームを実現するための
 * プラグインです。
 * 
 * 始め方：
 * １．Firebaseの公式サイト(https://console.firebase.google.com/)で、
 * 　　Googleアカウントを(持って無ければ)取得し、「新規プロジェクトを作成」する
 * ２．「ウェブアプリにFirebaseを追加」ボタンを押して
 * 　　apiKey、authDomain、databaseURLをプラグインのパラメータにコピペ
 * ３．左メニューから「Auth」→上部から「ログイン方法」→「匿名」を有効にする
 * ４．ゲームを多重起動すると、すべてのプレイヤーのアバターが画面に表示されます！
 * ※テストプレイボタンからは多重起動できないので、Firefoxからindex.htmlを開く
 * ５．データベース→ルールからルールを以下のように変更（ルールのエディタで全て選択して貼り付けて下さい

{
    "rules": {
            ".read": true,
            ".write": true,
    }
}


 * ！注意！
 * 多くの投稿サイトでは安全のためContent Security Policyという機能により
 * Firebaseへのオンライン通信が制限されています。
 * もしあなたがこのプラグインを使ったゲームを投稿する予定がある場合は、
 * その投稿先でこのプラグインが使えるかどうか必ず先に確かめておいてください！
 * 

 * ------チャット導入----------
 * プラグインコマンド
 * 
 	通信の初期化（まず最初に呼び出す）
	firebase_init
　　read_chat 定期的に呼びます。チャットデータの監視

　最初にtest_create_chatを呼びます
　これでデータベースに空のデータを作ります。
	作るときはMaxChatを変更してからお願いします。
　MaxChatがチャットの最大件数です。古いやつから上書きされます。

　あとはItemBook open　でチャット画面を開きます。
　必要なプラグインは私が修正したItemBookと111_InputFormとそのＣＳＳです。

　itembookの
    Window_ItemBookIndex.prototype.maxItems = function() {
        return this._list ? 5 : 0;
    };
　の5がMaxChat

    Window_ItemBookIndex.prototype.refresh = function() {
		var i, item;
		this._list = $gameVariables.value(6);
		
		this.createContents();
		this.drawAllItems();
    };
	の６がデータ受け渡しです。重複する場合はFireBase_toScript_Noと一緒に変えて下さい。

  チャットの書き込みはInputForm x=350;y=200;v=11;」を呼び出し
	変数11が０以外の時はadd_chatを呼んでください
--------------------------------------------------
 * ライセンス：
 * 改変自由


//オンラインのユーザIDを管理する変数の番号、変更するときはここを
var userIdVariableNo=1;
//↓はスイッチと変数の両方で使用、重複の時は変更（ただし起動時に変更したスイッチはOFFにすること
var FireBase_return_No=2;

var FireBase_toPlugin_No=3;

var FireBase_toScript_No=6;
var FireBase_toPlugin_No2=11;

//ゲームチャット機能
var room_no=0;
var MaxChat=5;
var MaxRoom=3;
var chat_name=[];
var chat_fname=[];
var chat_fno=[];
var chat_msg=[];
var chat_msec1=[];
var chat_isread=[];
var chat_key=[];
var chat_dat=[];


*/

var TOMO_FireBase_url='https://www.gstatic.com/firebasejs/4.3.1/firebase.js';
var TOMO_FireBase_url2='https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js';
//オンラインバトル用変数



for(var i=0;i<MaxRoom;i++){
	chat_name[i]=[];
	chat_fname[i]=[];
	chat_fno[i]=[];
	chat_isread[i]=[];
	chat_msg[i]=[];
	chat_msec1[i]=[];
	chat_key[i]=[];
	chat_dat[i]=[];
	for(var j=0;j<MaxChat;j++){
		chat_name[i][j]='あああ';
		chat_fname[i][j]='あああ';
		chat_fno[i][j]=0;
		chat_isread[i][j]=0;
		chat_msg[i][j]='あああ';
		chat_msec1[i][j]=0;
		chat_key[i][j]=0;
		chat_dat[i][j]='あああ';
	}
}



(function() {
function test4(){
console.log(" 通信成功3");

}
// battle_num→
// hp1→ボスのHP、いないボスは0
// 多分グループの左端から hp1→hp2→hp3→hp4だと思うけど分からない
// 自動で空いたロビーを探して新しくロビーを作る
// ロビーへの参加ではない
/*　仕様的にはボスのHPはデータベースで設定するが
　　こちらにも同じ設定が必要です。
　　battle_numはボスのグループを区別するのに必要ですが
　　０から始まる連番をお願いします。

*/

function init2_err(errmsg){


}

function loadScript(src, callback) {
    var done = false;
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = src;
    head.appendChild(script);
    // Attach handlers for all browsers
    script.onload = script.onreadystatechange = function() {
        if ( !done && (!this.readyState ||
                this.readyState === "loaded" || this.readyState === "complete") ) {
            done = true;
            callback();
            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            if ( head && script.parentNode ) {
                head.removeChild( script );
            }
        }
    };
}

function TOMO_FireBase_start(){
loadScript(TOMO_FireBase_url2, test4);
console.log(" 通信成功2");
test2();

}

function TOMO_FireBase_init2(){
	var ps = PluginManager.parameters('TOMO_FireBase');
	var config = {
		apiKey: ps['apiKey'],
		authDomain: ps['authDomain'],
		databaseURL: ps['databaseURL'],
		projectId: ps['projectId'],
		storageBucket: ps['storageBucket'],
		messagingSenderId: ps['messagingSenderId']
	};
	try {
		firebase.initializeApp(config);
		console.log(" 通信成功");
		
	} catch(e) {
		
		throw new Error('（ ' + e + '） apiKeyが正しく設定されていません。ご確認ください。');
	}


	firebase.auth().signInAnonymously().then(TOMO_FireBase_start).catch(init2_err);
	//jquery
	

}





function check_msec(msec1){
	for(var i=0;i<MaxChat;i++){
		if(msec1==chat_msec1[room_no][i]){
			//console.log(msec1 + " " + chat_msec1[room_no][i]);
			return false;
		}
	}
	return true;
}
function make_dat(ikey1){
	var sd=new Date(chat_msec1[room_no][ikey1]);
	sd="(" + sd.getDate() + ")" + sd.getHours() + ":" + sd.getMinutes() + ":" + sd.getSeconds();
	var sname=chat_name[room_no][ikey1];
	var smsg=chat_msg[room_no][ikey1];
	chat_dat[room_no][ikey1]=sd + " " + sname + " " + smsg;
}
function read_chat(){
	console.log("　　　　　　　　　　");
  //return new Promise(function(resolve, reject){
			var ikey;
			try {
				var dbval;
			
				ref=firebase.database().ref('online_chat' + room_no + '_lobby');

				ref.on('child_added', function(data) {

					dbval= data.val();
					ikey=data.key;
					if(check_msec(dbval.msec1)){
						chat_name[room_no][ikey]=dbval.name1;
						chat_fname[room_no][ikey]=dbval.fname;
						chat_fno[room_no][ikey]=dbval.fno;
						chat_msg[room_no][ikey]=dbval.msg1;
						chat_msec1[room_no][ikey]=dbval.msec1;
						chat_isread[room_no][ikey]=0;
						chat_key[room_no][ikey]=ikey;
						make_dat(ikey);
						
					//show_chat(ikey);
					}
				});
				ref.on('child_changed', function(data) {
					dbval= data.val();
						ikey=data.key;
					if(check_msec(dbval.msec1)){

						chat_name[room_no][ikey]=dbval.name1;
						chat_fname[room_no][ikey]=dbval.fname;
						chat_fno[room_no][ikey]=dbval.fno;
						chat_msg[room_no][ikey]=dbval.msg1;
						chat_msec1[room_no][ikey]=dbval.msec1;
						chat_isread[room_no][ikey]=0;
						chat_key[room_no][ikey]=ikey;
						make_dat(ikey);
						
					//show_chat(ikey);
					}
				});
			insort();
			
			$gameVariables.setValue(FireBase_toScript_No,chat_dat);

			//	resolve(1);
					
			} catch(e) {
				
				throw new Error('（ ' + e + '） apiKeyが正しく設定されていません。ご確認ください。');
		//		reject(0);
			}

//	  });

}
var wchat_name;
var wchat_fname;
var wchat_fno;
var wchat_msg;
var wchat_msec1;
var wchat_key;
var wchat_dat;
function swapchat(pnum1){

	wchat_name=chat_name[room_no][pnum1];
	wchat_fname=chat_fname[room_no][pnum1];
	wchat_fno=chat_fno[room_no][pnum1];
	wchat_msg=chat_msg[room_no][pnum1];
	wchat_msec1=chat_msec1[room_no][pnum1];
	wchat_key=chat_key[room_no][pnum1];
	wchat_dat=chat_dat[room_no][pnum1];
}
function swapchat2(pnum1){

	chat_name[room_no][pnum1]=wchat_name;
	chat_fname[room_no][pnum1]=wchat_fname;
	chat_fno[room_no][pnum1]=wchat_fno;
	chat_msg[room_no][pnum1]=wchat_msg;
	chat_msec1[room_no][pnum1]=wchat_msec1;
	chat_key[room_no][pnum1]=wchat_key;
	chat_dat[room_no][pnum1]=wchat_dat;
}
function swapchat3(pnum1,pnum2){

	chat_name[room_no][pnum1]=chat_name[room_no][pnum2];
	chat_fname[room_no][pnum1]=chat_fname[room_no][pnum2];
	chat_fno[room_no][pnum1]=chat_fno[room_no][pnum2];
	chat_msg[room_no][pnum1]=chat_msg[room_no][pnum2];
	chat_msec1[room_no][pnum1]=chat_msec1[room_no][pnum2];
	chat_key[room_no][pnum1]=chat_key[room_no][pnum2];
	chat_dat[room_no][pnum1]=chat_dat[room_no][pnum2];
}
function insort(){


for(var i = 1; i<MaxChat; i++){
    //「挿入する値」を変数に一時保存する
	var tmp = chat_msec1[room_no][i];
	swapchat(i);

    //「整列済みの部分」のどこに挿入すれば良いか後ろから前に向かって順番に判断する
		for(var j = i-1; j>=0; j--){
        //「挿入する値」が小さい場合、調べた値を１つ後ろへずらす
			if(chat_msec1[room_no][j]>tmp){
				swapchat3(j+1,j);
			}else{
            //小さくなければ、ずらす処理を止める
				break;
			}
		}
    //ずらす処理が終わったところに「挿入する値」を入れる
    	swapchat2(j+1);
	}

}
function add_chat(){
	var tmtmp = new Date();
	tmtmp=tmtmp.getTime();
	var id=$gameParty.members()[0]; 
	var fname=id._faceName;
	var fno=id._faceIndex;
	var name1=id._name;


	var msg1=$gameVariables.value(FireBase_toPlugin_No2);	
	var min1=chat_msec1[room_no][0];
	var key1=chat_key[room_no][0];
	for(var i=1;i<MaxChat;i++){

		if(chat_msec1[room_no][i]<min1){
			min1=chat_msec1[room_no][i];
			key1=chat_key[room_no][i];
		}
	}

	var postData = {
		name1:name1,
		fname:fname,
		fno:fno,
		msec1:tmtmp,
		msg1:msg1

	};
	ref=firebase.database().ref("/online_chat" + 0 + "_lobby/"+key1).update(postData);

}
function test_create_chat(){
	
	var postData;

	for(var i=0;i<MaxChat;i++){
		postData = {
			name1:"　　　",
			fname:"　　　",
			fno:0,
			msec1:i,
			msg1:"　　　"

		};
		ref=firebase.database().ref("/online_chat" + room_no + "_lobby/"+i).set(postData);
	}
}
TOMO_FireBase_init();

function TOMO_FireBase_init(){
	//firebase初期化
	loadScript(TOMO_FireBase_url, TOMO_FireBase_init2)
}

	const _Game_Interpreter_pluginCommand2 = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		_Game_Interpreter_pluginCommand2.call(this, command, args);



        if(command === 'ID_INIT'){
				

        }
		if (command === 'firebase_init') {
			//firebase初期化

			TOMO_FireBase_init();
		}




		if(command=='test_create_battle'){
			test_create_battle();
		}
		if(command=='add_chat'){
			add_chat();
		}
		if(command=='read_chat'){
			read_chat();
		}

		if(command=='test_create_chat'){
			test_create_chat();
		}

    }
})();
