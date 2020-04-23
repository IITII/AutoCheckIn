let postValue = {
    "province": "**省",
    "city": "**市",
    "district": "**区",
    "street": "***路",
    "xszt": "0",
    "jkzk": "0",
    "jkzkxq": "",
    "sfgl": "1",
    "gldd": "",
    "mqtw": "0",
    "mqtwxq": "",
    "zddlwz": "**省**市**区",
    "sddlwz": "详细地址",
    "bprovince": "**省",
    "bcity": "**市",
    "bdistrict": "*区",
    "bstreet": "***路",
    "sprovince": "**省",
    "scity": "**市",
    "sdistrict": "**区",
    "lng": 114.99203871,
    "lat": 27.11384765,
    "sfby": "1"
}
//let url = "https://fxgl.jx.edu.cn/4136010406/user/qdbp"
$.ajax({
    //url: "../studentQd/saveStu",
    url: "https://fxgl.jx.edu.cn/4136010406/studentQd/saveStu",
    method: "post",
    data: postValue,
    success: function (data) {
        document.getElementsByClassName("foot")[0].setAttribute('msg', JSON.stringify(data))
    }
});