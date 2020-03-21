//===============================================================================
// RecoverHalf.js
//===============================================================================
// Copyright (c) 2019 YouChalice
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ------------------------------------------------------------------------------
// Version
// 1.0.0 2019/2/19 初版公開。
// ------------------------------------------------------------------------------
// [Twitter] https://twitter.com/YouChalice/
//     [Web] http://benika.webcrow.jp/
//===============================================================================

/*:
 * @plugindesc HPMP半回復プラグイン
 * @author ゆう(YouChalice)
 *
 * @help プラグインコマンドを使ってHP、MPの半分回復を実装させるプラグインです。
 *【プラグインコマンド】
 *
 * ●全員のHPとMP両方を半分回復
 * 
 * 	RecoverHalf
 *
 * ●全員のHPだけ半分回復
 * 
 *	RecoverHalfHP
 *
 * ●全員のMPだけ半分回復
 *
 *	RecoverHalfMP
 *
 * 利用規約：
 *  年齢指定、商用問わず、どんな作品にもご自由にお使いいただけます。
 *	改変もご自由に。
 *  クレジット表記も必要ありません。
 *  
 */

(function() {
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function( command ) {
  	_Game_Interpreter_pluginCommand.call( this, command );
	if( command === 'RecoverHalf' ) {
   	 for (i=0;i<$gameParty.size();i++){
    	 this.changeHp($gameActors.actor($gameParty._actors[i]),eval($gameActors.actor($gameParty._actors[i]).param(0)/2) , false);
		 $gameActors.actor($gameParty._actors[i]).gainMp(eval($gameActors.actor($gameParty._actors[i]).param(1)/2));
 	  	}
	  }
	if( command === 'RecoverHalfHP' ) {
   	 for (i=0;i<$gameParty.size();i++){
    	 this.changeHp($gameActors.actor($gameParty._actors[i]),eval($gameActors.actor($gameParty._actors[i]).param(0)/2) , false);
 	  	}
	  }
	if( command === 'RecoverHalfMP' ) {
   	 for (i=0;i<$gameParty.size();i++){
    	  $gameActors.actor($gameParty._actors[i]).gainMp(eval($gameActors.actor($gameParty._actors[i]).param(1)/2));
 	  	}
	  }
	}
})();
