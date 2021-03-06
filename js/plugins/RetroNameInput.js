//=============================================================================
// RetroNameInput.js
//
// Copyright (c) 2019 ina-amagami (ina@amagamina.jp)
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//
// GitHub  : https://github.com/ina-amagami/
// Blog    : https://amagamina.jp
// Twitter : https://twitter.com/ina_amagami
//=============================================================================

/*:
 * @plugindesc レトロゲーム風名前入力
 * @author 天神いな
 *
 * @param Use Walk Character
 * @type boolean
 * @desc 顔グラの代わりに歩行グラを使用するかどうか
 * @default false
 *
 * @help 名前入力ウィンドウを濁点と半濁点を1文字扱いにする
 * レトロゲーム風のものに変更します。
 *
 * デフォルトのものと異なり、1画面でひらがなとカタカナを入力できます。
 *
 * オプションで顔グラ表示の代わりに歩行グラを使用できます。
 */

(function () {

    var parameters = PluginManager.parameters('RetroNameInput');
    var isUseWalkCharacter = Boolean(parameters['Use Walk Character'] === 'true' || false);
    
    // 顔アイコンを歩行キャラに差し替え（オプション）
    Window_NameEdit.prototype.initialize = function(actor, maxLength) {
        var width = this.windowWidth();
        var height = this.windowHeight();
        var x = (Graphics.boxWidth - width) / 2;
        var y = (Graphics.boxHeight - (height + this.fittingHeight(9) + 8)) / 2;
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = actor;
        this._name = actor.name().slice(0, this._maxLength);
        this._index = this._name.length;
        this._maxLength = maxLength;
        this._defaultName = this._name;
        this.deactivate();
        this.refresh();
        if (isUseWalkCharacter) {
            ImageManager.reserveCharacter(actor.characterName());
        } else {
            ImageManager.reserveFace(actor.faceName());
        }
    };
    Window_NameEdit.prototype.faceWidth = function() {
        return isUseWalkCharacter ? 82 : 144;
    };
    Window_NameEdit.prototype.refresh = function() {
        this.contents.clear();
        if (isUseWalkCharacter) {
            this.drawCharacter(this._actor.characterName(), this._actor.characterIndex(), this.left() - 38, this.windowHeight() / 2 + 8);
        } else {
            this.drawActorFace(this._actor, 0, 0);
        }
        for (var i = 0; i < this._maxLength; i++) {
            this.drawUnderline(i);
        }
        for (var j = 0; j < this._name.length; j++) {
            this.drawChar(j);
        }
        var rect = this.itemRect(this._index);
        this.setCursorRect(rect.x, rect.y, rect.width, rect.height);
    };
    
    // 最後の文字まで入力したらカーソルを消す
    var _Window_NameEdit_refresh = Window_NameEdit.prototype.refresh;
    Window_NameEdit.prototype.refresh = function() {
        _Window_NameEdit_refresh.apply(this, arguments);
        if (this._index >= this._maxLength) {
            this.setCursorRect(0, 0, 0, 0);
        }
    };
    Window_NameEdit.prototype.index = function() {
        return this._index;
    };
    Window_NameEdit.prototype.maxLength = function() {
        return this._maxLength;
    };
    
    Window_NameInput.RETRO =
            [ 'あ','い','う','え','お',  'か','き','く','け','こ',  'さ','し','す','せ','そ',
              'た','ち','つ','て','と',  'な','に','ぬ','ね','の',  'は','ひ','ふ','へ','ほ',
              'ま','み','む','め','も',  'や','　','ゆ','　','よ',  'ら','り','る','れ','ろ',
              'わ','　','を','　','ん',  'ぁ','ぃ','ぅ','ぇ','ぉ',  'ゃ','　','ゅ','　','ょ',
              'ア','イ','ウ','エ','オ',  'カ','キ','ク','ケ','コ',  'サ','シ','ス','セ','ソ',
              'タ','チ','ツ','テ','ト',  'ナ','ニ','ヌ','ネ','ノ',  'ハ','ヒ','フ','ヘ','ホ',
              'マ','ミ','ム','メ','モ',  'ヤ','　','ユ','　','ヨ',  'ラ','リ','ル','レ','ロ',
              'ワ','　','ヲ','　','ン',  'ァ','ィ','ゥ','ェ','ォ',  'ャ','　','ュ','　','ョ',
              'っ','　','　','　','ッ',  'ー','　','゛','　','゜',  '　','　','消す','　','決定' ];

    Window_NameInput.prototype.initialize = function(editWindow) {
        var x = editWindow.x - editWindow.width / 4;
        var y = editWindow.y + editWindow.height + 8;
        var width = editWindow.width * 1.5;
        var height = this.windowHeight();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._editWindow = editWindow;
        this._page = 0;
        this._index = 0;
        this.refresh();
        this.updateCursor();
        this.activate();
        
        var _Window_Selectable_select = Window_Selectable.prototype.select;
        this.select = function(index) {
            var prevIndex = this._index;
            this._index = index;
            if (this.isEmpty()) {
                this._index = prevIndex;
                return;
            }
            _Window_Selectable_select.apply(this, arguments);
        }
    };
    
    Window_NameInput.prototype.windowHeight = function() {
        return this.fittingHeight(9);
    };
    
    Window_NameInput.prototype.table = function() {
        return [Window_NameInput.RETRO];
    };
    
    Window_NameInput.prototype.maxCols = function() {
        return 15;
    };
    
    Window_NameInput.prototype.maxItems = function() {
        return 135;
    };
    
    Window_NameInput.prototype.deleteButtonIndex = function() {
        return 132;
    };
    
    Window_NameInput.prototype.okButtonIndex = function() {
        return 134;
    };

    Window_NameInput.prototype.isPageChange = function() {
        return false;
    };
    
    Window_NameInput.prototype.character = function() {
        var char = this.table()[this._page][this._index];
        return this._index !== this.deleteButtonIndex() && !this.isOk() ? char : '';
    };
    
    Window_NameInput.prototype.isEmpty = function() {
        return this.character() === "　";
    };

    Window_NameInput.prototype.isDelete = function() {
        return this._index === this.deleteButtonIndex();
    };
    
    Window_NameInput.prototype.isOk = function() {
        return this._index === this.okButtonIndex();
    };
    
    Window_NameInput.prototype.itemRect = function(index) {
        return {
            x: index % this.maxCols() * 42 + Math.floor(index % this.maxCols() / 5) * 24,
            y: Math.floor(index / this.maxCols()) * this.lineHeight(),
            width: 42,
            height: this.lineHeight()
        };
    };
    
    Window_NameInput.prototype.refresh = function() {
        var table = this.table();
        this.contents.clear();
        this.resetTextColor();
        var maxItems = this.maxItems();
        for (var i = 0; i < maxItems ; i++) {
            var rect = this.itemRect(i);
            rect.x += 3;
            rect.width -= 6;
            this.drawText(table[this._page][i], rect.x, rect.y, rect.width, 'center');
        }
    };
    
    Window_NameInput.prototype.cursorDown = function(wrap) {
        var prevIndex = this._index;
        if (this._index < this.maxItems() - this.maxCols() || wrap) {
            this._index = (this._index + this.maxCols()) % this.maxItems();
        }
        if (this.isEmpty()) {
            if (!wrap)
            {
                this._index = prevIndex;
                return;
            }
            this.cursorDown(true);
        }
    };

    Window_NameInput.prototype.cursorUp = function(wrap) {
        var prevIndex = this._index;
        if (this._index >= this.maxCols() || wrap) {
            this._index = (this._index + this.maxItems() - this.maxCols()) % this.maxItems();
        }
        if (this.isEmpty()) {
            if (!wrap)
            {
                this._index = prevIndex;
                return;
            }
            this.cursorUp(true);
        }
    };

    Window_NameInput.prototype.cursorRight = function(wrap) {
        var prevIndex = this._index;
        if (this._index % this.maxCols() < this.maxCols() - 1) {
            this._index++;
        } else if (wrap) {
            this._index -= this.maxCols() - 1;
        }
        if (this.isEmpty()) {
            if (!wrap)
            {
                this._index = prevIndex;
                return;
            }
            this.cursorRight(true);
        }
    };

    Window_NameInput.prototype.cursorLeft = function(wrap) {
        var prevIndex = this._index;
        if (this._index % this.maxCols() > 0) {
            this._index--;
        } else if (wrap) {
            this._index += this.maxCols() - 1;
        }
        if (this.isEmpty()) {
            if (!wrap)
            {
                this._index = prevIndex;
                return;
            }
            this.cursorLeft(true);
        }
    };
    
    Window_NameInput.prototype.processJump = function() {
        if (this._index !== this.okButtonIndex()) {
            this._index = this.okButtonIndex();
            SoundManager.playCursor();
        }
    };
    
    var _Window_NameInput_processOk = Window_NameInput.prototype.processOk;
    Window_NameInput.prototype.processOk = function() {
        if (this.isDelete()) {
            this.processBack();
            return;
        }
        _Window_NameInput_processOk.call(this);
    };
    
    // 文字が最大まで入力されたらOKボタンに飛ばす
    Window_NameInput.prototype.onNameAdd = function() {
        if (this._editWindow.add(this.character())) {
            SoundManager.playOk();
            if (this._editWindow.index() == this._editWindow.maxLength()) {
                this._index = this.okButtonIndex();
            }
        } else {
            SoundManager.playBuzzer();
        }
    };

}());
