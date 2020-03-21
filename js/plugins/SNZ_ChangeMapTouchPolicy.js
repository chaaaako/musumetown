//=============================================================================
// SNZ_ChangeMapTouchPolicy.js
// ----------------------------------------------------------------------------
// Copyright (c) 2017 Shinzo & 2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2017/12/10 リリース
//=============================================================================

/*:
@plugindesc Changes policy of 'map touch' like 'Animal crossing: pocket camp'.
@author Shinzo & triacontane

This plugin is released under the MIT License.
 */
/*:ja
 @plugindesc マップタッチ仕様変更プラグイン「ポケ森」ふうVer.
 @author しんぞ・トリアコンタン様

 @help
トリアコンタン様のChangeMapTouchPolicy.jsを改変したものです。
タッチ・クリック時のマップ移動操作を
「どうぶつの森ポケットキャンプ」風にします。

すなわち
一度タッチ：
　タッチした場所に移動し、その場を調べます（デフォルトと同じ）。
長押し：
　長押ししている間、指（ポインター）の方向に歩き続けます。
　指を離すと歩くのをやめます。

このプラグインは、
トリアコンタン様のChangeMapTouchPolicy.jsを改変したものです。
MITライセンスとします。使用改変再配布ご自由にどうぞ。

 */
(function () {
    var pluginName = 'SNZ_ChangeMapTouchPolicy';


    //=============================================================================
    // Game_Temp
    //  移動開始フラグを追加定義します。
    //=============================================================================
    var _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._moveStart = false;
    };

    //=============================================================================
    // Scene_Map
    //  マップタッチの挙動を変更します。
    //=============================================================================
    var _Scene_Map_isMapTouchOk = Scene_Map.prototype.isMapTouchOk;
    Scene_Map.prototype.isMapTouchOk = function() {
        var result = $gameSystem._mapTouchPolicy !== 1 && _Scene_Map_isMapTouchOk.call(this);
        if (!result) $gameTemp._moveStart = false;
        return result;
    };

    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
      if (TouchInput.isLongPressed()) {
        this.processMapTouchLevel2();
      } else {
        _Scene_Map_processMapTouch.call(this);
      }
    };

    Scene_Map.prototype.processMapTouchLevel2 = function() {
        if (TouchInput.isTriggered() || TouchInput.isLongPressed()) {
            var px = $gamePlayer.x;
            var py = $gamePlayer.y;
            var deltaX = $gameMap.deltaX($gameMap.canvasToMapX(TouchInput.x), px);
            var deltaY = $gameMap.deltaY($gameMap.canvasToMapY(TouchInput.y), py);
            var d = 0;
            if (Math.abs(deltaX) < Math.abs(deltaY)) {
                if (deltaY > 0) d = 2;
                if (deltaY < 0) d = 8;
            } else {
                if (deltaX > 0) d = 6;
                if (deltaX < 0) d = 4;
            }
            if (d === 0) return;
            if($gameSystem._disableHalfMove == false){
              switch (d) {
                  case 2:
                      py+=0.5;
                      break;
                  case 4:
                      px-=0.5;
                      break;
                  case 6:
                      px+=0.5;
                      break;
                  case 8:
                      py-=0.5;
                      break;
              }

            } else {
                switch (d) {
                    case 2:
                        py++;
                        break;
                    case 4:
                        px--;
                        break;
                    case 6:
                        px++;
                        break;
                    case 8:
                        py--;
                        break;
                }
              }
                $gameTemp.setDestination(px, py);
                $gameTemp._moveStart = true;
        }
    };

})();
