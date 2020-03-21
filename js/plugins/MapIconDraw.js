//=============================================================================
// MapIconDraw.js
// ----------------------------------------------------------------------------
// 公開      ver.1.0 -2017/08/08-
// 最終更新  ver.1.0 -2017/08/08-
// ----------------------------------------------------------------------------
// ■ＴＫＯＯＬ　ＣＯＯＬ
// http://mototkool.blog.fc2.com/
// ■Twitter
// https://twitter.com/_M_GAMES_
//=============================================================================

/*:
 * @plugindesc アイコン画像をマップにイベントとして配置
 * @author mo-to
 * @help 
 * アイコン画像を別で用意しなくても直接マップにイベントとして
 * 配置することが出来ます。
 * ゲームスイッチを使って消したり、他のアイコンに切り替えたりと
 * 普通のイベント画像のように扱えます。
 *
 * ★簡単な使い方★
 * イベント画像を空に指定して、イベント内に【イベントコマンド：注釈】で 
 * <アイコンID:IconIndex> と記述してください。(メモ欄じゃないので注意！)
 * 例）
 * イベント内に注釈で<アイコンID:1>と指定すると戦闘不能のアイコンが
 * マップに配置されます。(デフォルト時)
 *
 */
 
(function() {

    var _Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        if (this._character.getIconIndex() > -1) {
            return this.setIconBitmap();
        }
        _Sprite_Character_updateBitmap.call(this)
    };

    var _Sprite_Character_updateFrame = Sprite_Character.prototype.updateFrame;
    Sprite_Character.prototype.updateFrame = function() {
        if (this._character.getIconIndex() > -1) {
            return this.updateIconFrame();
        }
        _Sprite_Character_updateFrame.call(this);
    };

    Sprite_Character.prototype.setIconBitmap = function() {
        this.bitmap = ImageManager.loadSystem('IconSet');
        this.setFrame(0, 0, 0, 0);
    };
    Sprite_Character.prototype.updateIconFrame = function() {
        var pw = Sprite_StateIcon._iconWidth;
        var ph = Sprite_StateIcon._iconHeight;
        var sx = this._character.getIconIndex() % 16 * pw;
        var sy = Math.floor(this._character.getIconIndex() / 16) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

    var _Game_Character_initMembers = Game_Character.prototype.initMembers;
    Game_Character.prototype.initMembers = function() {
        _Game_Character_initMembers.call(this);
        this._iconIndex = -1;
    };

    Game_Character.prototype.getIconIndex = function() {
        return this._iconIndex;
    };

    var _Game_Event_setupPageSettings = Game_Event.prototype.setupPageSettings;
    Game_Event.prototype.setupPageSettings = function() {
        _Game_Event_setupPageSettings.call(this);
        if (this.page().image.characterName === '') {
            for (var i = 0; i < this.list().length; i++) {
                if (this.list()[i].code === 108 && this.list()[i].parameters[0].match(/<(?:アイコンID):(\d+)>/)) {
                    return this._iconIndex = Number(RegExp.$1);
                }
            }
            this._iconIndex = -1
        }
    };

     
})();