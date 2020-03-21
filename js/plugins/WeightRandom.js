//=============================================================================
// WeightRandom
// ----------------------------------------------------------------------------
// Copyright (c) 2018 Zipang Factory
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 2018/09/14 初版
//=============================================================================
/*:
 * @plugindesc 重みつきランダム
 * @author ジパング工房
 *
 * @help
 * プラグインコマンドでリージョンを渡すと、
 * 設定した重みをつけたランダムで決定したアイテム番号を
 * 設定したゲーム変数の形で返します。
 * ex. WeightRandom 2 
 *
 * @param ゲーム変数
 * @type variable
 * @desc 指定した番号のゲーム変数にランダムで取得したアイテムIDが自動設定されます。
 * @default 0
 *
 * @param アイテムリスト
 * @type struct<Itemlist>[]
 * @default []
 * @desc リージョンとそこに出るアイテムのリストを設定します。
*/
/*~struct~Itemlist:
 * @param Region
 * @type number
 * @default 0
 * @desc アイテムの出るリージョンを設定します。
 * 
 * @param List
 * @type struct<List>[]
 * @default []
 * @desc アイテムリストを設定します。
 */
 /*~struct~List:
 * @param Name
 * @type string
 * @desc アイテム名を設定します。
 *
 * @param ID
 * @type number
 * @desc アイテムIDを設定します。
 *
 * @param Rate
 * @type number
 * @desc アイテムの出る割合（重み）を設定します。
 */


(function() {
    'use strict';
    var items = {};
    var param = {};
    var getParamString = function(paramNames) {
        if (!Array.isArray(paramNames)) paramNames = [paramNames];
        for (var i = 0; i < paramNames.length; i++) {
            var name = PluginManager.parameters(pluginName)[paramNames[i]];
            if (name) return name;
        }
        return '';
    };

    var getParamNumber = function(paramNames, min, max) {
        var value = getParamString(paramNames);
        if (arguments.length < 2) min = -Infinity;
        if (arguments.length < 3) max = Infinity;
        return (parseInt(value) || 0).clamp(min, max);
    };

    var convertParam = function(param) {
        if (param !== undefined) {
            var arr = [];
            JSON.parse(param).map(function(param) {
                var obj = JSON.parse(param);
                var obj_sub = JSON.parse(obj.List);
                var arr_sub = [];
                obj_sub.forEach(function(value){
                    var obj_sub_sub = JSON.parse(value);
                    arr_sub.push(obj_sub_sub);
                });
                obj.List = arr_sub;
                arr.push(obj);
            });
            return arr;
        }
    };

    const pluginName = 'WeightRandom';
    param.settings_GetVariable = getParamNumber(["ゲーム変数", 0]);
    param.settings_Itemlist = getParamString("アイテムリスト");

     const Itemlist = convertParam(param.settings_Itemlist);

    const itemGet = items => {
        const hit = rand(1, itemboard(items));
        return itemboard(items, hit);
    }

    const itemboard = (items, hit) => {
        let area = 0;
        for (let i = 0, len = items.length; i < len; i++) {
            area += Number(items[i].Rate);
            if (hit && (area >= hit)) return items[i].ID;
        }
        return area;
    }

    const rand = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command == pluginName) {
            for (let i = 0, len = Itemlist.length; i < len; i++) {
                if (Itemlist[i].Region == args[0]) {
                    items = Itemlist[i].List;
                    break;
                }
            }
            const item = itemGet(items);
            $gameVariables.setValue(param.settings_GetVariable, item);
        }
    };
})();