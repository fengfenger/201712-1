var dialogRender = (function () {
    var dialogBg = document.getElementById('dialogBg'),
        dialogBox = document.getElementById('dialogBox'),
        close = utils.getElementsByClassName('close', dialogBox)[0];

    function closeDialog() {
        close.onclick = function () {
            utils.css(dialogBg, 'display', 'none');
            utils.css(dialogBox, {
                display: 'none',
                width: 0,
                height: 0,
                marginTop: 0,
                marginLeft: 0
            });
        }
    }

    function moveDialog() {
        //=>准备数据:T/B/C/D
        var time = 0,
            duration = 200;
        var begin = {},
            change = {},
            target = {
                width: 400,
                height: 500,
                marginTop: -250,
                marginLeft: -200
            };
        for (var key in target) {
            if (target.hasOwnProperty(key)) {
                begin[key] = utils.css(dialogBox, key);
                change[key] = target[key] - begin[key];
            }
        }

        //=>开始运动
        dialogBox.moveTimer = setInterval(function () {
            time += 17;
            if (time >= duration) {
                utils.css(dialogBox, target);
                clearInterval(dialogBox.moveTimer);
                return;
            }
            var curPos = {};
            for (var key in target) {
                if (target.hasOwnProperty(key)) {
                    curPos[key] = time / duration * change[key] + begin[key];
                }
            }
            utils.css(dialogBox, curPos);
        }, 17);
    }

    return {
        init: function () {
            //=>控制显示
            utils.css(dialogBg, 'display', 'block');
            utils.css(dialogBox, 'display', 'block');

            //=>DIALOG-BOX需要有动画的效果:从宽高为零变为我们的目标值(固定时间:500MS)
            moveDialog();

            //=>控制隐藏
            closeDialog();
        }
    }
})();

//=>点击登录按钮显示DIALOG
document.getElementById('login').onclick = function () {
    dialogRender.init();
};
