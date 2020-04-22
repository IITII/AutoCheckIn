//TODO 每日签到

// 参数取名规则是拼音首字母
const postVaule = {
    "name": "你的名字",
    "xb": "0",
    "gtjzrysfyyshqzbl": "N",
    "xzzdsfyyqfbqy": "N",
    "jqsfqwzdyq": "N",
    "sfzyblbbdsq": "N",
    "sfyhqzbljcs": "N",
    "sfszsqjfjcxqz": "N",
    "jrtw": "36.7",
    "xcwz": "3",
    "sf": "0",
    "stype": "0",
    "xy": "学院",
    "nj": "2017",
    "bj": "172041",
    "age": "",
    "lxdh": "",
    "jjdh": "",
    "sfz": "",
    "szd": "1",
    "address": "地址",
    "hbc": "火车号",
    "hjtgj": "0",
    "sffx": "1",
    "jkzk": "0"
}
let postUrl = "https://fxgl.jx.edu.cn/4136010406/";
if (postVaule.sf == 0) {
    postUrl += "dcwjEditNew/dcwjSubmit2";
} else {
    postUrl += "dcwjEditNew/dcwjTsubmit2"
}
$.ajax({
    type: 'post',
    url: postUrl,  //路径
    data: { "dcwj": JSON.stringify(postVaule) },
    success: function (data) {  //返回数据根据结果进行相应的处理
        if (data.code == '1001') {
            notifyMe(data.msg)
            console.log('调查问卷完成成功！');
        } else {
            console.log(data.msg);
        }
    }  //请求失败，包含具体的错误信息
    ,
    error: function (e) {
    }
});
function notifyMe(msg) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(msg);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(msg);
            }
        });
    }

    // At last, if the user has denied notifications, and you 
    // want to be respectful there is no need to bother them any more.
}