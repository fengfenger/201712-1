/*--REM--*/
~function ($) {
    let computed = ()=> {
        let $HTML = $(document.documentElement),
            winW = $HTML[0].clientWidth,
            value = 100;
        value = winW < 640 ? winW / 640 * 100 : value;
        $HTML.css('fontSize', value);
    };
    computed();
    $(window).on('resize', computed);
}(Zepto);

/*--COOKIE--*/
let cookie = (function () {
    let setValue = (name, value, expires = (new Date(new Date().getTime() + (1000 * 60 * 60 * 24))), path = '/', domain = '')=> {
        document.cookie = `${name}=${escape(value)};expires=${expires.toGMTString()};path=${path};domain=${domain}`;
    };

    let getValue = name=> {
        let cookieInfo = document.cookie,
            reg = new RegExp(`(?:^| )${name}=([^;]*)(?:;|$)`),
            ary = cookieInfo.match(reg);
        return ary ? unescape(ary[1]) : null;
    };

    let removeValue = (name, path = '/', domain = '')=> {
        let value = getValue(name);
        if (value) {
            document.cookie = `${name}= ;path=${path};domain=${domain};expires=Fri,02-Jan-1970 00:00:00 GMT`;
        }
    };

    return {
        set: setValue,
        get: getValue,
        remove: removeValue
    }
})();

/*--QUERY URL--*/
~function () {
    let pro = String.prototype;

    //=>获取URL问号传递的参数值
    pro.myQueryURLParameter = function myQueryURLParameter() {
        let obj = {},
            reg = /[?&#]([^?#&=]+)(?:=([^?#&=]*))?/g;
        this.replace(reg, (...arg)=> {
            /*
             * RES：本次大正则匹配的结果
             * KEY：本次第一个分组捕获的内容(未来做为对象的属性名)
             * VALUE：本次第二个分组捕获的内容(未来做为对象的属性值)
             */
            let [res,key,value]=arg;
            if (res.indexOf('#') > -1) {
                //->这个是HASH的处理
                obj['HASH'] = key;
                return;
            }
            obj[key] = value;
        });
        return obj;
    };
}();

/*--DIALOG--*/
~function () {
    class Dialog {
        constructor(con = '', {
            isTap = true,
            isAuto = 2000,
            callBack = new Function()
        }={}) {
            //=>把需要后期使用的参数值挂载到实例上
            this.con = con;
            this.callBack = callBack;
            this.isTap = isTap;
            this.isAuto = isAuto;

            //=>创建提示层,然后实现相关的功能
            this.init();
        }

        init() {
            //=>1、创建一个弹出层结构
            this.createMark();

            //=>2、控制消失:自动消失或者点击空白消失
            if (this.isAuto != 0) {
                this.autoTimer = setTimeout(()=> {
                    this.removeMark();
                    clearTimeout(this.autoTimer);
                }, this.isAuto);
            }
            if (this.isTap) {
                //=>依赖ZEPTO
                $(document).tap(e=> {
                    let target = e.target,
                        $target = $(target),
                        $par = $target.parent();
                    if ($par.hasClass('box')) return;

                    this.removeMark();
                    clearTimeout(this.autoTimer);
                });
            }
        }

        createMark() {
            let sectionBox = document.createElement('section');
            sectionBox.className = 'markDialog';
            sectionBox.innerHTML = `<div class="box">
                <h3>系统提示</h3>
                <div class="content">${this.con}</div>
            </div>`;
            let container = document.querySelector('.mainBox') || document.body;
            container.appendChild(sectionBox);
            //=>把容器和创建的盒子挂载到实例上
            this.container = container;
            this.sectionBox = sectionBox;
        }

        removeMark() {
            this.container.removeChild(this.sectionBox);

            //=>移除后执行回调函数(把当前实例传递给回调函数)
            this.callBack(this);
        }

        static show(...arg) {
            return new Dialog(...arg);
        }
    }
    window.Dialog = Dialog;
}();
// Dialog.show('提示的内容', {
//     //=>一些配置信息
//     isTap: true,//=>是否支持点击空白处让弹出层消失(默认TRUE)
//     isAuto: 2000,//=>是否支出自动消失,不支持传递零,支持想让多久自动消失就传递多少时间(MS),默认是2000MS
//     callBack: function () {
//         //=>回调函数:当提示消失的时候处理什么事情
//     }
// });



