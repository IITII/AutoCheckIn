//TODO 每日签到

// 参数取名规则是拼音首字母
const postValue = {
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
if (postValue.sf == 0) {
    postUrl += "dcwjEditNew/dcwjSubmit2";
} else {
    postUrl += "dcwjEditNew/dcwjTsubmit2"
}
$.ajax({
    type: 'post',
    url: postUrl,  //路径
    data: { "dcwj": JSON.stringify(postValue) },
    success: function (data) {  //返回数据根据结果进行相应的处理
        if (data.code == '1001') {
            console.log('调查问卷完成成功！');
        } else {
            console.log(data.msg);
        }
        document.getElementsByClassName("foot")[0].setAttribute('msg1',JSON.stringify(data))
    },
    error: function (e) {
    }
});