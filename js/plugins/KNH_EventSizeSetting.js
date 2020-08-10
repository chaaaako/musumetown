//=============================================================================
// KNH_EventSizeSetting.js
//=============================================================================

/*:
 * @plugindesc イベント当たり判定設定プラグイン
 * @author こんにちは
 *
 * @version 1.0.0 2017/10/27 公開
 *
 * @help イベントの当たり判定の大きさを設定できるようにします。
 * 例えば2*3の大きさのイベントを作りたいときに、同じ処理のイベントを
 * 6つ置くのではなく、1つのイベントで済ませることがきるようになります。
 * 
 * イベントのメモ欄に以下のように記入してください。
 * 【】内を記入してください。「\v[1]」等使用できます。
 * 
 * 【<KNHBlock:2,3>】  イベントの当たり判定を横2タイル・縦3タイルの
 *                    大きさにする
 * 
 * 当たり判定の大きさは、「通行判定」、「イベント実行判定」に影響します。
 * 
 * ●「横」の当たり判定について
 *
 * 横の判定は、イベントの位置から左右に均等に増えていきます。
 * 　例：横3の場合、左右に1タイルずつ当たり判定が追加される。
 * 　　　横5の場合、左右に2タイルずつ当たり判定が追加される。
 * また横が「偶数」の場合、余った1タイル分はイベントの位置の「右側」に
 * 追加されます。
 * 　例：横6の場合、左に2タイル、右に3タイルの当たり判定が追加される。
 *
 * ●「縦」の当たり判定について
 *
 * 縦の判定は、イベントの位置から上に増えていきます。
 * 　例：縦2の場合、上に1タイルの当たり判定が追加される。
 * 　　　縦5の場合、上に4タイルの当たり判定が追加される。
 *
 * ●プラグインコマンド    なし
 *
 * ●利用規約
 *   特に無いです。
 */

(function() {
    'use strict';
    var pluginName = 'KNH_EventSizeSetting';
    
    var getBoolean = function(text) {
        return (applyCharacters(text) || '').toUpperCase() === 'ON';
    };
    
    var getNumber = function(text, max, min) {
        text = applyCharacters(text);
        if (isNaN(text)) return NaN;
        return Math.max(Math.min(Number(text), max || Infinity), min || -Infinity);
    };
    
    var getArrayString = function(text) {
        var values = applyCharacters(text).split(',');
        for (var i = 0; i < values.length; i++) {
            values[i] = values[i].trim();
            if (!isNaN(values[i])) values[i] = Number(values[i]);
        }
        return values;
    };
    
    var applyCharacters = function(text) {
        if (text === null) text = '';
        text = '' + text;
        text = text.replace(/\\/g, '\x1b');
        text = text.replace(/\x1b\x1b/g, '\\');
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
            return $gameVariables.value(parseInt(arguments[1], 10));
        }.bind(this));
        text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameActors.actor(parseInt(arguments[1], 10)) : null;
            return actor ? actor.name() : '';
        }.bind(this));
        text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
            var actor = parseInt(arguments[1], 10) >= 1 ? $gameParty.members()[parseInt(arguments[1], 10) - 1] : null;
            return actor ? actor.name() : '';
        }.bind(this));
        if ($dataSystem) text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
        return text;
    };
    
    //-----------------------------------------------------------------------------
    // Game_Event
    //-----------------------------------------------------------------------------
    var _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.apply(this, arguments);
        var meta = this.event().meta.KNHBlock, param = [];
        var param = meta ? getArrayString(meta) : [];
        this._KNHBlockWidth  = param[0] || 1;
        this._KNHBlockHeight = param[1] || 1;
        
        meta = eval('[%1]'.format(this.event().meta.KNHNotPos || ''));
        this._KNHBlockNotPos = meta;
    };

    var _Game_Event_pos = Game_Event.prototype.pos;
    Game_Event.prototype.pos = function(x, y) {
        if (this._KNHBlockWidth >= 2 || this._KNHBlockHeight >= 2) {
            return (this._x - (Math.ceil(this._KNHBlockWidth / 2) - 0.5) < x 
                    && this._x + Math.floor(this._KNHBlockWidth / 2) + 1 > x)
                && (this._y - this._KNHBlockHeight < y && this._y + 1 > y) &&
                !this._KNHBlockNotPos.some(function(xy) {
                    return x === this._x + xy[0] && y === this._y + xy[1];
                }, this);
        } else {
            return _Game_Event_pos.apply(this, arguments);
        }
    };
    
})();
